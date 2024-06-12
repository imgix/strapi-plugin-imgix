const en = {
  page: {
    settings: {
      state: {
        loading: 'Loading...',
      },
      notification: {
        save: {
          success: 'Settings saved',
          error: 'Failed to save settings: {details}',
        },
        restore: {
          success: 'Settings restored',
          error: 'Failed to restore settings: {details}',
        },

      },
      header: {
        title: 'imgix',
        description: 'This integration allows you to easily use imgix assets in Strapi. For more information about configuring the app, see our {link}',
        link: 'documentation',
      },
      sections: {
        form: {
          base: {
            title: 'Base configuration',
            url: {
              label: 'Media Library Source URL',
              hint: 'URL of your Strapi Media Library source. For example: {example} etc.',
              errors: {
                format: 'Please provide a URL in valid format',
              },
            },
            source: {
              webfolder: {
                label: 'Webfolder Base URL / Subdomain',
                hint: 'Your imgix source URL / subdomain',
              },
              other: {
                label: 'Source URL / Subdomain',
                hint: 'Your imgix source URL / subdomain',
              },
              type: {
                label: 'Source type',
                hint: 'Type of your imgix source',
                options: {
                  webfolder: 'Web Folder',
                  other: 'Other',
                },
              },
              errors: {
                required: 'Field is required',
                format: 'Please provide a URL in valid format',
              },
            },
          },
          advance: {
            title: 'Advanced configuration',
            description: 'For other Source Types like AWS S3 or Microsoft Azure.',
            apiKey: {
              label: 'API Key',
              hint: 'Your imgix Management API Key',
              errors: {
                invalid: 'Please provide a valid API Key',
              },
            },
            source: {
              id: {
                label: 'Source ID',
                hint: 'Your imgix Source ID',
                errors: {
                  format: 'Please provide a Source ID in valid format',
                },
              },
            },
            errors: {
              required: 'Field is required for selected Source type',
            },
          },
        },
        restore: {
          title: 'Restore configuration',
          subtitle: 'Overwrite your current configuration settings by restoring the plugin configuration file.',
          confirmation: {
            header: 'Confirmation',
            description: 'Are you sure you would like to restore configuration settings to default?',
            button: {
              confirm: 'Yes, restore',
            },
          },
        },
      },
      actions: {
        save: 'Save',
        restore: 'Restore',
      },
    },
  },
  components: {
    confirmation: {
      dialog: {
        header: 'Confirmation',
        description: 'Are you sure you want to delete this item?',
        button: {
          cancel: 'Cancel',
          confirm: 'Confirm',
        },
      },
    },
  },
};

export default en;

export type EN = typeof en;
