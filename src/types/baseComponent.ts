import { CSSProperties, ReactNode } from 'react';

export interface IBaseComponent {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}
