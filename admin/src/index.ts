import { pluginId } from './utils';
import Initializer from './components/Initializer';
import permissions from './permissions';
import trads from './translations';
import prefixPluginTranslations from './utils/prefixTranslations';

function flattenObject(obj: any, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? `${prefix}.` : '';
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], pre + key));
    } else {
      acc[pre + key] = obj[key];
    }
    return acc;
  }, {} as any);
}

export default {
  register(app: any) {
    app.createSettingSection({
      id: pluginId,
      intlLabel: {
        id: `${pluginId}.plugin.section`,
        defaultMessage: `IMGX plugin`,
      },
    }, []);

    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name: pluginId,
    });
  },
  bootstrap(app: any) {
    app.addSettingsLink(pluginId, {
      intlLabel: {
        id: `${pluginId}.plugin.section.item`,
        defaultMessage: 'Configuration',
      },
      id: `${pluginId}.configuration`,
      to: `/settings/${pluginId}`,
      Component: () => import('./pages/Settings').then((mod) => ({ default: mod.SettingsPage })),
      permissions: permissions.settings,
    });
  },
  registerTrads: async function ({ locales = [] }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale: string) => {
        if (locale in trads) {
          const typedLocale = locale as keyof typeof trads;
          return trads[typedLocale]().then(({ default: trad }) => {
            return {
              data: prefixPluginTranslations(flattenObject(trad), pluginId),
              locale,
            };
          });
        }
        return {
          data: prefixPluginTranslations(flattenObject({}), pluginId),
          locale,
        };
      }),
    );
  },
};
