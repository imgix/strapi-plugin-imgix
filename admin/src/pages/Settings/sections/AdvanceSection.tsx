import React from 'react';
import { FormikHandlers } from 'formik';

import { Flex } from '@strapi/design-system/Flex';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { Loader } from '@strapi/design-system';
import { Stack } from '@strapi/design-system/Stack';
import { TextInput } from '@strapi/design-system/TextInput';
import { Typography } from '@strapi/design-system/Typography';

import { getError, getMessage } from '../../../utils';

type AdvanceSectionProps = {
  handleChange: FormikHandlers['handleChange'];
  apiKey?: string;
  sourceId?: string;
  sourceIdError?: string;
  apiKeyError?: string;
  apiKeyValidation?: boolean;
  disabled?: boolean;
}

export const AdvanceSection = ({ sourceId, apiKey, handleChange, sourceIdError, apiKeyError, apiKeyValidation, disabled }: AdvanceSectionProps) => {
  const anyFieldFilled = sourceId || apiKey;
  return (
    <Stack size={4}>
      <Flex direction="column" alignItems="flex-start" gap={2}>
        <Typography variant="delta" as="h2">
          {getMessage('page.settings.sections.form.advance.title')}
        </Typography>
        <Typography variant="omega" as="h3" textColor="neutral400">
          {getMessage('page.settings.sections.form.advance.description')}
        </Typography>
      </Flex>
      <Grid gap={4}>
        <GridItem col={6} xs={12}>
          <TextInput
            type="url"
            name="sourceId"
            value={sourceId}
            error={getError(sourceIdError)}
            label={getMessage(
              'page.settings.sections.form.advance.source.id.label',
            )}
            onChange={handleChange}
            hint={getMessage('page.settings.sections.form.advance.source.id.hint')}
            disabled={disabled}
            required={anyFieldFilled}
          />
        </GridItem>
        <GridItem col={6} xs={12}>
          <TextInput
            type="text"
            name="apiKey"
            value={apiKey}
            error={getError(apiKeyError)}
            label={getMessage(
              'page.settings.sections.form.advance.apiKey.label',
            )}
            onChange={handleChange}
            hint={getMessage('page.settings.sections.form.advance.apiKey.hint')}
            endAction={apiKeyValidation && (<Loader small />)}
            disabled={disabled}
            required={anyFieldFilled}
          />
        </GridItem>
      </Grid>
    </Stack>
  );
};
