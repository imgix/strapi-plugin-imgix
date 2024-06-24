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
        admin: {
          restore: {
            success: 'Settings restored',
            error: 'Failed to restore settings: {details}',
          },
          sync: {
            success: 'Media Library synchronized',
            error: 'Failed to synchronize your Media Library: {details}',
          },
          desync: {
            success: 'Media Library desynchronized',
            error: 'Failed to desynchronize your Media Library: {details}',
          },
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
                trailingSlash: 'URL should end with a trailing slash',
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
              url: {
                errors: {
                  format: 'Please provide a URL in valid format',
                  trailingSlash: 'URL should end with a trailing slash',
                },
              },
              errors: {
                required: 'Field is required',
              },
            },
          },
          advance: {
            title: 'Advanced configuration',
            description: 'For other Source Types like AWS S3 or Microsoft Azure',
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
        admin: {
          title: 'Administration actions',
          restore: {
            title: 'Restore configuration',
            subtitle: 'Overwrite your current configuration settings by restoring the plugin configuration file',
            confirmation: {
              header: 'Confirmation',
              description: 'Are you sure you would like to restore configuration settings to default?',
              button: {
                confirm: 'Yes, restore',
              },
            },
          },
          sync: {
            title: 'Synchronize Strapi Media Library',
            subtitle: 'Force to synchronize and overwrite all images paths in Strapi Media Library by configured imgix Source URL',
            confirmation: {
              header: 'Confirmation',
              description: 'Are you sure you would like to force synchronization of Strapi Media Library for all the images paths?',
              alert: 'This action will overwrite all the images paths in Strapi Media Library with imgix Source URL.',
              button: {
                confirm: 'Yes, synchronize',
              },
            },
          },
          desync: {
            title: 'Desynchronize Strapi Media Library',
            subtitle: 'Force to desynchronize and overwrite all images paths in Strapi Media Library from imgix Source URL to configured Media Library Source URL',
            confirmation: {
              header: 'Confirmation',
              description: 'Are you sure you would like to force desynchronization of Strapi Media Library for all the images paths?',
              alert: 'This action will overwrite all the images paths in Strapi Media Library back to your configured Media Library Source URL.',
              button: {
                confirm: 'Yes, desynchronize',
              },
            },
          },
        }
      },
      actions: {
        save: 'Save',
        admin: {
          restore: 'Restore',
          sync: 'Sync Media Library',
          desync: 'Desync Media Library',
        }
      },
    },
  },
  components: {
    confirmation: {
      dialog: {
        header: 'Confirmation',
        description: 'Are you sure you want to perform this action?',
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
