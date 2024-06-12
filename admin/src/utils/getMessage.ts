import { camelCase } from 'lodash';
import { useIntl } from 'react-intl';
import { pluginId } from '../../../pluginId';
import { TranslationPath } from '../translations';

export type MessageInput = TranslationPath | MessageInputObject;

type MessageInputObject = {
  id: TranslationPath;
  props?: {
    [key: string]: any;
  };
};

export const getMessage = (
  input: MessageInput,
  defaultMessage = '',
  inPluginScope = true,
) => {
  const { formatMessage } = useIntl();
  let formattedId = '';
  if (typeof input === 'string') {
    formattedId = input;
  } else {
    formattedId = input?.id.toString() || formattedId;
  }
  return formatMessage(
    {
      id: `${inPluginScope ? camelCase(pluginId) : 'app.components'}.${formattedId}`,
      defaultMessage,
    },
    typeof input === 'string' ? undefined : input?.props,
  );
};
