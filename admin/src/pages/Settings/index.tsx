import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Settings as Page } from './Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const SettingsPage = () => (
  <QueryClientProvider client={queryClient}>
    <Page />
  </QueryClientProvider>
);
SettingsPage.displayName = 'SettingsPage';

export { SettingsPage };
