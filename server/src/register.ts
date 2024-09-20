import { Core } from '@strapi/types';

import { get } from 'lodash';

import { getService } from './utils';

type ExtendedFile = File & {
  url?: string;
}
export default async ({ strapi }: { strapi: Core.Strapi }) => {
  const uploadDecorator = getService(strapi, 'imgix').getUploadDecorator();
  const provider = strapi.plugin('upload').provider;

  Object.keys(provider).forEach((key) => {
    const method = get(uploadDecorator, key);
    if (method) {
      const originalMethod = provider[key];
      provider[key] = async (file: ExtendedFile) => {
        await originalMethod.call(provider, file);

        if (method) {
          await method(file);
          return file;
        }
      };
    }
  });
};
