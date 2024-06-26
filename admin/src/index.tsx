import { prefixPluginTranslations } from '@strapi/helper-plugin';

import pluginPkg from '../../package.json';
import { pluginId } from '../../pluginId';
import Initializer from './components/Initializer';
import permissions from './permissions';
import trads from './translations';

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


const name = pluginPkg.strapi.name;

export default {
  register(app: any) {
    const plugin = {
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    };
    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: {
          id: `${pluginId}.plugin.section`,
          defaultMessage: `IMGX plugin`,
        },
      },
      [
        {
          intlLabel: {
            id: `${pluginId}.plugin.section.item`,
            defaultMessage: 'Configuration',
          },
          id: `${pluginId}.configuration`,
          to: `/settings/${pluginId}`,
          Component: async () => {
            const component = await import(
              /* webpackChunkName: "imgx-settings" */ './pages/Settings'
              );
            return component;
          },
          permissions: permissions.settings,
        },
      ],
    );

    app.registerPlugin(plugin);
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
