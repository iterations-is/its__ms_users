import { Router } from 'express';

import { epSelfData, epSelfDelete } from './external';
import { mwAuthorization } from '../../src-ms';

export const externalRouter = Router();

externalRouter.get('/users/self', mwAuthorization, epSelfData);
externalRouter.delete('/users/self', mwAuthorization, epSelfDelete);
