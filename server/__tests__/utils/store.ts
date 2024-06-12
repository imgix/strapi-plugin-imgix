export const getStoreInstance = jest.fn(() => {
  return ({
    get: jest.fn(() => Promise.resolve()),
    set: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
  });
});