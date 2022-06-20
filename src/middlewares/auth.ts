import jwt from 'jsonwebtoken';

import type { NextFunction, Request, Response } from 'express';

import APIError from '../errors/APIError';
import { UserPermissionsService, UserPermissionType } from '../services/UserPermissions.service';

export default (permission?: UserPermissionType) => {
  const controller = (req: Request, _res: Response, next: NextFunction) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) throw new APIError('Auth is failed', 401);

    const decoded = jwt.verify(token, <string>process.env.JWT_SECRET);

    if (typeof decoded !== 'object') throw new APIError('Auth is failed', 401);
    if (typeof decoded.uuid !== 'string') throw new APIError('Auth is failed', 401);
    if (typeof decoded.ms !== 'number') throw new APIError('Auth is failed', 401);
    if (typeof decoded.random !== 'string') throw new APIError('Auth is failed', 401);
    if (typeof decoded.permissions !== 'bigint' && decoded.permissions !== null) throw new APIError('Auth is failed', 401);
    if (req.params.userUuid && decoded.uuid === req.params.userUuid) throw new APIError('Auth is failed', 401);

    const perms = decoded.permissions ? UserPermissionsService.resolve(decoded.permissions) : null;
    if (permission && (!perms || !perms.includes(permission))) throw new APIError('Specific permission required', 403);

    req.params.tokenUserUuid = decoded.uuid;

    next();
  };

  return controller;
};
