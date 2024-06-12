import { auth } from '@strapi/helper-plugin';
import { useMemo } from 'react';
import { createHttp } from '../utils/http';

export const useHTTP = () => {
  return useMemo(() => createHttp(auth.getToken()), []);
};