import { Core } from '@strapi/types';

import { pluginId } from '../utils';
import { PluginServices } from '../services';

export const getService = <ServiceName extends keyof PluginServices>(strapi: Core.Strapi, serviceName: ServiceName): PluginServices[ServiceName] => {
  return strapi.plugin(pluginId).service(serviceName);
};