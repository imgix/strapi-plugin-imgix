import { StrapiContext } from '../../@types';
import permissions from '../../permissions';
import { permissionsChecker, RequestCtx } from '../decorators';
import { getService } from '../utils';
import { getAPIValidator, getSettingsValidator } from '../validators';

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
      async apply(ctx: RequestCtx) {
        try {
          const payload = await getSettingsValidator(ctx.request.body);
          return settingsService.updateSettings(payload);
        } catch (reason) {
          return ctx.badRequest('ValidationError', reason);
        }
      },
    },
    validateAPIKey: {
      permissions: [permissions.render(permissions.settings.change)],
      async apply(ctx: RequestCtx) {
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
  });
};
