import { Core } from '@strapi/strapi';
import register from '../src/register';
import { uploadDecoratorMock } from './utils/plugins/imgix/services';
import { getStrapiMock } from './utils/strapi';


describe('Register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const strapiMock = getStrapiMock();

  beforeAll(() => register({ strapi: strapiMock as unknown as Core.Strapi }));

  describe('when call upload from provider', () => {
    it('should call upload from decorator', async () => {
      expect(uploadDecoratorMock.upload).toHaveBeenCalledTimes(0);
      await strapiMock.plugin('upload').provider.upload({ url: 'test' });
      expect(uploadDecoratorMock.upload).toHaveBeenCalledTimes(1);
    });
  });
  describe('when provider implement upload via stream', () => {
    it('should call uploadStream from decorator', async () => {
      expect(uploadDecoratorMock.uploadStream).toHaveBeenCalledTimes(0);
      await strapiMock.plugin('upload').provider.uploadStream({ url: 'test' });
      expect(uploadDecoratorMock.uploadStream).toHaveBeenCalledTimes(1);
    });
  });
  describe('when user remove asset', () => {
    it('should call delete from decorator', async () => {
      expect(uploadDecoratorMock.delete).toHaveBeenCalledTimes(0);
      await strapiMock.plugin('upload').provider.delete({ url: 'test' });
      expect(uploadDecoratorMock.delete).toHaveBeenCalledTimes(1);
    });
  });

});