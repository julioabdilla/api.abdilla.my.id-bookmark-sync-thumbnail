import * as crypto from 'crypto';
import * as forge from 'node-forge';
import * as jwt from 'jwt-simple';

export interface PairKeys {
  publicKey: string,
  privateKey: string,
}

export class RSA {
  public static generateKeys(): PairKeys {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      }
    });
    return { privateKey, publicKey };
  }

  public static parseAsn1Key(privateKey: string) {
    const asn1 = forge.pki.privateKeyFromPem(privateKey);
    return forge.pki.privateKeyToPem(asn1);
  }
}

export class SHA256 {

  public static encode(string: any, encode: string = 'hex'): string {
    return crypto.createHash('sha256').update(string).digest(encode as crypto.BinaryToTextEncoding);
  }

  public static sign(privateKey: string, string: string, encode: string = 'hex', passphrase?: string): string {
    const temp = crypto.createSign('RSA-SHA256');
    temp.write(string);
    temp.end();
    if (passphrase) {
      return temp.sign({
        key: privateKey,
        passphrase,
      }, encode as crypto.BinaryToTextEncoding); 
    } else {
      return temp.sign(privateKey, encode as crypto.BinaryToTextEncoding)
    }
  }

  public static verify(publicKey: string, string: string, sign: string): boolean {
    const temp = crypto.createVerify('RSA-SHA256');
    temp.write(string);
    temp.end();
    return temp.verify(publicKey, sign, 'hex');
  }

  public static createHmac(string: any, secret: string, encode: string = 'hex') {
    return crypto.createHmac('sha256', secret).update(string).digest(encode as crypto.BinaryToTextEncoding);
  }
}

export class SHA512 {
  public static createHmac(string: any, secret: string, encode: string = 'hex') {
    return crypto.createHmac('sha512', secret).update(string).digest(encode as crypto.BinaryToTextEncoding);
  }
}

export class MD5 {
  public static encode(string: string, encode: string = 'hex'): string {
    return crypto.createHash('md5').update(string).digest(encode as crypto.BinaryToTextEncoding);
  }
}

export class JWT {
  public static encode(data: any, secret: string): string {
    return jwt.encode(data, secret);
  }
}

export class Scrypt {
  public static async hash(string: string, salt: string, len = 16, encode = 'hex'): Promise<string> {
    return await new Promise<string>((resolve) => {
      crypto.scrypt(string, salt, len, (err, derivedKey) => {
        if (err) {
          return resolve(null);
        }
        resolve(derivedKey.toString(encode as crypto.BinaryToTextEncoding));
      });
    });
  }

  public static async compare(string: string, hashed: string, salt: string, len = 16, encode = 'hex'): Promise<Boolean> {
    const stringHashed = await Scrypt.hash(string, salt, len, encode);
    return stringHashed === hashed;
  }
}