import React, { useCallback, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { FormikHelpers } from 'formik';
import { camelCase } from 'lodash';

import { Button } from '@strapi/design-system/Button';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { Stack } from '@strapi/design-system/Stack';
import { Typography } from '@strapi/design-system/Typography';
import { useNotification } from '@strapi/helper-plugin';

import { pluginId } from '../../../../../pluginId';
import { ConfigData } from '../../../../../server/validators';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import { refresh } from '../../../components/icons';
import { useHTTP } from '../../../hooks';
import { getMessage } from '../../../utils';
import { FormData } from '../types';

type RestoreSectionProps = {
  setValues: FormikHelpers<FormData>['setValues'];
}


export const RestoreSection = ({ setValues }: RestoreSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const http = useHTTP();
  const toggleNotification = useNotification();

  const handleRestoreConfirmation = useCallback(() => {
    setIsVisible(true);
  }, []);

  const mutation = useMutation({
    mutationKey: [camelCase(pluginId), 'restore-settings'],
    mutationFn: () => http.put<{}, ConfigData>('/settings/restore', {}),
    throwOnError: false,
    onSuccess: (values: ConfigData) => {
      toggleNotification({
        type: 'success',
        message: {
          id: `${camelCase(pluginId)}.page.settings.notification.restore.success`,
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
          id: `${camelCase(pluginId)}.page.settings.notification.restore.error`,
        },
      });
    },
  });

  const onConfirmRestore = async () => {
    try {
      await mutation.mutateAsync();
      setIsVisible(false);
    } catch {}
  };

  const onCancelRestore = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <Stack size={4}>
      <Stack size={2}>
        <Typography variant="delta" as="h2">
          {getMessage('page.settings.sections.restore.title')}
        </Typography>
        <Typography variant="pi" as="h4">
          {getMessage('page.settings.sections.restore.subtitle')}
        </Typography>
      </Stack>
      <Grid gap={4}>
        <GridItem col={6}>
          <Button
            variant="danger-light"
            startIcon={refresh}
            onClick={handleRestoreConfirmation}
          >
            {getMessage('page.settings.actions.restore')}
          </Button>

          <ConfirmationDialog
            isVisible={isVisible}
            isActionAsync={false}
            header={getMessage(
              'page.settings.sections.restore.confirmation.header',
            )}
            labelConfirm={getMessage(
              'page.settings.sections.restore.confirmation.button.confirm',
            )}
            iconConfirm={refresh}
            onConfirm={onConfirmRestore}
            onCancel={onCancelRestore}
          >
            {getMessage(
              'page.settings.sections.restore.confirmation.description',
            )}
          </ConfirmationDialog>
        </GridItem>
      </Grid>
    </Stack>

  );
};
