import React, { useCallback, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { FormikHelpers } from 'formik';
import { camelCase } from 'lodash';

import { Button } from '@strapi/design-system/Button';
import { Divider } from '@strapi/design-system/Divider';
import { Flex } from '@strapi/design-system/Flex';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { Stack } from '@strapi/design-system/Stack';
import { Typography } from '@strapi/design-system/Typography';
import { useNotification } from '@strapi/helper-plugin';

import { pluginId } from '../../../../../pluginId';
import { ConfigData } from '../../../../../server/validators';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import { database, refresh } from '../../../components/icons';
import { useHTTP } from '../../../hooks';
import { getMessage } from '../../../utils';
import { FormData } from '../types';

type AdminSectionProps = {
  setValues: FormikHelpers<FormData>['setValues'];
  disabled?: boolean;
  dirtyForm?: boolean;
}


export const AdminSection = ({ setValues, disabled, dirtyForm }: AdminSectionProps) => {
  const [isRestoreVisible, setIsRestoreVisible] = useState(false);
  const [isForceSyncVisible, setIsForceSyncVisible] = useState(false);
  const [isForceDesyncVisible, setIsForceDesyncVisible] = useState(false);
  const http = useHTTP();
  const toggleNotification = useNotification();

  const handleRestoreConfirmation = useCallback(() => {
    setIsRestoreVisible(true);
  }, []);

  const handleForceSyncConfirmation = useCallback(() => {
    setIsForceSyncVisible(true);
  }, []);

  const handleForceDesyncConfirmation = useCallback(() => {
    setIsForceDesyncVisible(true);
  }, []);

  const restoreMutation = useMutation({
    mutationKey: [camelCase(pluginId), 'restore-settings'],
    mutationFn: () => http.put<{}, ConfigData>('/settings/restore', {}),
    throwOnError: false,
    onSuccess: (values: ConfigData) => {
      toggleNotification({
        type: 'success',
        message: {
          id: `${camelCase(pluginId)}.page.settings.notification.admin.restore.success`,
        },
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
        message: {
          id: `${camelCase(pluginId)}.page.settings.notification.admin.restore.error`,
        },
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
        message: {
          id: `${camelCase(pluginId)}.page.settings.notification.admin.sync.success`,
        },
      });
    },
    onError: () => {
      toggleNotification({
        type: 'warning',
        message: {
          id: `${camelCase(pluginId)}.page.settings.notification.admin.sync.error`,
        },
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
        message: {
          id: `${camelCase(pluginId)}.page.settings.notification.admin.sync.success`,
        },
      });
    },
    onError: () => {
      toggleNotification({
        type: 'warning',
        message: {
          id: `${camelCase(pluginId)}.page.settings.notification.admin.sync.error`,
        },
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
    <Stack size={4}>
      <Stack size={2}>
        <Typography variant="delta" as="h2">
          {getMessage('page.settings.sections.admin.title')}
        </Typography>
      </Stack>
      <Grid gap={4}>
        <GridItem col={8}>
          <Typography variant="epsilon" as="h3">
            {getMessage('page.settings.sections.admin.restore.title')}
          </Typography>
          <Typography variant="pi" as="h4">
            {getMessage('page.settings.sections.admin.restore.subtitle')}
          </Typography>
        </GridItem>
        <GridItem col={4}>
          <Flex width="100%" height="100%" direction="row" alignItems="center" justifyContent="flex-end">
            <Button
              variant="danger-light"
              startIcon={refresh}
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
            iconConfirm={refresh}
            onConfirm={onConfirmRestore}
            onCancel={onCancelRestore}
          >
            <Typography>
              {getMessage(
                'page.settings.sections.admin.restore.confirmation.description',
              )}
            </Typography>
          </ConfirmationDialog>
        </GridItem>
        <GridItem col={12}>
          <Divider />
        </GridItem>
        <GridItem col={8}>
          <Typography variant="epsilon" as="h3">
            {getMessage('page.settings.sections.admin.sync.title')}
          </Typography>
          <Typography variant="pi" as="h4">
            {getMessage('page.settings.sections.admin.sync.subtitle')}
          </Typography>
        </GridItem>
        <GridItem col={4}>
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
            isActionAsync={false}
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
            <Stack gap={4}>
              <Typography>
                {getMessage(
                  'page.settings.sections.admin.sync.confirmation.description',
                )}
              </Typography>
              <Divider />
              <Typography variant="pi">
                {getMessage(
                  'page.settings.sections.admin.sync.confirmation.alert',
                )}
              </Typography>
            </Stack>
          </ConfirmationDialog>
        </GridItem>
        <GridItem col={12}>
          <Divider />
        </GridItem>
        <GridItem col={8}>
          <Typography variant="epsilon" as="h3">
            {getMessage('page.settings.sections.admin.desync.title')}
          </Typography>
          <Typography variant="pi" as="h4">
            {getMessage('page.settings.sections.admin.desync.subtitle')}
          </Typography>
        </GridItem>
        <GridItem col={4}>
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
            isActionAsync={false}
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
            <Stack gap={4}>
              <Typography>
                {getMessage(
                  'page.settings.sections.admin.desync.confirmation.description',
                )}
              </Typography>
              <Divider />
              <Typography variant="pi">
                {getMessage(
                  'page.settings.sections.admin.desync.confirmation.alert',
                )}
              </Typography>
            </Stack>
          </ConfirmationDialog>
        </GridItem>
      </Grid>
    </Stack>

  );
};
