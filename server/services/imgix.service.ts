import { StrapiContext } from '../../@types';
import { getService } from '../utils';

type ExtendedFile = File & {
  url?: string;
}

export const imgixService = ({ strapi }: StrapiContext) => {
  const BASE_URL = 'https://api.imgix.com/api/v1';
  const settingsService = getService(strapi, 'settings');

  async function addFileToService(file: File & { url?: string }) {
    const { mediaLibrarySourceUrl, source, apiKey } =  await settingsService.getSettings(true);

    // for local development
    const serverHost = strapi.config.get<string>('server.host', 'http://localhost:1337');
    const host = !mediaLibrarySourceUrl && serverHost === '0.0.0.0' ? 'http://localhost:1337/' : mediaLibrarySourceUrl;
    const { isImage } = strapi.plugin('upload').service('image-manipulation');
    if (source?.url && await isImage(file)) {
      const isUrlAbsolute = file.url?.startsWith('http');
      const newURL = (isUrlAbsolute ? file.url : `${host}${file.url}`)?.replace(host, source.url);
      try {
        if (source.id && file.url && apiKey) {
          await service.addAsset(file.url);
        }
        file.url = newURL;
        return Promise.resolve();
      } catch (e: any) {
        file.url = newURL;
        strapi.log.error(`uploadStream: ${e?.message}`);
      }
    }
  }


  const service = {
    getUploadDecorator() {
      return {
        uploadStream: addFileToService,
        upload: addFileToService,
        async delete(file: ExtendedFile) {
          const { source, apiKey } = await getService(strapi, 'settings').getSettings();
          if (source && apiKey && file.url && file.url.startsWith(source.url)) {
            try {
              return await service.purgeAsset(file.url);
            }catch (e: any) {
              strapi.log.error(`delete: ${e?.message}`);
            }
          }
        },
      };
    },
    async validateAPIKey(apiKey: string) {
      const response = await fetch(`${BASE_URL}/sources`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      return { valid: response.ok };
    },
    async addAsset(path: string) {
      const config = await settingsService.getSettings(true);
      const response = await fetch(`${BASE_URL}/sources/${config.source.id}/assets/add/${path}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
      });
      if (response.ok) {
        return;
      }
      return Promise.reject(new Error('Failed to add asset'));
    },
    async purgeAsset(path: string) {
      const config = await settingsService.getSettings(true);
      const response = await fetch(`${BASE_URL}/purge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          'data': {
            'attributes': {
              'url': path,
            },
            'type': 'purges',
          },
        }),
      });
      if (response.ok) {
        return;
      }
      throw new Error('Failed to purge asset');
    },
  };
  return service;
};


export default imgixService;
export type ImgixService = ReturnType<typeof imgixService>;