// Import Jest Native matchers
import '@testing-library/jest-native/extend-expect';

// Mock for Firebase
jest.mock('../FirebaseConfig', () => ({
  app: {},
  db: {}
}));

// Mock for expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
  },
}));

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});