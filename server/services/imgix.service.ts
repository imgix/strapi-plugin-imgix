import { isEmpty } from 'lodash';
import { StrapiContext, StrapiMedia, ToBeFixed } from '../../@types';
import { getService } from '../utils';

const FILE_MODEL_UID = 'plugin::upload.file';

type ExtendedFile = File & {
  url?: string;
}

const createChunks = <T>(arr: T[], size: number) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );
};

export const imgixService = ({ strapi }: StrapiContext) => {
  const BASE_URL = 'https://api.imgix.com/api/v1';
  const settingsService = getService(strapi, 'settings');

  async function addFileToService(file: File & { url?: string }) {
    const { mediaLibrarySourceUrl, source, apiKey } = await settingsService.getSettings(true);

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

  const migrateFiles = async (fromUrl: string, targetUrl: string) => {
    const maxDBPool = Math.ceil(strapi.config.get('database.pool.max', 10) / 2);
    const fileRepository = strapi.query(FILE_MODEL_UID);

    const data = await fileRepository.findMany({ where: { url: { $startsWith: fromUrl }, mime: { $contains: 'image' }} });
    const chunks = createChunks(data, maxDBPool);

    for (const chunk of chunks) {
      await Promise.all(chunk.map(async (file: StrapiMedia) => {
        const formats = Object.keys(file.formats || {}).reduce((acc: ToBeFixed, key) => {
          acc[key].url = acc[key].url.replace(fromUrl, targetUrl);
          return acc;
        }, file.formats);

        await fileRepository.update({
          where: {
            id: file.id,
          },
          data: {
            formats: isEmpty(formats) ? null : formats,
            url: file.url.replace(fromUrl, targetUrl),
          },
        });
      }));
    }
  };

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
            } catch (e: any) {
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
    async librarySynchronize() {
      const config = await settingsService.getSettings(true);
      // sync files will be automatically added to the imgix service with the first fetch request
      await migrateFiles(config.mediaLibrarySourceUrl, config.source.url);

      return Promise.resolve({});
    },
    async restoreLibrary() {
      const config = await settingsService.getSettings(true);
      await migrateFiles(config.source.url, config.mediaLibrarySourceUrl);
      return Promise.resolve({});
    },
  };
  return service;
};


export default imgixService;
export type ImgixService = ReturnType<typeof imgixService>;