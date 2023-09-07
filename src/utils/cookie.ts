import Cookies from 'js-cookie';

export function getCookie(key: string) {
  return Cookies.get(key);
}

export function setCookie(key: string, value: string) {
  Cookies.set(key, value);
}

export function removeAllCookie(key: string) {
  Cookies.remove(key);
}
