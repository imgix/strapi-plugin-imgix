import { FetchResponse, useFetchClient } from '@strapi/admin/strapi-admin';
import { isNil, kebabCase } from 'lodash';

import { pluginId } from '../utils';
import { HttpError } from '../errors/HttpError';

type URLString = `/${string}`;
export const createHttp = () => {
  const { get, del, put } = useFetchClient();
  const getURL = (url: string) => `${process.env.STRAPI_ADMIN_BACKEND_URL}/${kebabCase(pluginId)}${url}`;
  const isOk = (response: FetchResponse) => !isNil(response.data);
  const extractError = (response: FetchResponse) => response.data.error;
  return {
    async delete<Response = unknown>(url: URLString): Promise<Response> {
      const response = await del(getURL(url));
      if (isOk(response)) {
        return response.data;
      }
      const errorResponse = extractError(response);
      return Promise.reject(new HttpError('Failed to fetch', errorResponse.details));
    },
    async get<Response = unknown>(url: URLString): Promise<Response> {
      const response = await get(getURL(url), {
      });
      if (isOk(response)) {
        return response.data;
      }
      const errorResponse = extractError(response);
      const error = new HttpError('Failed to fetch', errorResponse.details);
      return Promise.reject(error);
    },
    async put<Body = unknown, Response = unknown>(url: URLString, body: Body): Promise<Response> {
      const response = await put(getURL(url), body);
      if (isOk(response)) {
        return response.data;
      }
      const errorResponse = extractError(response);
      const error = new HttpError('Failed to save/update data', errorResponse.details);
      return Promise.reject(error);
    },
  };
};
