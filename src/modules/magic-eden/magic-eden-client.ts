import { logger } from './../../helpers/logger';
import { Injectable } from '@nestjs/common';
import * as cloudscraper from 'cloudscraper';
import { config } from 'src/config/config';
const FileCookieStore = require('tough-cookie-filestore2');

@Injectable()
export class MagicEdenClient {
  cookieStore: any;
  init() {
    this.cookieStore = new FileCookieStore(config.cookiesPath);
    cloudscraper.defaults({ jar: this.cookieStore});
  }
  async fetch(url: string, params?: cloudscraper.CoreOptions) {
    let response: cloudscraper.Response, error: any;
    await cloudscraper(url, params, (err, res) => {
      if (err) {
        error = err;
      }
      response = res;
    });
    if (error) throw error;
    return response;
  }
  async exec(
    url: string,
    params?: cloudscraper.CoreOptions,
    times = 0,
  ): Promise<cloudscraper.Response> {
    if (times >= 3) return;
    try {
      const response: cloudscraper.Response = await this.fetch(url, params);
      // const headers = response.headers;
      // const totalLimit = headers['x-ratelimit-limit'];
      // const requestsLimit = headers['x-ratelimit-remaining'];
      // const timeResetheaders = headers['x-ratelimit-reset'];
      return response;
    } catch (err) {
      const response: cloudscraper.Response = err.response;
      if (!response) {
        logger.error('Something strange', err);
        return;
      }
      const { body, isCaptcha, headers, statusCode } = response;
      const requestsLimit = headers['x-ratelimit-remaining'];

      if (isCaptcha) {
        logger.error('Captcha Error - ' + times);
        return await this.exec(url, params, times + 1);
      }
      if (statusCode === 429) {
        logger.error('Too Many Requests');
        throw err;
      }
      logger.error('Other Error');
      console.log(response, response.statusCode, response.body);
      throw err;
    }
  }
}
