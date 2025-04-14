import {NextFunction, Request, Response} from 'express';
import {AppDataSource} from '../entities/data-source';
import {ApiCall} from '../entities/api-call.entity';

export const apiCallLogger = async (req: Request, res: Response, next: NextFunction) => {
    const apiCallRepo = AppDataSource.getRepository(ApiCall);
    const apiCall = apiCallRepo.create({
        method: req.method,
        path: req.path,
        queryParams: req.query,
        requestHeaders: req.headers,
    });

    (req as any).apiCall = await apiCallRepo.save(apiCall);

    next();
};
