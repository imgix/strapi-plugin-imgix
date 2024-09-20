import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Formik, FormikHelpers } from 'formik';
// import { camelCase, get, isArray, isEmpty, isNil, merge, pickBy } from 'lodash';
import { camelCase, isEmpty, isNil, merge, pickBy } from 'lodash';

import {
  Page,
  Layouts,
  useNotification,
  // useRBAC
} from '@strapi/admin/strapi-admin';

import { Box, Button, Flex, Link, Typography } from '@strapi/design-system';

import { check } from '../../components/icons';
import { AdvanceSection } from './sections/AdvanceSection';
import { BaseSection } from './sections/BaseSection';
import { AdminSection } from './sections/AdminSection';

import { useHTTP } from '../../hooks';
import pluginPermissions from '../../permissions';
import { getMessage, pluginId } from '../../utils';
import { Details, HttpError } from '../../errors/HttpError';

import { ConfigData, settingsSchema } from '../../validators';

import { SOURCE_TYPES } from '../../constants';

import { HeaderLink } from './styles';

import { FormData } from './types';

// const flattenPermissions = Object.keys(pluginPermissions).reduce((acc: Array<unknown>, key: string) => {
//   const item = get(pluginPermissions, key);
//   if (isArray(item)) {
//     return [...acc, ...item];
//   }
//   return [...acc, item];
// }, []);

const ProtectedSettingsPage = () => (
  <Page.Protect permissions={pluginPermissions.settings}>
    <Settings />
  </Page.Protect>
);

