import { isNil } from 'lodash';
import { StrapiContext } from '../../../@types';
import { permissions } from '../permissions';
import { permissionsChecker } from '../decorators';
import { getService } from '../utils';
import { ConfigData, getAPIValidator, getSettingsValidator } from '../validators';

export default ({ strapi }: StrapiContext) => {
  const settingsService = getService(strapi, 'settings');
  const imgixService = getService(strapi, 'imgix');
  return permissionsChecker({
    getSettings: {
      permissions: [permissions.render(permissions.settings.read), permissions.render(permissions.settings.change)],
      async apply() {
        return settingsService.getSettings();
      },
    },
    updateSettings: {
      permissions: [permissions.render(permissions.settings.change)],
      async apply(ctx) {
        try {
          const { apiKey: newApiKey } = ctx.request.body as ConfigData;
          const currentConfig = await settingsService.getSettings(true);
          const { apiKey: currentApiKey } = currentConfig;
          const payload = await getSettingsValidator({
            ...(ctx.request.body as ConfigData),
            apiKey: isNil(newApiKey) ? currentApiKey : newApiKey,
          });
          return settingsService.updateSettings(payload);
        } catch (reason) {
          return ctx.badRequest('ValidationError', reason);
        }
      },
    },
    validateAPIKey: {
      permissions: [permissions.render(permissions.settings.change)],
      async apply(ctx) {
        try {
          const { apiKey } = await getAPIValidator(ctx.request.body);
          return imgixService.validateAPIKey(apiKey);
        } catch (reason) {}
      },
    },
    restoreConfig: {
      permissions: [permissions.render(permissions.settings.change)],
      async apply() {
        return settingsService.restoreConfig();
      },
    },
    librarySynchronize: {
      permissions: [permissions.render(permissions.settings.change)],
      async apply() {
        return imgixService.librarySynchronize();
      },
    },
    restoreLibrary: {
      permissions: [permissions.render(permissions.settings.change)],
      async apply() {
        return imgixService.restoreLibrary();
      },
    }
  });
};
