import React from 'react';
import { FormikHandlers } from 'formik';
import { isString } from 'lodash';

import {
  Field as NativeField,
  Flex,
  Grid,
  Loader,
  Typography
} from '@strapi/design-system';

import Field from '../../../components/Field';

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
    <Flex width="100%" direction="column" alignItems="flex-start" gap={4}>
      <Flex direction="column" alignItems="flex-start" gap={1}>
        <Typography variant="delta" tag="h2">
          {getMessage('page.settings.sections.form.advance.title')}
        </Typography>
        <Typography variant="omega" tag="h3" textColor="neutral600">
          {getMessage('page.settings.sections.form.advance.description')}
        </Typography>
      </Flex>
      <Grid.Root width="100%" gap={4}>
        <Grid.Item col={6} xs={12} alignItems="flex-start">
          <Field
            error={getError(sourceIdError)}
            label={getMessage('page.settings.sections.form.advance.source.id.label')}
            hint={getMessage('page.settings.sections.form.advance.source.id.hint')}>
            <NativeField.Input
              type="url"
              name="sourceId"
              value={sourceId}
              onChange={handleChange}
              disabled={disabled}
              required={isString(anyFieldFilled)}
            />
          </Field>
        </Grid.Item>
        <Grid.Item col={6} xs={12} alignItems="flex-start">
          <Field
            error={getError(apiKeyError)}
            label={getMessage('page.settings.sections.form.advance.apiKey.label')}
            hint={getMessage('page.settings.sections.form.advance.apiKey.hint')}>
            <NativeField.Input
              type="text"
              name="apiKey"
              value={apiKey}
              onChange={handleChange}
              endAction={apiKeyValidation && (<Loader small />)}
              disabled={disabled}
              required={isString(anyFieldFilled)}
            />
          </Field>
        </Grid.Item>
      </Grid.Root>
    </Flex>
  );
};
