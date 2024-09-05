import { pluginId } from './utils';

const settings = {
  read: 'settings.read',
  change: 'settings.change',
} as const;
type Settings = typeof settings;

const render = (uid: Settings[keyof Settings]) => `plugin::${pluginId}.${uid}`;
export const permissions = {
  render,
  settings,
} as const;

export type Permissions = typeof permissions;

