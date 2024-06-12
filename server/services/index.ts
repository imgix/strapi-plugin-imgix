import imgixService from './imgix.service';
import settingsService from './settings.service';

const pluginServices = {
  settings: settingsService,
  imgix: imgixService,
};

export type PluginServices = {
  [key in keyof typeof pluginServices]: ReturnType<typeof pluginServices[key]>;
};
export default pluginServices;
