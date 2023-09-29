import axios from 'axios';
import { message } from 'antd';

const baseURL = import.meta.env.VITE_APi_BASE;

const instance = axios.create({
  baseURL,
  headers: {
    'X-Message-Token': '5JG4pNBGWP8Chi99',
    'Content-Type': 'application/json;charse=UTF-8'
  }
});
instance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response.data;
  },
  function (error) {
    console.log('error了');
    console.log(error.response?.data);
    console.log(error.response?.data.message);
    if (
      error.code === 'ECONNABORTED' ||
      error.message === 'Network Error' ||
      error.message.includes('timeout')
    ) {
      message.warning('请求超时');
    } else {
      if (error.response?.data?.message) {
        message.warning(error.response?.data?.message);
      } else {
        message.warning('请求异常，请稍后重试');
      }
    }
    if (error.response.data) {
      return error.response.data;
    }
  }
);

export const requestPost = async (
  api: string,
  params?: object | string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    instance
      .post(api, params)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const requestGet = async (
  api: string,
  params?: object
): Promise<any> => {
  return new Promise((resolve, reject) => {
    instance
      .get(api, {
        params
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const requestPut = async (
  api: string,
  params?: object
): Promise<any> => {
  return new Promise((resolve, reject) => {
    instance
      .put(api, {
        ...params
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const requestDelete = async (
  api: string,
  params?: object
): Promise<any> => {
  return new Promise((resolve, reject) => {
    instance
      .delete(api, {
        params
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const requestFormDataPost = async (
  api: string,
  params: Record<string, any>
): Promise<any> => {
  const paramFormData = new FormData();
  for (const key of Object.keys(params)) {
    if (params[key] !== null && params[key] !== undefined) {
      paramFormData.append(key, params[key]);
    }
  }
  return new Promise((resolve, reject) => {
    instance
      .post(api, paramFormData, {
        headers: { 'Content-type': 'multipart/form-data' }
      })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
