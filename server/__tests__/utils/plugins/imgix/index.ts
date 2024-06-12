import { imgixServiceMock, settingsServiceMock } from './services';

export const imgixMock = {
  service(name: 'imgix' | 'settings') {
    switch (name) {
      case 'imgix':
        return imgixServiceMock;
      case 'settings':
        return settingsServiceMock;
      default: {
        throw new Error(`Unknown service: ${name}`);
      }
    }
  },
  config: jest.fn((_path: string, defaultValue: any) => {
    return defaultValue;
  }),
};
