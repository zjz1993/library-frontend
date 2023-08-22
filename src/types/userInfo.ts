import { ERole } from '@/enum/Role.ts';

export type TUserInfo = {
  uid: number;
  username: string;
  avatar: string;
  role: ERole;
};
