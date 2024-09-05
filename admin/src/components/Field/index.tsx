import React from 'react';

import { Field as NativeField } from '@strapi/design-system';

type FieldProps = {
  error?: string;
  label?: string;
  hint?: string | React.ReactNode;
  children: React.ReactNode;
};

const Field = ({
  error,
  label,
  hint,
  children
}: FieldProps) => (
  <NativeField.Root width="100%" hint={hint} error={error}>
    <NativeField.Label>{label}</NativeField.Label>
    {children}
    {error && <NativeField.Error />}
    {hint && <NativeField.Hint />}
  </NativeField.Root>
);

export default Field;
