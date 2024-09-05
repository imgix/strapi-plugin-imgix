import { Core } from '@strapi/types';

export type StrapiContext = { strapi: Core.Strapi };

export type StrapiMedia = {
    id: string | number;
    url: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    previewUrl: string;
    provider: string;
    provider_metadata: any;
    formats: {
        small?: StrapiMedia;
        medium?: StrapiMedia;
        large?: StrapiMedia;
    },
};

export type ToBeFixed = any;