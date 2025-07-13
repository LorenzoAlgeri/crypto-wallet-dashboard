import '@testing-library/jest-dom';

// Mock delle API esterne
global.fetch = jest.fn();

// Mock di import.meta.env per Vite
Object.defineProperty(globalThis, '__vite_import_meta_env', {
  value: {
    VITE_MORALIS_API_KEY: 'test-api-key',
    VITE_LOCAL_SERVER: 'false',
    GOLDRUSH_API_KEY: 'test-goldrush-key'
  },
  writable: true
});

// Mock di import.meta
if (typeof global.import === 'undefined') {
  global.import = {};
}
global.import.meta = {
  env: {
    VITE_MORALIS_API_KEY: 'test-api-key',
    VITE_LOCAL_SERVER: 'false',
    GOLDRUSH_API_KEY: 'test-goldrush-key'
  }
};

// Mock di window.matchMedia per i test
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
