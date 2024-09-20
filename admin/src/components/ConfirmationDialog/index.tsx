import React from 'react';

import { Button, Flex, Dialog, Typography } from '@strapi/design-system';

import { getMessage } from '../../utils';
import { check, warningCircle } from '../icons';

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
  <Dialog.Root
    open={isVisible}
  >
    <Dialog.Content>
      <Dialog.Header>
        {header || getMessage('components.confirmation.dialog.header', 'Confirmation')}
      </Dialog.Header>
      <Dialog.Body icon={warningCircle}>
        <Flex width="100%" direction="column" gap={2}>
          <Flex id="dialog-confirm-description" width="100%" justifyContent="center">
            {children || (<Typography>{getMessage('components.confirmation.dialog.description')}</Typography>)}
          </Flex>
        </Flex>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.Cancel>
          <Button onClick={onCancel} variant="tertiary" disabled={isActionAsync}>
            {labelCancel ||
              getMessage(
                'components.confirmation.dialog.button.cancel',
                'Cancel',
              )}
          </Button>
        </Dialog.Cancel>
        <Dialog.Action>
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
        </Dialog.Action>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
);

export default ConfirmationDialog;
