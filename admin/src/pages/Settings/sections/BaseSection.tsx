import React from 'react';
import { useIntl } from 'react-intl';
import { FormikHandlers } from 'formik';
import { camelCase } from 'lodash';

import { Grid, GridItem } from '@strapi/design-system/Grid';
import {
  SingleSelect,
  SingleSelectOption
} from '@strapi/design-system';
import { Stack } from '@strapi/design-system/Stack';
import { TextInput } from '@strapi/design-system/TextInput';
import { Typography } from '@strapi/design-system/Typography';

import { getError, getMessage } from '../../../utils';
import { pluginId } from '../../../../../pluginId';
import { SOURCE_TYPES, SourceTypeValue } from '../../../../../constants';
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

  const handleSelectChange = (value: SourceTypeValue) => handleChange({ target: { name: 'sourceType', value } });

  return (
    <Stack size={4}>
      <Typography variant="delta" as="h2">
        {getMessage('page.settings.sections.form.base.title')}
      </Typography>
      <Grid gap={4}>
        <GridItem col={4} xs={12}>
          <SingleSelect
            name="sourceType"
            onChange={handleSelectChange}
            value={sourceType}
            label={getMessage('page.settings.sections.form.base.source.type.label')}
            hint={<HintLink
              href="https://docs.imgix.com/getting-started/setup/creating-sources"
              target="_blank"
              isExternal>
              {getMessage('page.settings.sections.form.base.source.type.hint')}
            </HintLink>}
            disabled={disabled}>
            {Object.values(SOURCE_TYPES).map((type: SourceTypeValue) => (<SingleSelectOption value={type}>
              {getMessage(`page.settings.sections.form.base.source.type.options.${type}`)}
            </SingleSelectOption>))}
          </SingleSelect>
        </GridItem>
        <GridItem col={4} xs={12}>
          <TextInput
            type="url"
            error={getError(mediaLibrarySourceUrlError)}
            name="mediaLibrarySourceUrl"
            value={mediaLibrarySourceUrl}
            label={getMessage(
              'page.settings.sections.form.base.url.label',
            )}
            onChange={handleChange}
            hint={formatMessage({
              id: `${camelCase(pluginId)}.page.settings.sections.form.base.url.hint`,
            }, {
              example: <em>https://mydomain.com/uploads/</em>,
            })}
            disabled={disabled}
            required
          />
        </GridItem>
        <GridItem col={4} xs={12}>
          <TextInput
            type="url"
            name="sourceUrl"
            error={getError(sourceUrlError)}
            value={sourceUrl}
            label={getMessage(`page.settings.sections.form.base.source.${sourceType}.label`)}
            onChange={handleChange}
            hint={formatMessage({
              id: `${camelCase(pluginId)}.page.settings.sections.form.base.source.${sourceType}.hint`,
            }, {
              example: <em>https://my-source.imgix.net/</em>,
            })}
            disabled={disabled}
            required
          />
        </GridItem>
      </Grid>
    </Stack>
  );
};
