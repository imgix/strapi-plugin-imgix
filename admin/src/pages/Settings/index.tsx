import React, { memo } from 'react';
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

export const SettingsPage = memo(() => (
  <QueryClientProvider client={queryClient}>
    <Settings />
  </QueryClientProvider>
));
SettingsPage.displayName = 'SettingsPage';
export default SettingsPage;