const Settings = () => {
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();
  // const { lockApp, unlockApp } = useOverlayBlocker(); // TODO
  const queryClient = useQueryClient();
  const http = useHTTP();

  const [apiKeyValidation, setApiKeyValidation] = useState(false);
  const [submitInProgress, setSubmitInProgress] = useState(false);

  // const {
  //   isLoading: isLoadingForPermissions,
  //   allowedActions: { canChange },
  // } = useRBAC(flattenPermissions);

  // TODO: Remove after completed investigation performed by Strapi for `useRBAC` and `Protected` issue with AuthProvider in plugins
  const canChange = true;
  const isLoadingForPermissions = false;

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
      queryClient.invalidateQueries({ queryKey: [camelCase(pluginId), 'get-settings'] });
      toggleNotification({
        type: 'success',
        message: formatMessage({
          id: `${camelCase(pluginId)}.page.settings.notification.save.success`,
        }),
      });
    },
    onError: (error: HttpError<Details[]>) => {
      if (error instanceof HttpError) {
        const details = error.response?.map((e: { message: string }) => e.message).join('\n');
        toggleNotification({
          type: 'warning',
          message: formatMessage({
            id: `${camelCase(pluginId)}.page.settings.notification.save.error`,
          }, { details }),
        });
      }
    },
  });

  const validateAPIKey = useMutation({
    mutationKey: [camelCase(pluginId), 'validate-api-key'],
    mutationFn: (apiKey: string) => http.put<{ apiKey: string }, { valid: boolean }>('/settings/validate', { apiKey }),
  });

  const addTrailingSlashes = (value: string) => value.endsWith('/') ? value : `${value}/`;

  const preparePayload = useCallback((values: FormData) => {
    const source = pickBy({
      id: values.sourceType === SOURCE_TYPES.OTHER && values.sourceId ? values.sourceId : undefined,
      type: values.sourceType,
      url: values.sourceUrl ? addTrailingSlashes(values.sourceUrl) : undefined,
    }, (value) => value !== undefined) as ConfigData['source'];
    const payload: ConfigData = {
      mediaLibrarySourceUrl: values.mediaLibrarySourceUrl ? addTrailingSlashes(values.mediaLibrarySourceUrl) : values.mediaLibrarySourceUrl,
      source: isEmpty(source) ? { url: '', type: SOURCE_TYPES.FOLDER } : source,
    };
    if (values.sourceType === SOURCE_TYPES.OTHER) {
      if (values.apiKey?.trim() !== data?.apiKey) {
        payload.apiKey = values.apiKey;
      }
    } else {
      payload.apiKey = undefined;
    }
    return payload;
  }, [data]);

  const onSubmitForm = async (values: FormData, actions: FormikHelpers<FormData>) => {
    setSubmitInProgress(true);
    const payload = preparePayload(values);
    try {
      await saveSettings.mutateAsync(payload);
      actions.resetForm({
        values,
      });
    } catch {

    } finally {
      setSubmitInProgress(false);
    }
  };

  const boxDefaultProps = {
    width: '100%',
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
    const payload = preparePayload(values);
    const result = settingsSchema.safeParse({
      ...payload,
      apiKey: isNil(payload.apiKey) ? data?.apiKey : payload.apiKey,
    });
    const isAPIRequired = values.sourceType === SOURCE_TYPES.OTHER;
    const isOtherAPIKey = values.apiKey && values.apiKey !== data?.apiKey?.trim();
    if (result.success) {
      if (isOtherAPIKey && isAPIRequired) {
        setApiKeyValidation(true);
        const { valid } = await validateAPIKey.mutateAsync(values.apiKey!);
        setApiKeyValidation(false);
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
      setApiKeyValidation(true);
      const { valid } = await validateAPIKey.mutateAsync(values.apiKey!);
      setApiKeyValidation(false);
      if (!valid) {
        errors.apiKey = 'page.settings.sections.form.advance.apiKey.errors.invalid';
      }
    }
    return errors;
  };

  if (isLoading || isLoadingForPermissions) {
    return (
      <Page.Loading>
        {getMessage('page.settings.state.loading')}
      </Page.Loading>
    );
  }

  const asyncActionInProgress = apiKeyValidation || submitInProgress;

  return (
    <Page.Main>
      <Page.Title>{getMessage("page.settings.header.title")}</Page.Title>
      <Formik<FormData>
        onSubmit={onSubmitForm}
        initialValues={merge(initialValues, data)}
        validate={validate}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ handleSubmit, values, errors, dirty, handleChange, setValues }) => {
          return (
            <form noValidate onSubmit={handleSubmit}>
              <Layouts.Header
                title={getMessage('page.settings.header.title')}
                subtitle={<Typography variant="epsilon" textColor="neutral600">
                  {formatMessage({
                    id: `${camelCase(pluginId)}.page.settings.header.description`,
                  }, {
                    link: <HeaderLink>
                      <Link
                        href="https://docs.imgix.com/libraries#plugins"
                        target="_blank"
                        isExternal>
                        {getMessage('page.settings.header.link')}
                      </Link>
                    </HeaderLink>,
                  })}
                </Typography>}
                primaryAction={
                  canChange && (<Button
                    type="submit"
                    startIcon={check}
                    disabled={asyncActionInProgress}
                    loading={asyncActionInProgress}
                  >
                    {getMessage('page.settings.actions.save')}
                  </Button>)
                }
              />
              <Layouts.Content>
                <Flex width="100%" direction="column" gap={6}>
                  <Box {...boxDefaultProps}>
                    <BaseSection
                      handleChange={handleChange}
                      mediaLibrarySourceUrl={values.mediaLibrarySourceUrl}
                      sourceUrl={values.sourceUrl}
                      sourceType={values.sourceType}
                      mediaLibrarySourceUrlError={errors.mediaLibrarySourceUrl}
                      sourceUrlError={errors.sourceUrl}
                      disabled={asyncActionInProgress}
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
                        apiKeyValidation={apiKeyValidation}
                        disabled={asyncActionInProgress}
                      />
                    </Box>)}
                  {canChange && (<Box {...boxDefaultProps}>
                    <AdminSection
                      setValues={setValues}
                      disabled={asyncActionInProgress}
                      dirtyForm={dirty} />
                  </Box>)}
                </Flex>
              </Layouts.Content>
            </form>
          );
        }}
      </Formik>
    </Page.Main>
  );
};

export { ProtectedSettingsPage, Settings };