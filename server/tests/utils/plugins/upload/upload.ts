export const uploadMock = {
  provider: {
    upload: jest.fn(() => Promise.resolve()),
    uploadStream: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
  },
};