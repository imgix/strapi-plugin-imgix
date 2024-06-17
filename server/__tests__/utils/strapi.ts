import { Strapi } from '@strapi/strapi';
import { imgixMock } from './plugins/imgix';
import { uploadMock } from './plugins/upload/upload';

type StrapiMockConfig = {
  storeConfig?: any;
  config?: any;
  log?: any;
  imgixPlugin?: any;
  uploadPlugin?: any;
};


export const getStrapiMock = ({
  storeConfig,
  config,
  log,
  imgixPlugin = imgixMock,
  uploadPlugin = uploadMock,
}: StrapiMockConfig = {}) => ({
  config,
  log,
  store: jest.fn().mockImplementation(() => ({
    get: jest.fn(() => Promise.resolve(storeConfig)),
    set: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
  })),
  plugin(name: 'upload' | 'imgix') {
    switch (name) {
      case 'upload':
        return uploadPlugin;
      case 'imgix':
        return imgixPlugin;
      default:
        throw new Error(`Unknown plugin: ${name}`);
    }
  },
  admin: {
    services: {
      permission: {
        actionProvider: {
          registerMany: jest.fn(() => Promise.resolve()),
        },
      },
    },
  },
}) as unknown as Strapi;