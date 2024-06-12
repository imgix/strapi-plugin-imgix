import { kebabCase } from 'lodash';

import { pluginId } from '../../../pluginId';
import { HttpError } from '../errors/HttpError';

type URLString = `/${string}`;
export const createHttp = (token: string) => {
  const commonHeaders = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const getURL = (url: string) => `${process.env.STRAPI_ADMIN_BACKEND_URL}/${kebabCase(pluginId)}${url}`;
  const saveParseJSON = async (response: Response) => {
    try {
      return await response.clone().json();
    } catch {
      return await response.clone().text();
    }
  };
  return {
    async delete<Response = unknown>(url: URLString): Promise<Response> {
      const response = await fetch(getURL(url), {
        method: 'DELETE',
        headers: commonHeaders,
      });
      if (response.ok) {
        return saveParseJSON(response);
      }
      const errorResponse = await saveParseJSON(response);
      return Promise.reject(new HttpError('Failed to fetch', errorResponse.error.details));
    },
    async get<Response = unknown>(url: URLString): Promise<Response> {
      const response = await fetch(getURL(url), {
        method: 'GET',
        headers: commonHeaders,
      });
      if (response.ok) {
        return saveParseJSON(response);
      }
      const errorResponse = await saveParseJSON(response);
      const error = new HttpError('Failed to fetch', errorResponse.error.details);
      return Promise.reject(error);
    },
    async put<Body = unknown, Response = unknown>(url: URLString, body: Body): Promise<Response> {
      const response = await fetch(getURL(url), {
        method: 'PUT',
        headers: commonHeaders,
        body: JSON.stringify(body),
      });
      const responseData = await saveParseJSON(response);
      if (response.ok) {
        return responseData;
      }
      const error = new HttpError('Failed to save/update data', responseData.error.details);
      return Promise.reject(error);
    },
  };
};
