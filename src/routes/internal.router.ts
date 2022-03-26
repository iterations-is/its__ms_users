import { Router } from 'express';
import { epCreateUser, epSearchUser, epUpdatePassword } from './internal';
import { mwApiInternal } from '@its/ms';

export const internalRouter = Router();

internalRouter.post('/users', mwApiInternal, epCreateUser);
internalRouter.post('/users/search', mwApiInternal, epSearchUser);
internalRouter.patch('/users/:userId', mwApiInternal, epUpdatePassword);
