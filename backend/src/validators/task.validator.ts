import Joi from 'joi';

export const taskValidator = {
  createTask: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    description: Joi.string().max(1000).optional(),
    subtitles: Joi.array().items(Joi.string().max(100)).optional(),
    status: Joi.string().valid('proposed', 'todo', 'inprogress', 'done', 'deployed').optional(),
    projectId: Joi.string().required(),
  }),

  updateTask: Joi.object({
    title: Joi.string().min(1).max(200).optional(),
    description: Joi.string().max(1000).optional(),
    subtitles: Joi.array().items(Joi.string().max(100)).optional(),
    status: Joi.string().valid('proposed', 'todo', 'inprogress', 'done', 'deployed').optional(),
  }),
};
