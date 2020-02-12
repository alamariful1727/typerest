import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import app from '../server/server';
import HttpError from '../error';
import * as http from 'http';

interface RequestWithUser extends Request {
    user: object | string;
}

/**
 * 
 * @param {RequestWithUser} req 
 * @param {Response} res 
 * @param {NextFunction} next
 * @returns {void}
 * @swagger
 *  components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: x-access-token
 */
export const isAuthenticated: any = (req: RequestWithUser, res: Response, next: NextFunction) => {
    const token: any = req.headers['x-access-token'];

    if (token) {
        try {
            const user: object | string = jwt.verify(token, app.get('secret'));

            req.user = user;

            next();

        } catch (error) {
            next(new HttpError(401, http.STATUS_CODES[401]));
        }
    }

    next(new HttpError(400, 'No token provided'));

};
