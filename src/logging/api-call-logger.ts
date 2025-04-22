import {NextFunction, Request, Response} from 'express';
import {ApiCall, AppDataSource} from '../entities';
import {IConfig} from "../types";

export const apiCallLogger = (config: IConfig) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const apiCallRepo = AppDataSource.getRepository(ApiCall);
        const apiCall = apiCallRepo.create({
            method: req.method,
            path: req.path,
            query_params: JSON.stringify(req.query),
            server_name: config.serverName,
            major_version: config.majorVersion,
            minor_version: config.minorVersion,
            related_institution: req.headers['x-institution-id']?.toString(),
            request_headers: req.headers,
        });

        (req as any).apiCall = await apiCallRepo.save(apiCall);

        next();
    }
};
