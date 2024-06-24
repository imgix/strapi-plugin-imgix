import React from 'react';

import { Button } from '@strapi/design-system/Button';
import { Dialog, DialogBody, DialogFooter } from '@strapi/design-system/Dialog';
import { Flex } from '@strapi/design-system/Flex';
import { Stack } from '@strapi/design-system/Stack';
import { Typography } from '@strapi/design-system/Typography';

import { getMessage } from '../../utils';
import { check, exclamationMarkCircle } from '../icons';

type ConfirmationDialogProps = {
  isVisible: boolean;
  isActionAsync: boolean;
  children: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  header?: string;
  labelCancel?: string;
  labelConfirm?: string;
  iconConfirm?: React.ReactNode;
}

const ConfirmationDialog = ({
  isVisible = false,
  isActionAsync = false,
  children,
  onConfirm,
  onCancel,
  header,
  labelCancel,
  labelConfirm,
  iconConfirm,
}: ConfirmationDialogProps) => (
  <Dialog
    onClose={onCancel}
    title={
      header ||
      getMessage('components.confirmation.dialog.header', 'Confirmation')
    }
    isOpen={isVisible}
  >
    <DialogBody icon={exclamationMarkCircle}>
      <Stack size={2}>
        <Flex id="dialog-confirm-description" justifyContent="center">
        {children || (<Typography>{ getMessage('components.confirmation.dialog.description') }</Typography>)}
        </Flex>
      </Stack>
    </DialogBody>
    <DialogFooter
      startAction={
        <Button onClick={onCancel} variant="tertiary" disabled={isActionAsync}>
          {labelCancel ||
            getMessage(
              'components.confirmation.dialog.button.cancel',
              'Cancel',
            )}
        </Button>
      }
      endAction={
        <Button
          onClick={onConfirm}
          variant="danger-light"
          startIcon={iconConfirm || check}
          disabled={isActionAsync}
          loading={isActionAsync}
        >
          {labelConfirm ||
            getMessage(
              'components.confirmation.dialog.button.confirm',
              'Confirm',
            )}
        </Button>
      }
    />
  </Dialog>
);

export default ConfirmationDialog;
