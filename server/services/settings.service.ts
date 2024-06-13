import { isEmpty, pickBy } from 'lodash';

import { StrapiContext } from '../../@types';
import { pluginId } from '../../pluginId';
import { ConfigData } from '../validators';
import { SOURCE_TYPES } from '../../constants';

const settingsService = ({ strapi }: StrapiContext) => {
  return {
    getPluginStore() {
      if (strapi.store) {
        return strapi.store({ type: 'plugin', name: pluginId });
      }
      return {
        get: async () => {},
        set: async () => {},
        delete: async () => {},
      };
    },

    async getSettings(isInternal?: boolean): Promise<Required<ConfigData>> {
      const pluginStore = this.getPluginStore();
      const config = await pluginStore.get({ key: 'config' }) as ConfigData;
      const apiKey = config.apiKey ? `${config.apiKey.slice(0, 2)}${Array.from({ length: 10 }).fill('*').join('')}${config.apiKey.slice(-4)}` : '';
      return {
        mediaLibrarySourceUrl: config.mediaLibrarySourceUrl ?? '',
        source: config.source ?? { id: '', type: SOURCE_TYPES.FOLDER, url: ''},
        apiKey: isInternal ? (config.apiKey || '') : apiKey,
      };
    },

    async updateSettings(config: ConfigData): Promise<ConfigData> {
      const pluginStore = this.getPluginStore();
      const advancedSettingsAllowed = config.source.type === SOURCE_TYPES.OTHER;
      const newSource = pickBy({ 
        id: advancedSettingsAllowed ? config.source?.id : undefined, 
        type: config.source.type, 
        url: config.source?.url }, (value) => value !== undefined);
      
      await pluginStore.set({
        key: 'config',
        value: {
          ...config,
          apiKey: advancedSettingsAllowed ? config.apiKey : undefined,
          source: isEmpty(newSource) ? undefined : newSource,
        },
      });
      return await this.getSettings();
    },

    async restoreConfig(): Promise<ConfigData> {
      await this.updateSettings(this.getLocalConfig());
      return this.getSettings();
    },

    getLocalConfig(): ConfigData {
      const plugin = strapi.plugin(pluginId);
      return {
        mediaLibrarySourceUrl: plugin.config('mediaLibrarySourceUrl', ''),
        apiKey: plugin.config('apiKey', ''),
        source: plugin.config('source', { id: '', type: SOURCE_TYPES.FOLDER, url: '' }),
      };
    },
  };
};

export default settingsService;
export type SettingsService = ReturnType<typeof settingsService>;