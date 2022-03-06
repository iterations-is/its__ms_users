import { Router } from 'express';
import { epCreateUser, epSearchUser, epUpdatePassword } from './internal';

export const internalRouter = Router();

internalRouter.post('/users', epCreateUser);
internalRouter.post('/users/search', epSearchUser);
internalRouter.patch('/users/:userId', epUpdatePassword);
