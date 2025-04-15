import {Request, Response, Router} from 'express';
import {AppDataSource} from './logging';
import {IConfig} from './types';
import {ApiLineageEntity, FieldLineageEntity, RecordLineageEntity} from './entities';

/**
 * Generate lineage information based on provided configuration.
 *
 * @param {IConfig} config - The configuration object containing necessary settings and data.
 *
 * @return {Router} Returns an Express Router instance for handling lineage-related routes.
 */
export function lineageRouterFactory(config: IConfig): Router {
    const router = Router();

    router.use((request, _response, next) => {
        next();
    });

    router.post(`/generate`, async (_req: Request, res: Response) => {
        const apiLineageRepo = AppDataSource.getRepository(ApiLineageEntity);
        const now = new Date();

        try {
            const domainTransformer = config.domainTransformer;
            const serverName = config.serverName || 'defaultServer';

            for (const endpoint of config.restifiedEndpoints({})) {
                if (!endpoint.outRecordTransformers || endpoint.outRecordTransformers.length === 0) continue;

                const apiLineageId = `${serverName}_${endpoint.path}_${endpoint.methods.join('_')}`;
                let apiLineage = await apiLineageRepo.findOne({
                    where: {apiLineageId},
                    relations: ['records', 'records.fields'],
                });

                if (!apiLineage) {
                    apiLineage = apiLineageRepo.create({
                        apiLineageId,
                        serverName,
                        apiCall: endpoint.path,
                        description: `Lineage for ${endpoint.path}`,
                        startDate: now,
                        records: [],
                    });
                } else {
                    apiLineage.endDate = undefined;
                    apiLineage.updatedAt = now;
                    apiLineage.records = [];
                }

                apiLineage.records = endpoint.outRecordTransformers.map(recordTransformerKey => {
                    const recordTransformer = domainTransformer.recordTransformers[recordTransformerKey];
                    if (!recordTransformer) {
                        throw new Error(`Record transformer not found: ${recordTransformerKey}`);
                }

                    const recordLineageId = `${apiLineageId}_${recordTransformerKey}`;
                const recordLineage = new RecordLineageEntity();
                recordLineage.recordLineageId = recordLineageId;
                recordLineage.inputType = recordTransformer.inputDescription;
                recordLineage.outputType = recordTransformer.outputDescription;
                recordLineage.description = recordTransformer.description;
                recordLineage.pkNames = recordTransformer.pkNames?.join(',');
                recordLineage.apiLineage = apiLineage;

                recordLineage.fields = Object.entries(recordTransformer.fieldTransformers).map(([fieldKey, field]) => {
                    const fieldLineage = new FieldLineageEntity();
                    fieldLineage.fieldLineageId = `${recordLineageId}_${fieldKey}`;
                    fieldLineage.fieldName = fieldKey;
                    fieldLineage.description = field.description;
                    fieldLineage.inputFields = [field.inputs ?? fieldKey].join(',');
                    fieldLineage.recordLineage = recordLineage;
                    return fieldLineage;
                });

                    return recordLineage;
                });

                await apiLineageRepo.save(apiLineage);
            }

            res.json({succeeded: true});

        } catch (err) {
            console.error("Lineage generation failed:", err);
            res.status(500).json({succeeded: false, error: (err as Error).message});
        }
    });

    router.get(`/get`, async (_req: Request, res: Response) => {
        const lineage = await AppDataSource.getRepository(ApiLineageEntity).find({
            relations: ['records', 'records.fields'],
        });
        res.status(200).json(lineage);
    });

    return router;
}
