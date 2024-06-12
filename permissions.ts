import { pluginId } from './pluginId';

const settings = {
  read: 'settings.read',
  change: 'settings.change',
} as const;
type Settings = typeof settings;

const render = (uid: Settings[keyof Settings]) => `plugin::${pluginId}.${uid}`;
const permissions = {
  render,
  settings,
} as const;

export type Permissions = typeof permissions;

export default permissions;
