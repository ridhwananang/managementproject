// resources/js/utils/route.ts
import { route as ziggyRoute } from 'ziggy-js';
import ZiggyConfig from '@/routes';

// Pastikan fungsi selalu mengembalikan string URL
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const route = (name: string, params?: any, absolute = true): string => {
  // @ts-expect-error: ZiggyConfig tidak harus cocok dengan tipe Config bawaan
  return ziggyRoute(name, params ?? {}, absolute, ZiggyConfig).toString();
};
