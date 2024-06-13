import { z } from 'zod';
import { SOURCE_TYPES } from './constants';

export const settingsSchema = z.object({
  mediaLibrarySourceUrl: z.string().url({ message: 'page.settings.sections.form.base.url.errors.format' }),
  apiKey: z.string().optional(),
  source: z.object({
    id: z.string({ message: 'page.settings.sections.form.advance.source.id.errors.format' }).optional(),
    type: z.nativeEnum(SOURCE_TYPES),
    url: z.string({ message: 'page.settings.sections.form.base.source.errors.required' }).url({ message: 'page.settings.sections.form.base.source.errors.format' }),
  }),
}).superRefine((data, ctx) => {
  const anyFieldFilled = data.source.id || data.apiKey;
  if ((data.source.type === SOURCE_TYPES.OTHER) && anyFieldFilled) {
    if (!data.source.id) {
      ctx.addIssue({
        message: 'page.settings.sections.form.advance.errors.required',
        path: ['source', 'id'],
        fatal: true,
        code: z.ZodIssueCode.custom,
      });
    }
    if (!data.apiKey) {
      ctx.addIssue({
        message: 'page.settings.sections.form.advance.errors.required',
        path: ['apiKey'],
        fatal: true,
        code: z.ZodIssueCode.custom,
      });
    }
  }
});

export const apiKeyValidator = z.object({
  apiKey: z.string().refine((apiKey) => apiKey.trim().length > 0),
});