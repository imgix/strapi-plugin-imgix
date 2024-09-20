import { SOURCE_TYPES } from '../constants';
import { ConfigData } from '../validators';

const defaultConfig: ConfigData = {
  mediaLibrarySourceUrl: '',
  apiKey: '',
  source: {
    id: '',
    type: SOURCE_TYPES.FOLDER,
    url: '',
  },
};

export default {
  default: defaultConfig,
  validator() {},
};
