import {NextFunction, Request, Response} from 'express';
import {ApiCall, AppDataSource} from '../entities';

export const apiCallLogger = async (req: Request, res: Response, next: NextFunction) => {
    const apiCallRepo = AppDataSource.getRepository(ApiCall);
    const apiCall = apiCallRepo.create({
        method: req.method,
        path: req.path,
        queryParams: JSON.stringify(req.query),
        requestHeaders: req.headers,
    });

    (req as any).apiCall = await apiCallRepo.save(apiCall);

    next();
};
