import Express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import routers from './routers';

export { default as database } from './database';

dotenv.config();

export const server = Express();

server.use(Express.urlencoded({ extended: true }));
server.use(Express.json());
server.use(cors());

server.use(routers);
