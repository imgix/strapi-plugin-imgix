export default [
  {
    method: 'GET',
    path: '/settings',
    handler: 'admin.getSettings',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/settings',
    handler: 'admin.updateSettings',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/settings/restore',
    handler: 'admin.restoreConfig',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/settings/validate',
    handler: 'admin.validateAPIKey',
    config: {
      policies: [],
    },
  }
];
