import { imgixMock } from './plugins/imgix';
import { uploadMock } from './plugins/upload/upload';

export const getStrapiMock = ({ config }: any = {}) => ({
  store: jest.fn().mockImplementation(() => ({
    get: jest.fn(() => Promise.resolve(config)),
    set: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
  })),
  plugin(name: 'upload' | 'imgix') {
    switch (name) {
      case 'upload':
        return uploadMock;
      case 'imgix':
        return imgixMock;
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
    }
  }
});