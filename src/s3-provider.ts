import {
  Credentials,
  Parser,
} from '@aws-amplify/core';
import S3 from 'aws-sdk/clients/s3';
import {StorageProvider} from '@aws-amplify/storage';

interface StorageOptions {
  bucket?: string;
  region?: string;
  level?: string;
  credentials?: object;
  endpoint?: string;
}

/**
 * Provide storage methods to use AWS S3
 */
export default class AWSS3Provider implements StorageProvider {
  static CATEGORY = 'Storage';
  static PROVIDER_NAME = 'AWSS3';

	/**
	 * @private
	 */
  private _config: any;

	/**
	 * Initialize Storage with AWS configurations
	 * @param {Object} config - Configuration object for storage
	 */
  constructor(providerName:string, config?: StorageOptions) {
    this._config = config ? config : {};
  }

	/**
	 * get the category of the plugin
	 */
  public getCategory(): string {
    return AWSS3Provider.CATEGORY;
  }

	/**
	 * get provider name of the plugin
	 */
  getProviderName(): string {
    return AWSS3Provider.PROVIDER_NAME;
  }

	/**
	 * Configure Storage part with aws configuration
	 * @param {Object} config - Configuration of the Storage
	 * @return {Object} - Current configuration
	 */
  public configure(config?: any): object {
    if (!config) return this._config;
    const amplifyConfig = Parser.parseMobilehubConfig(config);
    this._config = Object.assign({}, this._config, amplifyConfig.Storage);
    return this._config;
  }

	/**
	 * Get a presigned URL of the file or the object data when download:true
	 *
	 * @param {String} key - key of the object
	 * @param {Object} [config] - { level : private|protected|public, download: true|false }
	 * @return - A promise resolves to Amazon S3 presigned URL on success
	 */
  public async get(key: string, config?: any): Promise<String | Object> {
    console.log(";;;;;;")
    console.log(key)
    console.log(config)
    const credentialsOK = await this._ensureCredentials();
    if (!credentialsOK) {
      return Promise.reject('No credentials');
    }

    const opt = Object.assign({}, this._config, config);
    const {bucket, download, track, expires} = opt;
    const prefix = this._prefix(opt);
    const final_key = prefix + key;
    const s3 = this._createS3(opt);

    const params: any = {
      Bucket: bucket,
      Key: final_key,
    };

    if (download === true) {
      return new Promise<any>((res, rej) => {
        s3.getObject(params, (err: any, data: any) => {
          if (err) {
            rej(err);
          } else {
            res(data);
          }
        });
      });
    }

    if (expires) {
      params.Expires = expires;
    }

    return new Promise<string>((res, rej) => {
      try {
        const url = s3.getSignedUrl('getObject', params);
        res(url);
      } catch (e) {
        rej(e);
      }
    });
  }

	/**
	 * Put a file in S3 bucket specified to configure method
	 * @param {String} key - key of the object
	 * @param {Object} object - File to be put in Amazon S3 bucket
	 * @param {Object} [config] - { level : private|protected|public, contentType: MIME Types,
	 *  progressCallback: function }
	 * @return - promise resolves to object on success
	 */
  public async put(key: string, object: any, config?: any): Promise<Object> {
    const credentialsOK = await this._ensureCredentials();
    if (!credentialsOK) {
      return Promise.reject('No credentials');
    }

    const opt = Object.assign({}, this._config, config);
    const {bucket, track, progressCallback} = opt;
    const {
      contentType,
      contentDisposition,
      cacheControl,
      expires,
      metadata,
      tagging,
    } = opt;
    const {
      serverSideEncryption,
      SSECustomerAlgorithm,
      SSECustomerKey,
      SSECustomerKeyMD5,
      SSEKMSKeyId,
    } = opt;
    const type = contentType ? contentType : 'binary/octet-stream';

    const prefix = this._prefix(opt);
    const final_key = prefix + key;
    const s3 = this._createS3(opt);

    const params: any = {
      Bucket: bucket,
      Key: final_key,
      Body: object,
      ContentType: type,
    };
    if (cacheControl) {
      params.CacheControl = cacheControl;
    }
    if (contentDisposition) {
      params.ContentDisposition = contentDisposition;
    }
    if (expires) {
      params.Expires = expires;
    }
    if (metadata) {
      params.Metadata = metadata;
    }
    if (tagging) {
      params.Tagging = tagging;
    }
    if (serverSideEncryption) {
      params.ServerSideEncryption = serverSideEncryption;
      if (SSECustomerAlgorithm) {
        params.SSECustomerAlgorithm = SSECustomerAlgorithm;
      }
      if (SSECustomerKey) {
        params.SSECustomerKey = SSECustomerKey;
      }
      if (SSECustomerKeyMD5) {
        params.SSECustomerKeyMD5 = SSECustomerKeyMD5;
      }
      if (SSEKMSKeyId) {
        params.SSEKMSKeyId = SSEKMSKeyId;
      }
    }

    try {
      const upload = s3.upload(params).on('httpUploadProgress', (progress: any) => {
        if (progressCallback) {
          if (typeof progressCallback === 'function') {
            progressCallback(progress);
          } else {
          }
        }
      });
      const data = await upload.promise();

      return {
        key: data.Key.substr(prefix.length),
      };
    } catch (e) {
      throw e;
    }
  }

