import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../middleware/errors/request-validation-errors';

export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }
    next();
};