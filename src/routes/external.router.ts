import { Router } from 'express';
import { mwAuthorization as mwA } from '@its/ms';
import { epSelfData, epSelfDelete, epUserData } from './external';

export const externalRouter = Router();

externalRouter.get('/users/self', mwA, epSelfData);
externalRouter.get('/users/:userId', mwA, epUserData);
externalRouter.delete('/users/self', mwA, epSelfDelete);
