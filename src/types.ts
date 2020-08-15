import React, {useState, useContext} from 'react';
import {Storage} from 'aws-amplify';
import TurndownServie from 'turndown';
import {gfm} from 'turndown-plugin-gfm';
import AWSS3Provider from './s3-provider'
import moment from 'moment'

Storage.addPluggable(new AWSS3Provider("POSTS"))

Storage.addPluggable(new AWSS3Provider("IMAGES"))

export type BlogContent = string;

export type BlogId = string;

export type Instant = number;

export interface BlogDetail {
  id: BlogId;
  title: string;
  content: BlogContent;
}

export interface ServerApi {
  saveBlog: (blog: BlogDetail) => Promise<void>;
  saveImg: (key: string, img: Blob) => Promise<string>
}

export const AWSServerApi: (postBucket: string, imgBucket: string, imgHost: string) => ServerApi =
  (postBucket: string, imgBucket: string, imgHost: string) => ({
    saveBlog: async (blog: BlogDetail) => {

      const blogHeader = `---\ntitle:${blog.title}\ndate:${moment().format('YYYY-MM-DD HH:mm:ss')}\n---\n\n`

      await Storage.put(`${blog.id}.md`, blogHeader + blog.content, {bucket: postBucket})
    },
    saveImg: async (key: string, content: Blob) => {
      return await Storage.put(key, content, {bucket: imgBucket}).then(() => `${imgHost}/${key}`)
    }
  })

export const awsConfig = {
  Auth: {

    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: 'ap-northeast-2:6a53cc10-b834-470c-8e48-899d641ee9d8',

    // REQUIRED - Amazon Cognito Region
    region: 'ap-northeast-2',

    // OPTIONAL - Amazon Cognito Federated Identity Pool Region 
    // Required only if it's different from Amazon Cognito Region
    identityPoolRegion: 'ap-northeast-2',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'ap-northeast-2_TpRqJW1Ur',

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '2ji7fdubk4irvge4ahc59bpbmq',

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: true,

    // OPTIONAL - Configuration for cookie storage
    // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
    cookieStorage: {
      // REQUIRED - Cookie domain (only required if cookieStorage is provided)
      domain: 'editor.shangshunan.com',
      // OPTIONAL - Cookie path
      path: '/',
      // OPTIONAL - Cookie expiration in days
      expires: 3,
      // OPTIONAL - Cookie secure flag
      // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
      secure: true
    },

    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  },
  Storage: {
    AWSS3: {
      bucket: 'place-holder', //REQUIRED -  Amazon S3 bucket
      region: 'ap-northeast-1', //OPTIONAL -  Amazon service region
    }
  }
}

export interface AppActions {
  saveBlog: (blog: BlogDetail) => Promise<void>
  saveImg: (key: string, img: Blob) => Promise<string>
  showInfo: (message?: string) => void
  showError: (message?: string) => void
  setProgess: (inProgress: boolean) => void
}

export interface AppInfo {
  info?: string
  error?: string
  inProgress: boolean
}

export interface MemoryAppContext {
  info: AppInfo
  actions: AppActions
}


export const useAppState = (api: ServerApi) => {
  const [state, setState] = useState<AppInfo>({inProgress: false})

  const getActions: () => AppActions = () => {
    return {
      saveBlog: api.saveBlog,
      saveImg: api.saveImg,
      showInfo: (message?: string) => setState({...state, info: message}),
      showError: (message?: string) => setState({...state, error: message}),
      setProgess: (inProgress: boolean) => setState({...state, inProgress: inProgress})
    }
  }

  return {state: state, actions: getActions()}
};

export const AppContext = React.createContext<{state: AppInfo, actions: AppActions}>({
  state: {inProgress: false}
  , actions: {
    saveBlog: async (blog: BlogDetail) => {},
    saveImg: async (key: string, img: Blob) => {return ''},
    showInfo: () => {},
    showError: () => {},
    setProgess: (inProgress: boolean) => {}
  }
});

export const useAppContext = () => {
  return useContext<{state: AppInfo, actions: AppActions}>(AppContext)
};

export const turndownServie = new TurndownServie({headingStyle: 'atx', codeBlockStyle: 'fenced'});
turndownServie.use(gfm)

export const saveDataInStorage = (data: Object) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(data, () => {
      if (chrome.runtime.lastError) {
        reject('error when sync data, error is ' + chrome.runtime.lastError.toString())
      } else {
        resolve('success to sync data')
      }
    })
  })
}

export const getDataInStorage = async (key: string) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (item) => {
      if (chrome.runtime.lastError) {
        reject(`error when get ${key}, error is ${chrome.runtime.lastError.toString()}`)
      } else {
        resolve(item[key])
      }
    })
  })
}
