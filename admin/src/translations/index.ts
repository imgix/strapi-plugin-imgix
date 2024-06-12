import type { EN } from './en';

type Path<T, Key extends keyof any = keyof T> =
  Key extends keyof T
    ? T[Key] extends Record<string, any>
      ? T[Key] extends ArrayLike<any>
        ? Key | `${Key & string}.${Path<T[Key], Exclude<keyof T[Key], keyof any[]>> & string}`
        : Key | `${Key & string}.${Path<T[Key]> & string}`
      : Key
    : never;


export type TranslationPath = Path<EN>;

const trads = {
  en: () => import('./en'),
};

export default trads;
