import { Strapi } from '@strapi/strapi';
import { pluginId } from '../../pluginId';
import { PluginServices } from '../services';

export const getService = <ServiceName extends keyof PluginServices>(strapi: Strapi, serviceName: ServiceName): PluginServices[ServiceName] => {
  return strapi.plugin(pluginId).service(serviceName);
};