import { Router } from 'express';

import { epSelfData, epSelfDelete, epUserData } from './external';
import { mwAuthorization } from '../../src-ms';

export const externalRouter = Router();

externalRouter.get('/users/self', mwAuthorization, epSelfData);
externalRouter.get('/users/:userId', mwAuthorization, epUserData);
externalRouter.delete('/users/self', mwAuthorization, epSelfDelete);
