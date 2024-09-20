import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useMutation } from '@tanstack/react-query';
import { FormikHelpers } from 'formik';
import { camelCase } from 'lodash';

import { useNotification } from '@strapi/admin/strapi-admin';

import {
  Button,
  Divider,
  Flex,
  Grid,
  Typography
} from '@strapi/design-system';

import { ConfigData } from '../../../validators';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import { database, lightning } from '../../../components/icons';
import { useHTTP } from '../../../hooks';
import { getMessage, pluginId } from '../../../utils';
import { FormData } from '../types';

type AdminSectionProps = {
  setValues: FormikHelpers<FormData>['setValues'];
  disabled?: boolean;
  dirtyForm?: boolean;
};

export const AdminSection = ({ setValues, disabled, dirtyForm }: AdminSectionProps) => {
  const { formatMessage } = useIntl();
  const [isRestoreVisible, setIsRestoreVisible] = useState(false);
  const [isForceSyncVisible, setIsForceSyncVisible] = useState(false);
  const [isForceDesyncVisible, setIsForceDesyncVisible] = useState(false);
  const http = useHTTP();
  const { toggleNotification } = useNotification();

  const handleRestoreConfirmation = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsRestoreVisible(true);
  }, []);

  const handleForceSyncConfirmation = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsForceSyncVisible(true);
  }, []);

  const handleForceDesyncConfirmation = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsForceDesyncVisible(true);
  }, []);

  const restoreMutation = useMutation({
    mutationKey: [camelCase(pluginId), 'restore-settings'],
    mutationFn: () => http.put<{}, ConfigData>('/settings/restore', {}),
    throwOnError: false,
    onSuccess: (values: ConfigData) => {
      toggleNotification({
        type: 'success',
        message: formatMessage({
          id: `${camelCase(pluginId)}.page.settings.notification.admin.restore.success`,
        }),
      });
      setValues({
        mediaLibrarySourceUrl: values.mediaLibrarySourceUrl,
        apiKey: values.apiKey,
        sourceId: values.source?.id,
        sourceType: values.source?.type,
        sourceUrl: values.source?.url,
      }, false);
    },
    onError: () => {
      toggleNotification({
        type: 'warning',
        message: formatMessage({
          id: `${camelCase(pluginId)}.page.settings.notification.admin.restore.error`,
        }),
      });
    },
  });

  const forceSyncMutation = useMutation({
    mutationKey: [camelCase(pluginId), 'sync-library'],
    mutationFn: () => http.put<{}, ConfigData>('/settings/library/synchronize', {}),
    throwOnError: false,
    onSuccess: () => {
      toggleNotification({
        type: 'success',
        message: formatMessage({
          id: `${camelCase(pluginId)}.page.settings.notification.admin.sync.success`,
        }),
      });
    },
    onError: () => {
      toggleNotification({
        type: 'warning',
        message: formatMessage({
          id: `${camelCase(pluginId)}.page.settings.notification.admin.sync.error`,
        }),
      });
    },
  });

  const forceDesyncMutation = useMutation({
    mutationKey: [camelCase(pluginId), 'desync-library'],
    mutationFn: () => http.put<{}, ConfigData>('/settings/library/restore', {}),
    throwOnError: false,
    onSuccess: () => {
      toggleNotification({
        type: 'success',
        message: formatMessage({
          id: `${camelCase(pluginId)}.page.settings.notification.admin.desync.success`,
        }),
      });
    },
    onError: () => {
      toggleNotification({
        type: 'warning',
        message: formatMessage({
          id: `${camelCase(pluginId)}.page.settings.notification.admin.desync.error`,
        }),
      });
    },
  });

  const onConfirmRestore = async () => {
    try {
      await restoreMutation.mutateAsync();
      setIsRestoreVisible(false);
    } catch { }
  };

  const onCancelRestore = useCallback(() => {
    setIsRestoreVisible(false);
  }, []);

  const onConfirmForceSync = async () => {
    try {
      await forceSyncMutation.mutateAsync();
      setIsForceSyncVisible(false);
    } catch { }
  };

  const onCancelForceSync = useCallback(() => {
    setIsForceSyncVisible(false);
  }, []);

  const onConfirmForceDesync = async () => {
    try {
      await forceDesyncMutation.mutateAsync();
      setIsForceDesyncVisible(false);
    } catch { }
  };

  const onCancelForceDesync = useCallback(() => {
    setIsForceDesyncVisible(false);
  }, []);

  return (
    <Flex width="100%" direction="column" alignItems="flex-start" gap={4}>
      <Flex width="100%" direction="column" alignItems="flex-start" gap={2}>
        <Typography variant="delta" tag="h2">
          {getMessage('page.settings.sections.admin.title')}
        </Typography>
      </Flex>
      <Grid.Root width="100%" gap={4}>
        <Grid.Item col={8}>
          <Flex width="100%" direction="column" alignItems="flex-start" gap={1}>
            <Typography variant="epsilon" tag="h3">
              {getMessage('page.settings.sections.admin.restore.title')}
            </Typography>
            <Typography variant="pi" tag="h4">
              {getMessage('page.settings.sections.admin.restore.subtitle')}
            </Typography>
          </Flex>
        </Grid.Item>
        <Grid.Item col={4}>
          <Flex width="100%" height="100%" direction="row" alignItems="center" justifyContent="flex-end">
            <Button
              variant="danger-light"
              startIcon={lightning}
              onClick={handleRestoreConfirmation}
              disabled={disabled}
            >
              {getMessage('page.settings.actions.admin.restore')}
            </Button>
          </Flex>

          <ConfirmationDialog
            isVisible={isRestoreVisible}
            isActionAsync={false}
            header={getMessage(
              'page.settings.sections.admin.restore.confirmation.header',
            )}
            labelConfirm={getMessage(
              'page.settings.sections.admin.restore.confirmation.button.confirm',
            )}
            iconConfirm={lightning}
            onConfirm={onConfirmRestore}
            onCancel={onCancelRestore}
          >
            <Typography>
              {getMessage(
                'page.settings.sections.admin.restore.confirmation.description',
              )}
            </Typography>
          </ConfirmationDialog>
        </Grid.Item>
        <Grid.Item col={12}>
          <Divider width="100%" />
        </Grid.Item>
        <Grid.Item col={8}>
          <Flex width="100%" direction="column" alignItems="flex-start" gap={1}>
            <Typography variant="epsilon" tag="h3">
              {getMessage('page.settings.sections.admin.sync.title')}
            </Typography>
            <Typography variant="pi" tag="h4">
              {getMessage('page.settings.sections.admin.sync.subtitle')}
            </Typography>
          </Flex>
        </Grid.Item>
        <Grid.Item col={4}>
          <Flex width="100%" height="100%" direction="row" alignItems="center" justifyContent="flex-end">
            <Button
              variant="danger-light"
              startIcon={database}
              onClick={handleForceSyncConfirmation}
              disabled={disabled || dirtyForm}
            >
              {getMessage('page.settings.actions.admin.sync')}
            </Button>
          </Flex>

          <ConfirmationDialog
            isVisible={isForceSyncVisible}
            isActionAsync={forceSyncMutation.isPending}
            header={getMessage(
              'page.settings.sections.admin.sync.confirmation.header',
            )}
            labelConfirm={getMessage(
              'page.settings.sections.admin.sync.confirmation.button.confirm',
            )}
            iconConfirm={database}
            onConfirm={onConfirmForceSync}
            onCancel={onCancelForceSync}
          >
            <Flex width="100%" direction="column" gap={4}>
              <Typography>
                {getMessage(
                  'page.settings.sections.admin.sync.confirmation.description',
                )}
              </Typography>
              <Divider width="100%" />
              <Typography textColor="warning500" textAlign="center" fontWeight="bold" variant="pi">
                {getMessage(
                  'page.settings.sections.admin.sync.confirmation.alert',
                )}
              </Typography>
            </Flex>
          </ConfirmationDialog>
        </Grid.Item>
        <Grid.Item col={12}>
          <Divider width="100%" />
        </Grid.Item>
        <Grid.Item col={8}>
          <Flex width="100%" direction="column" alignItems="flex-start" gap={1}>
            <Typography variant="epsilon" tag="h3">
              {getMessage('page.settings.sections.admin.desync.title')}
            </Typography>
            <Typography variant="pi" tag="h4">
              {getMessage('page.settings.sections.admin.desync.subtitle')}
            </Typography>
          </Flex>
        </Grid.Item>
        <Grid.Item col={4}>
          <Flex width="100%" height="100%" direction="row" alignItems="center" justifyContent="flex-end">
            <Button
              variant="danger-light"
              startIcon={database}
              onClick={handleForceDesyncConfirmation}
              disabled={disabled || dirtyForm}
            >
              {getMessage('page.settings.actions.admin.desync')}
            </Button>
          </Flex>

          <ConfirmationDialog
            isVisible={isForceDesyncVisible}
            isActionAsync={forceDesyncMutation.isPending}
            header={getMessage(
              'page.settings.sections.admin.desync.confirmation.header',
            )}
            labelConfirm={getMessage(
              'page.settings.sections.admin.desync.confirmation.button.confirm',
            )}
            iconConfirm={database}
            onConfirm={onConfirmForceDesync}
            onCancel={onCancelForceDesync}
          >
            <Flex width="100%" direction="column" gap={4}>
              <Typography>
                {getMessage(
                  'page.settings.sections.admin.desync.confirmation.description',
                )}
              </Typography>
              <Divider width="100%" />
              <Typography textColor="warning500" textAlign="center" fontWeight="bold" variant="pi">
                {getMessage(
                  'page.settings.sections.admin.desync.confirmation.alert',
                )}
              </Typography>
            </Flex>
          </ConfirmationDialog>
        </Grid.Item>
      </Grid.Root>
    </Flex>

  );
};
