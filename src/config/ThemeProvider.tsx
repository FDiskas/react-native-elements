import React from 'react';
import deepmerge from 'deepmerge';

import colors from './colors';
import { Theme } from './theme';
export const ThemeContext = React.createContext<{
  theme: Theme;
  updateTheme?: (theme: Theme) => void;
  replaceTheme?: (theme: Theme) => void;
}>({
  theme: {
    colors,
  },
});
type ThemeProviderProps = {
  theme?: object;
};
type ThemeProviderState = {
  theme: any;
};
export default class ThemeProvider extends React.Component<
  ThemeProviderProps,
  ThemeProviderState
> {
  static defaultProps: { theme: {} };
  defaultTheme: object;
  constructor(props: ThemeProviderProps) {
    super(props);
    this.defaultTheme = deepmerge(
      {
        colors,
      },
      props.theme || {}
    );
    this.state = {
      theme: this.defaultTheme,
    };
  }
  updateTheme = (updates: Theme) => {
    this.setState(({ theme }) => ({
      theme: deepmerge(theme, updates),
    }));
  };
  replaceTheme = (theme: Theme) => {
    this.setState(() => ({
      theme: deepmerge(this.defaultTheme, theme),
    }));
  };
  getTheme = () => this.state.theme;
  render() {
    return (
      <ThemeContext.Provider
        value={{
          theme: this.state.theme,
          updateTheme: this.updateTheme,
          replaceTheme: this.replaceTheme,
        }}
      >
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}
ThemeProvider.defaultProps = {
  theme: {},
};
export const ThemeConsumer = ThemeContext.Consumer;
