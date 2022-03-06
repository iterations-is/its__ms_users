import Joi from 'joi';

export interface UserSearchReqDTO {
	id?: string;
	username?: string;
	email?: string;
}

export const UserSearchReqDTOSchema: Joi.ObjectSchema = Joi.object({
	id: Joi.string(),
	username: Joi.string(),
	email: Joi.string(),
}).xor('username', 'email', 'id');
