import { TApi } from '@/types/api.ts';
import { TUserInfo } from '@/types/userInfo.ts';
import { TLoginDto } from '@/types/dto/LoginDto.ts';

export async function apiLogin(params: TLoginDto): TApi<unknown> {
  if (params.username === 'wrong') {
    return {
      code: 400,
      message: '用户不存在',
      data: null
    };
  }
  return {
    code: 200,
    message: 'success',
    data: {
      uid: 230080,
      username: 'zhaojunzhe',
      avatar: ''
    }
  };
}

export async function apiRegister(params: TLoginDto): TApi<unknown> {
  if (params.username === 'cunzai') {
    return {
      code: 400,
      message: '用户已存在',
      data: null
    };
  }
  return {
    code: 200,
    message: 'success',
    data: {
      uid: 230080,
      username: 'zhaojunzhe',
      avatar: ''
    }
  };
}

export async function apiGetUserInfo(): TApi<TUserInfo> {
  // await delay();
  return {
    code: 200,
    message: 'success',
    data: {
      uid: 230080,
      username: 'zhaojunzhe',
      avatar: '',
      role: 1
    }
  };
}