	/**
	 * Remove the object for specified key
	 * @param {String} key - key of the object
	 * @param {Object} [config] - { level : private|protected|public }
	 * @return - Promise resolves upon successful removal of the object
	 */
  public async remove(key: string, config?: any): Promise<any> {
    const credentialsOK = await this._ensureCredentials();
    if (!credentialsOK) {
      return Promise.reject('No credentials');
    }

    const opt = Object.assign({}, this._config, config);
    const {bucket, track} = opt;

    const prefix = this._prefix(opt);
    const final_key = prefix + key;
    const s3 = this._createS3(opt);

    const params = {
      Bucket: bucket,
      Key: final_key,
    };

    return new Promise<any>((res, rej) => {
      s3.deleteObject(params, (err: any, data: any) => {
        if (err) {
          rej(err);
        } else {
          res(data);
        }
      });
    });
  }

	/**
	 * List bucket objects relative to the level and prefix specified
	 * @param {String} path - the path that contains objects
	 * @param {Object} [config] - { level : private|protected|public }
	 * @return - Promise resolves to list of keys for all objects in path
	 */
  public async list(path: any, config?: any): Promise<any> {
    const credentialsOK = await this._ensureCredentials();
    if (!credentialsOK) {
      return Promise.reject('No credentials');
    }

    const opt = Object.assign({}, this._config, config);
    const {bucket, track} = opt;

    const prefix = this._prefix(opt);
    const final_path = prefix + path;
    const s3 = this._createS3(opt);

    const params = {
      Bucket: bucket,
      Prefix: final_path,
    };

    return new Promise<any>((res, rej) => {
      s3.listObjects(params, (err: any, data: any) => {
        if (err) {
          rej(err);
        } else {
          const list = data.Contents.map((item: any) => {
            return {
              key: item.Key.substr(prefix.length),
              eTag: item.ETag,
              lastModified: item.LastModified,
              size: item.Size,
            };
          });
          res(list);
        }
      });
    });
  }

	/**
	 * @private
	 */
  _ensureCredentials() {
    return Credentials.get()
      .then((credentials: any) => {
        if (!credentials) return false;
        const cred = Credentials.shear(credentials);
        this._config.credentials = cred;

        return true;
      })
      .catch((err: any) => {
        return false;
      });
  }

	/**
	 * @private
	 */
  private _prefix(config: any) {
    //all user will use the same prefix
    return '';
    //const {credentials, level} = config;

    //const customPrefix = config.customPrefix || {};
    //const identityId = config.identityId || credentials.identityId;
    //const privatePath =
      //(customPrefix.private !== undefined ? customPrefix.private : 'private/') +
      //identityId +
      //'/';
    //const protectedPath =
      //(customPrefix.protected !== undefined
        //? customPrefix.protected
        //: 'protected/') +
      //identityId +
      //'/';
    //const publicPath =
      //customPrefix.public !== undefined ? customPrefix.public : 'public/';

    //switch (level) {
      //case 'private':
        //return privatePath;
      //case 'protected':
        //return protectedPath;
      //default:
        //return publicPath;
    //}
  }

	/**
	 * @private
	 */
  private _createS3(config: any) {
    const {
      bucket,
      region,
      credentials,
      endpoint,
    } = config;

    return new S3({
      apiVersion: '2006-03-01',
      params: {Bucket: bucket},
      signatureVersion: 'v4',
      region,
      credentials,
      endpoint
    });
  }
}
