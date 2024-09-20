import { Core } from '@strapi/types';

import { permissions } from './permissions';
import { pluginId } from './utils';
import { ConfigData } from './validators';
import { SOURCE_TYPES } from './constants';

async function saveConfig(strapi: Core.Strapi) {
  if (strapi.store) {
    const pluginStore = strapi.store({ type: 'plugin', name: pluginId });
    const config = await pluginStore.get({ key: 'config' });
    
    // add config to store if it doesn't exist
    if (!config) {
      const plugin = strapi.plugin(pluginId);
      const mediaLibrarySourceUrl = plugin.config<string>('mediaLibrarySourceUrl', '');
      const source = plugin.config<ConfigData['source']>('source', { id: '', type: SOURCE_TYPES.FOLDER, url: '' });
      const apiKey = plugin.config<string>('apiKey', '');
      await pluginStore.set({
        key: 'config',
        value: {
          mediaLibrarySourceUrl,
          source,
          apiKey,
        },
      });
    }
  }
}

async function addPermissions(strapi: Core.Strapi) {
  const actions = [
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
  ];
  await strapi.admin?.services.permission.actionProvider.registerMany(actions);
}

export default async ({ strapi }: { strapi: Core.Strapi }) => {
  await saveConfig(strapi);
  await addPermissions(strapi);
};
