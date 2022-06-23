import jwt from 'jsonwebtoken';

import type { NextFunction, Request, Response } from 'express';
import type { UserPermissionType } from '../services/UserPermissions.service';

import APIError from '../errors/APIError';
import { UserModel } from '../models';

export default (permissions?: UserPermissionType[] | null, self = false) => {
  const controller = async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) throw new APIError('Auth is failed', 401);

    const decoded = jwt.verify(token, <string>process.env.JWT_SECRET);

    if (typeof decoded !== 'object') throw new APIError('Auth is failed', 401);
    if (typeof decoded.uuid !== 'string') throw new APIError('Auth is failed', 401);
    if (typeof decoded.ms !== 'number') throw new APIError('Auth is failed', 401);
    if (typeof decoded.random !== 'string') throw new APIError('Auth is failed', 401);

    const author = await UserModel.findByPk(decoded.uuid);
    if (author) req.author = author;

    if (
      permissions // required permissions
      && (
        // author has permissions
        author?.permissions ? !author.permissions.some((flag) => permissions.includes(flag)) : true
      ) && (self ? req.params.userUuid !== decoded.uuid : true) // token user is authorized
    ) throw new APIError('Specific permission required', 403);

    next();
  };

  return controller;
};
