import {Request, Response, Router} from 'express';
import {AppDataSource} from './logging';
import {IConfig} from './types';
import {ApiLineageEntity, FieldLineageEntity, RecordLineageEntity} from './entities';
import {getFieldTransformer} from "./transforms";

/**
 * Generate lineage information based on provided configuration.
 *
 * @param {IConfig} config - The configuration object containing necessary settings and data.
 *
 * @return {Router} Returns an Express Router instance for handling lineage-related routes.
 */
export function lineageRouterFactory(config: IConfig): Router {
    const router = Router();

    async function generateLineage() {

        const apiLineageRepo = AppDataSource.getRepository(ApiLineageEntity);
        const now = new Date();
        const domainTransformer = config.domainTransformer;
        const server_name = config.serverName || 'defaultServer';

        for (const endpoint of config.restifiedEndpoints({})) {
            if (!endpoint.outRecordTransformers || endpoint.outRecordTransformers.length === 0) continue;

            const api_lineage_id = `${server_name}_${endpoint.path}_${endpoint.methods.join('_')}`;
            let apiLineage = await apiLineageRepo.findOne({
                where: {api_lineage_id},
                relations: ['records', 'records.fields'],
            });

            if (!apiLineage) {
                apiLineage = apiLineageRepo.create({
                    api_lineage_id,
                    server_name,
                    query: endpoint.query,
                    major_version: config.majorVersion,
                    minor_version: config.minorVersion,
                    api_call: endpoint.path,
                    description: `Lineage for ${endpoint.path}`,
                    start_date: now,
                    records: [],
                });
            } else {
                apiLineage.end_date = undefined;
                apiLineage.updated_at = now;
                apiLineage.records = [];
            }

            apiLineage.records = endpoint.outRecordTransformers.map(recordTransformerKey => {
                const recordTransformer = domainTransformer.recordTransformers[recordTransformerKey];
                if (!recordTransformer) {
                    throw new Error(`Record transformer not found: ${recordTransformerKey}`);
                }

                const recordLineageId = `${api_lineage_id}_${recordTransformerKey}`;
                const recordLineage = new RecordLineageEntity();
                recordLineage.record_lineage_id = recordLineageId;
                recordLineage.input_type = recordTransformer.inputDescription;
                recordLineage.output_type = recordTransformer.outputDescription;
                recordLineage.description = recordTransformer.description;
                recordLineage.pk_names = recordTransformer.pkNames?.join(',');
                recordLineage.api_lineage = apiLineage;

                recordLineage.fields = Object.entries(recordTransformer.fieldTransformers).map(([fieldKey, field]) => {
                    const fieldLineage = new FieldLineageEntity();
                    fieldLineage.field_lineage_id = `${recordLineageId}_${fieldKey}`;
                    fieldLineage.field_name = fieldKey;
                    const {description, inputs} = getFieldTransformer(field) || {};
                    fieldLineage.description = description;
                    fieldLineage.input_fields = [inputs ?? fieldKey].join(',');
                    fieldLineage.record_lineage = recordLineage;
                    return fieldLineage;
                });

                return recordLineage;
            });

            await apiLineageRepo.save(apiLineage);
        }
    }

    router.use((request, _response, next) => {
        next();
    });

    router.post(`/generate`, async (_req: Request, res: Response) => {
            try {
                await generateLineage()
                res.json({succeeded: true});
            } catch
                (err) {
                console.error("Lineage generation failed:", err);
                res.status(500).json({succeeded: false, error: (err as Error).message});
            }
        }
    );

    router.get(`/get`, async (req: Request, res: Response) => {
        const params = (req.query ?? {}) as Record<string, unknown>
        const {generate} = params;
        if (generate == 'true') {
            await generateLineage()
        }
        const lineage = await AppDataSource.getRepository(ApiLineageEntity).find({
            relations: ['records', 'records.fields'],
        });
        res.status(200).json(lineage);
    });

    return router;
}
