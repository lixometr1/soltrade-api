import * as path from 'path';

const projectBasePath = path.join(__dirname, '..', '..');
export const config = {
  errorLogPath: path.join(projectBasePath, 'error.log'),
  infoLogPath: path.join(projectBasePath, 'info.log'),
  cookiesPath: path.join(projectBasePath, 'cookies.json'),
  wsPort: 85,
  socketAuthToken: '6oXVEAK7r8t1p4ZRH'
};
