import { Request, Response, NextFunction } from 'express';

export function runMiddleware(middlewares: any[], req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
        const invokeMiddleware = (index: number) => {
            if (index >= middlewares.length) return resolve();
            middlewares[index](req, res, (err: any) => {
                if (err) reject(err);
                else invokeMiddleware(index + 1);
            });
        };
        invokeMiddleware(0);
    });
}
