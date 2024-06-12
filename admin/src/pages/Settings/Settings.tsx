import { Box } from '@strapi/design-system/Box';
import { Button } from '@strapi/design-system/Button';
import { ContentLayout, HeaderLayout } from '@strapi/design-system/Layout';
import { Main } from '@strapi/design-system/Main';
import { Stack } from '@strapi/design-system/Stack';
import { Typography } from '@strapi/design-system/Typography';
import { CheckPermissions, LoadingIndicatorPage, useFocusWhenNavigate, useNotification, useOverlayBlocker } from '@strapi/helper-plugin';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Formik } from 'formik';
import { camelCase, isEmpty, merge, pickBy } from 'lodash';
import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { SOURCE_TYPES } from '../../../../constants';

import { pluginId } from '../../../../pluginId';
import { ConfigData } from '../../../../server/validators';
import { settingsSchema } from '../../../../validators';
import { check } from '../../components/icons';
import { Details, HttpError } from '../../errors/HttpError';
import { useHTTP } from '../../hooks';
import permissions from '../../permissions';
import { getMessage } from '../../utils';
import { AdvanceSection } from './sections/AdvanceSection';
import { BaseSection } from './sections/BaseSection';
import { RestoreSection } from './sections/RestoreSection';
import { HeaderLink } from './styles';
import { FormData } from './types';

