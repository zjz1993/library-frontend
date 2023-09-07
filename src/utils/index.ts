import { v4 as uuidv4 } from 'uuid';

export function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ');
}

export function delay(delayTime: number = 2) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved');
    }, delayTime * 1000);
  });
}

export function createUUID() {
  return uuidv4();
}
