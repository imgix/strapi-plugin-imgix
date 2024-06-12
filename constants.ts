export type SourceType = keyof typeof SOURCE_TYPES;
export type SourceTypeValue = typeof SOURCE_TYPES[SourceType];

export const SOURCE_TYPES = {
    FOLDER: 'webfolder',
    OTHER: 'other',
} as const;