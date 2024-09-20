import { Context, ExtendableContext } from 'koa';
import { set } from 'lodash';

export type RequestCtx = Context & Omit<ExtendableContext, 'badRequest'> & {
  badRequest: (message: string, details?: any) => void,
  state: {
    userAbility: {
      can: (action: string) => boolean,
      cannot: (action: string) => boolean,
    },
  }
};

type ControllerMethod<T> = {
  permissions: string[],
  condition?: 'some' | 'every',
  apply: (ctx: RequestCtx) => T,
};

type Controller<T> = {
  [K in keyof T]: ControllerMethod<T[K]>;
};

type PermissionCheckerKey<T> = keyof T;
type PermissionsChecker<T> = Record<PermissionCheckerKey<T>, Controller<T>[PermissionCheckerKey<T>]['apply']>;

export const permissionsChecker = function <T>(controller: Controller<T>): PermissionsChecker<T> {
  return Object.keys(controller).reduce((acc, key) => {
    const method = controller[key as PermissionCheckerKey<T>];
    set(acc, key, async function (ctx: RequestCtx) {
      if (method.permissions.length === 0) {
        return method.apply(ctx);
      }
      if (method.permissions[method.condition || 'some']((permission) => ctx.state.userAbility.can(permission))) {
        return method.apply(ctx);
      }
      return ctx.forbidden('You cannot access this resource');
    });
    return acc;
  }, {} as PermissionsChecker<T>);
};