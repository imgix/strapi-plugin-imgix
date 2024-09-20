import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ProtectedSettingsPage } from './Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const SettingsPage =() => {
  console.log('init');
  return (
    <QueryClientProvider client={queryClient}>
      <ProtectedSettingsPage />
    </QueryClientProvider>
  );
};
SettingsPage.displayName = 'SettingsPage';

export { SettingsPage };
