import React from 'react';
import { useIntl } from 'react-intl';
import { FormikHandlers } from 'formik';
import { camelCase } from 'lodash';

import {
  Field as NativeField,
  Flex,
  Grid,
  SingleSelect,
  SingleSelectOption,
  Typography
} from '@strapi/design-system';

import Field from '../../../components/Field';

import { getError, getMessage, pluginId } from '../../../utils';
import { SOURCE_TYPES, SourceTypeValue } from '../../../constants';
import { HintLink } from '../styles';

type BaseSectionProps = {
  handleChange: FormikHandlers['handleChange'];
  mediaLibrarySourceUrl: string;
  sourceType: SourceTypeValue;
  sourceUrl?: string;
  mediaLibrarySourceUrlError?: string;
  sourceUrlError?: string;
  disabled?: boolean;
}

export const BaseSection = ({ handleChange, mediaLibrarySourceUrl, mediaLibrarySourceUrlError, sourceUrl, sourceUrlError, sourceType, disabled }: BaseSectionProps) => {
  const { formatMessage } = useIntl();

  const handleSelectChange = (value: SourceTypeValue | string | number) => handleChange({ target: { name: 'sourceType', value } });

  return (
    <Flex width="100%" direction="column" alignItems="flex-start" gap={4}>
      <Typography variant="delta" tag="h2">
        {getMessage('page.settings.sections.form.base.title')}
      </Typography>
      <Grid.Root width="100%" gap={4}>
        <Grid.Item col={4} xs={12} alignItems="flex-start">
          <Field
            label={getMessage('page.settings.sections.form.base.source.type.label')}
            hint={<HintLink
              href="https://docs.imgix.com/getting-started/setup/creating-sources"
              target="_blank"
              isExternal>
              {getMessage('page.settings.sections.form.base.source.type.hint')}
            </HintLink>}>
            <SingleSelect
              name="sourceType"
              onChange={handleSelectChange}
              value={sourceType}
              disabled={disabled}>
              {Object.values(SOURCE_TYPES).map((type: SourceTypeValue) => (<SingleSelectOption value={type}>
                {getMessage(`page.settings.sections.form.base.source.type.options.${type}`)}
              </SingleSelectOption>))}
            </SingleSelect>
          </Field>
        </Grid.Item>
        <Grid.Item col={4} xs={12} alignItems="flex-start">
          <Field
            error={getError(mediaLibrarySourceUrlError)}
            label={getMessage('page.settings.sections.form.base.url.label')}
            hint={formatMessage(
              { id: `${camelCase(pluginId)}.page.settings.sections.form.base.url.hint` },
              { example: <em>https://mydomain.com/uploads/</em> }
            )}>
            <NativeField.Input
              type="url"
              name="mediaLibrarySourceUrl"
              value={mediaLibrarySourceUrl}
              onChange={handleChange}
              disabled={disabled}
              required
            />
          </Field>
        </Grid.Item>
        <Grid.Item col={4} xs={12} alignItems="flex-start">
          <Field
            error={getError(sourceUrlError)}
            label={getMessage(`page.settings.sections.form.base.source.${sourceType}.label`)}
            hint={formatMessage(
              { id: `${camelCase(pluginId)}.page.settings.sections.form.base.source.${sourceType}.hint` },
              { example: <em>https://my-source.imgix.net/</em> }
            )}>
            <NativeField.Input
              type="url"
              name="sourceUrl"
              value={sourceUrl}
              onChange={handleChange}
              disabled={disabled}
              required
            />
          </Field>
        </Grid.Item>
      </Grid.Root>
    </Flex>
  );
};
