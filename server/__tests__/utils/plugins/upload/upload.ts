export const uploadMock = {
  provider: {
    upload: jest.fn(() => {
      console.log('uploadMethod');
      return Promise.resolve();
    }),
    uploadStream: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
  },
} as any;