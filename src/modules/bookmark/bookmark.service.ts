import * as puppeteer from 'puppeteer';
import * as moment from 'moment';

import { Inject, Injectable } from "@nestjs/common";
import { Bookmark as BookmarkModel } from "./bookmark.model";
import { ConfigService } from '@nestjs/config';
import { HttpClient } from '@/shared/http';
import { SHA256 } from '@/shared/crypto/crypto';
import { HttpRequestConfig } from '@/shared/http';
import { AxiosRequestHeaders } from 'axios';

@Injectable()
export class BookmarkService {

  constructor(
    private readonly config: ConfigService,
    @Inject(BookmarkModel.REPOSITORY_NAME) private readonly bookmarkRepository: typeof BookmarkModel,
  ) { }

  async syncThumbnail(uuid: string, link: string) {
    const browser = await puppeteer.launch({
      executablePath: this.config.get<string>('PUPPETEER_EXECUTEABLE_PATH'),
      args: ['--no-sandbox']
    });
    try {
      const now = moment();
      const amzDate = now.clone().toDate().toISOString().replace(/[:-]|\.\d{3}/g, "");
      const dateStamp = amzDate.substring(0, 8);

      const bookmark = await this.bookmarkRepository.findOne({ where: { uuid } });
      const page = await browser.newPage();
      await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 0.8 });
      await page.goto(link, { waitUntil: 'networkidle2' });
      const screenshotBuffer = await page.screenshot({ type: 'png' });
      await browser.close();

      const host = new URL(this.config.get<string>('S3_HOST')).host;
      const bucket = 'thumbnail';
      const region = this.config.get<string>('S3_REGION');
      const fileName = `bookmark-${uuid}.png`;
      const fileBuffer = Buffer.from(screenshotBuffer);
      const endpoint = `${this.config.get<string>('S3_HOST')}/${bucket}/${fileName}`;

      const canonicalUri = `/${bucket}/${fileName}`;
      const canonicalHeaders = `host:${host}\n`;
      const signedHeaders = 'host';
      const payloadHash = SHA256.encode(fileBuffer);
      const canonicalRequest = [
        "PUT",
        canonicalUri,
        "",
        canonicalHeaders,
        signedHeaders,
        payloadHash,
      ].join("\n");
      const algorithm = "AWS4-HMAC-SHA256";
      const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
      const stringToSign = [
        algorithm,
        amzDate,
        credentialScope,
        SHA256.encode(canonicalRequest),
      ].join("\n");
      const kDate = SHA256.createHmac(dateStamp, `AWS4${this.config.get<string>('S3_CLIENT_SECRET')}`);
      const kRegion = SHA256.createHmac(region, kDate);
      const kService = SHA256.createHmac('s3', kRegion);
      const signingKey = SHA256.createHmac('aws4_request', kService);
      const signature = SHA256.createHmac(stringToSign, signingKey);
      const authorizationHeader = `${algorithm} Credential=${this.config.get<string>('S3_CLIENT_ID')}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

      const httpClient = new HttpClient().disableLog();
      httpClient.put(endpoint, fileBuffer, {
        headers: {
          'Content-Type': 'image/png',
          "Content-Length": fileBuffer.length,
          'x-amz-acl': 'public-read',
          'x-amz-date': amzDate,
          'Authorization': authorizationHeader
        } as any as AxiosRequestHeaders
      });
      console.log(endpoint);

      bookmark.thumbnailUrl = endpoint;
      await bookmark.save();
    } catch (err) {
      console.error(err);
      await browser.close();
    }
  }
}