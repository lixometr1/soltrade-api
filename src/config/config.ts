import * as path from 'path';

const projectBasePath = path.join(__dirname, '..', '..');
export const config = {
  errorLogPath: path.join(projectBasePath, 'error.log'),
  infoLogPath: path.join(projectBasePath, 'info.log'),
  cookiesPath: path.join(projectBasePath, 'cookies.json'),

};
