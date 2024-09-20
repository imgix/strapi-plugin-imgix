import { z } from 'zod';
import { apiKeyValidator, settingsSchema } from '../validators';

export const getSettingsValidator = (payload: unknown) => {
  const result = settingsSchema.safeParse(payload);
  if (!result.success) {
    const reason = result.error.issues
    .map((i) => ({ path: i.path.join('.'), message: i.message }))
    return Promise.reject(reason);
  }
  return Promise.resolve(result.data);
};

export const getAPIValidator = (payload: unknown) => {
  const result = apiKeyValidator.safeParse(payload);
  if (!result.success) {
    const reason = result.error.issues
    .map((i) => ({ path: i.path.join('.'), message: i.message }))
    return Promise.reject(reason);
  }
  return Promise.resolve(result.data);

}

export type ConfigData = z.infer<typeof settingsSchema>;