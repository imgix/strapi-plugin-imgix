import { Core } from '@strapi/strapi';
import { SOURCE_TYPES } from '../src/constants';
import { permissions } from '../src/permissions';
import { pluginId } from '../src/utils';
import bootstrap from '../src/bootstrap';
import { imgixMock } from './utils/plugins/imgix';
import { getStrapiMock } from './utils/strapi';

describe('Bootstrap', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('saveConfig', () => {
    describe('when config not exist in store', () => {
      const strapiMock = getStrapiMock();
      beforeEach(() => bootstrap({ strapi: strapiMock as unknown as Core.Strapi }));
      it('should save default config in to store', async () => {
        // read from store previous config if available
        expect(strapiMock.store).toHaveBeenCalledTimes(1);
        expect(strapiMock.store).toHaveBeenCalledWith({ type: 'plugin', name: pluginId });
        const get = strapiMock.store.mock.results.find(_ => _.type === 'return')?.value.get;
        expect(get).toHaveBeenCalledTimes(1);
        expect(get).toHaveBeenCalledWith({ key: 'config' });
        // save default config in to store
        expect(imgixMock.config).toHaveBeenCalledTimes(3);
        const set = strapiMock.store.mock.results.find(_ => _.type === 'return')?.value.set;
        expect(set).toHaveBeenCalledTimes(1);
        expect(set).toHaveBeenCalledWith({ key: 'config', value: { apiKey: '', mediaLibrarySourceUrl: '', source: { id: '', type: SOURCE_TYPES.FOLDER, url: '' } } });
      });
    });
    describe('when config exist in store', () => {
      const strapiMock = getStrapiMock({ storeConfig: {} });
      beforeEach(() => bootstrap({ strapi: strapiMock as unknown as Core.Strapi }));

      it('should do not save config', async () => {
        // read from store previous config if available
        expect(strapiMock.store).toHaveBeenCalledTimes(1);
        expect(strapiMock.store).toHaveBeenCalledWith({ type: 'plugin', name: pluginId });
        const get = strapiMock.store.mock.results.find(_ => _.type === 'return')?.value.get;
        expect(get).toHaveBeenCalledTimes(1);
        expect(get).toHaveBeenCalledWith({ key: 'config' });
        // save default config in to store
        expect(imgixMock.config).toHaveBeenCalledTimes(0);
        const set = strapiMock.store.mock.results.find(_ => _.type === 'return')?.value.set;
        expect(set).toHaveBeenCalledTimes(0);
      });
    });
  });
  describe('addPermissions', () => {
    const strapiMock = getStrapiMock();

    beforeEach(() => bootstrap({ strapi: strapiMock as unknown as Core.Strapi }));

    it('should add permission plugin', () => {
      expect(strapiMock.admin.services.permission.actionProvider.registerMany).toHaveBeenCalledTimes(1);
      expect(strapiMock.admin.services.permission.actionProvider.registerMany).toHaveBeenCalledWith([
        {
          section: 'plugins',
          displayName: 'Settings: Read',
          uid: permissions.settings.read,
          pluginName: pluginId,
        },
        {
          section: 'plugins',
          displayName: 'Settings: Change',
          uid: permissions.settings.change,
          pluginName: pluginId,
        },
      ]);
    });
  });
});