export const Settings = () => {
  useFocusWhenNavigate();
  const http = useHTTP();
  const toggleNotification = useNotification();
  const { lockApp, unlockApp } = useOverlayBlocker();
  const { formatMessage } = useIntl();

  const { data, isLoading } = useQuery({
    queryKey: [camelCase(pluginId), 'get-settings'],
    queryFn: () => http.get<ConfigData>('/settings'),
    select: (response) => ({
      mediaLibrarySourceUrl: response.mediaLibrarySourceUrl,
      sourceId: response.source?.id,
      sourceType: response.source?.type,
      sourceUrl: response.source?.url,
      apiKey: response.apiKey,
    }),
  });

  const saveSettings = useMutation({
    mutationKey: [camelCase(pluginId), 'put-settings'],
    mutationFn: (values: ConfigData) => http.put<ConfigData>('/settings', values),
    onSuccess: () => {
      toggleNotification({
        type: 'success',
        message: {
          id: `${camelCase(pluginId)}.page.settings.notification.save.success`,
        },
      });
      unlockApp();
    },
    onError: (error: HttpError<Details[]>) => {
      unlockApp();
      if (error instanceof HttpError) {
        const details = error.response?.map((e: { message: string }) => e.message).join('\n');
        toggleNotification({
          type: 'warning',
          message: {
            id: `${camelCase(pluginId)}.page.settings.notification.save.error`,
            values: { details, br: <br /> },
          },
        });
      }
    },
  });

  const validateAPIKey = useMutation({
    mutationKey: [camelCase(pluginId), 'validate-api-key'],
    mutationFn: (apiKey: string) => http.put<{ apiKey: string }, { valid: boolean }>('/settings/validate', { apiKey }),
  });

  const preparePayload = useCallback((values: FormData) => {
    const source = pickBy({
      id: values.sourceId ? values.sourceId : undefined,
      type: values.sourceType,
      url: values.sourceUrl ? values.sourceUrl : undefined,
    }, (value) => value !== undefined) as ConfigData['source'];
    const payload: ConfigData = {
      mediaLibrarySourceUrl: values.mediaLibrarySourceUrl,
      source: isEmpty(source) ? { url: '', type: SOURCE_TYPES.FOLDER } : source,
    };
    if (values.apiKey?.trim() !== data?.apiKey) {
      payload.apiKey = values.apiKey;
    }
    return payload;
  }, [data]);

  const onSubmitForm = async (values: FormData) => {
    const payload = preparePayload(values);
    lockApp();
    try {
      await saveSettings.mutateAsync(payload);
    } catch { }
  };

  const boxDefaultProps = {
    background: 'neutral0',
    hasRadius: true,
    shadow: 'filterShadow',
    padding: 6,
  };
  const initialValues: FormData = {
    mediaLibrarySourceUrl: '',
    sourceId: '',
    sourceType: SOURCE_TYPES.FOLDER,
    sourceUrl: '',
    apiKey: '',
  };

  const validate = async (values: FormData) => {
    const result = settingsSchema.safeParse(preparePayload(values));
    console.log('result', result);
    const isAPIRequired = values.sourceType === SOURCE_TYPES.OTHER;
    const isOtherAPIKey = values.apiKey && values.apiKey !== data?.apiKey?.trim();
    if (result.success) {
      if (isOtherAPIKey && isAPIRequired) {
        const { valid } = await validateAPIKey.mutateAsync(values.apiKey!);
        if (!valid) {
          return { apiKey: 'page.settings.sections.form.advance.apiKey.errors.invalid' };
        }
      }
      return;
    }
    const errors = result.error.issues.reduce((acc, issue) => {
      acc[camelCase(issue.path.join('.'))] = issue.message;
      return acc;
    }, {} as Record<string, string>);
    if (isEmpty(errors) && isOtherAPIKey && isAPIRequired) {
      const { valid } = await validateAPIKey.mutateAsync(values.apiKey!);
      if (!valid) {
        errors.apiKey = 'page.settings.sections.form.advance.apiKey.errors.invalid';
      }
    }
    return errors;
  };
  if (isLoading) {
    return (
      <LoadingIndicatorPage>
        {getMessage('page.settings.state.loading')}
      </LoadingIndicatorPage>
    );
  }
  return (
    <Main>
      <Formik<FormData>
        onSubmit={onSubmitForm}
        initialValues={merge(initialValues, data)}
        validate={validate}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ handleSubmit, values, errors, handleChange, setValues }) => {
          return (
            <form noValidate onSubmit={handleSubmit}>
              <HeaderLayout
                title={getMessage('page.settings.header.title')}
                subtitle={<Typography variant="epsilon" textColor="neutral400">
                  {formatMessage({
                    id: `${camelCase(pluginId)}.page.settings.header.description`,
                  }, {
                    link: <HeaderLink
                      href="https://docs.imgix.com/libraries#plugins"
                      target="_blank"
                      isExternal>
                      {getMessage('page.settings.header.link')}
                    </HeaderLink>,
                  })}
                </Typography>}
                primaryAction={
                  <CheckPermissions permissions={permissions.settingsChange}>
                    <Button
                      type="submit"
                      startIcon={check}
                    >
                      {getMessage('page.settings.actions.save')}
                    </Button>
                  </CheckPermissions>
                }
              />
              <ContentLayout>
                <Stack size={4}>
                  <Box {...boxDefaultProps}>
                    <BaseSection
                      handleChange={handleChange}
                      mediaLibrarySourceUrl={values.mediaLibrarySourceUrl}
                      sourceUrl={values.sourceUrl}
                      sourceType={values.sourceType}
                      mediaLibrarySourceUrlError={errors.mediaLibrarySourceUrl}
                      sourceUrlError={errors.sourceUrl}
                    />
                  </Box>
                  {values.sourceType === SOURCE_TYPES.OTHER && (
                    <Box {...boxDefaultProps}>
                      <AdvanceSection
                        handleChange={handleChange}
                        apiKey={values.apiKey}
                        sourceId={values.sourceId}
                        sourceIdError={errors.sourceId}
                        apiKeyError={errors.apiKey}
                      />
                    </Box>)}
                  <CheckPermissions permissions={permissions.settingsChange}>
                    <Box {...boxDefaultProps}>
                      <RestoreSection setValues={setValues} />
                    </Box>
                  </CheckPermissions>
                </Stack>
              </ContentLayout>
            </form>
          );
        }}
      </Formik>
    </Main>
  );
};