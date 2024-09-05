import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Settings } from './Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const SettingsPage =() => (
  <QueryClientProvider client={queryClient}>
    <Settings />
  </QueryClientProvider>
);
SettingsPage.displayName = 'SettingsPage';

export default SettingsPage;
