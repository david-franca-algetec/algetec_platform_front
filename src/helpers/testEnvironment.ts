const isLocal = window.location.href.includes('localhost') || window.location.href.includes('127.0.0.1');

const isDev = window.location.href.includes('-dev');

export const testEnvironment = () => {
  if (isLocal) {
    return 'local';
  }
  if (isDev) {
    return 'development';
  }
  return 'production';
};
