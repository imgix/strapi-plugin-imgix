export const uploadDecoratorMock = {
  upload: jest.fn(),
  uploadStream: jest.fn(),
  delete: jest.fn(),
};
export const imgixServiceMock = {
  getUploadDecorator: jest.fn(() => uploadDecoratorMock),
};

export const settingsServiceMock = {
  getSettings: jest.fn(),
};