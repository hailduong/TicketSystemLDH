import { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      tertiary: string;
      danger: string;
    };
  }
}

export const theme: DefaultTheme = {
  colors: {
    primary: '#00bcd4',    // cyan
    secondary: '#4caf50',  // green
    tertiary: '#cddc39',   // lime
    danger: '#ff5722',     // orange-red
  },
};

// Bootstrap override variables
export const bootstrapVariables = {
  '$primary': '#00bcd4',
  '$secondary': '#4caf50',
  '$success': '#4caf50',
  '$info': '#cddc39',
  '$danger': '#ff5722',
  '$theme-colors': {
    'primary': '#00bcd4',
    'secondary': '#4caf50',
    'success': '#4caf50',
    'info': '#cddc39',
    'danger': '#ff5722',
  },
};
