import { SourceTypeValue } from "../../../../constants";

export type FormData = {
  mediaLibrarySourceUrl: string;
  sourceId?: string;
  sourceType: SourceTypeValue;
  sourceUrl?: string;
  apiKey?: string;
}