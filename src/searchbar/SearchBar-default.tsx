import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { renderNode } from '../helpers';
import Input from '../input/Input';
import Icon from '../icons/Icon';
import { Theme } from '@src/config/theme';
const defaultSearchIcon = (theme: Theme) => ({
  type: 'material',
  size: 18,
  name: 'search',
  color: theme.colors.grey3,
});
const defaultClearIcon = (theme: Theme) => ({
  type: 'material',
  size: 18,
  name: 'clear',
  color: theme.colors.grey3,
});
type SearchBarProps = {
  value?: string;
  clearIcon?: any;
  searchIcon?: any;
  loadingProps?: object;
  showLoading?: boolean;
  containerStyle?: any;
  leftIconContainerStyle?: any;
  rightIconContainerStyle?: any;
  inputContainerStyle?: any;
  inputStyle?: any;
  onClear?: (...args: any[]) => any;
  onFocus?: (...args: any[]) => any;
  onBlur?: (...args: any[]) => any;
  onChangeText?: (...args: any[]) => any;
  placeholderTextColor?: string;
  lightTheme?: boolean;
  round?: boolean;
  theme: Theme;
};
type SearchBarState = {
  isEmpty: boolean;
};
class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  input = React.createRef<typeof Input>();
  static defaultProps = {
    value: '',
    loadingProps: {},
    showLoading: false,
    lightTheme: false,
    round: false,
    onClear: () => null,
    onFocus: () => null,
    onBlur: () => null,
    onChangeText: () => null,
  };
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      isEmpty: value ? value === '' : true,
    };
  }
  focus = () => {
    this.input.current.focus();
  };
  blur = () => {
    this.input.current.blur();
  };
  clear = () => {
    this.input.current.clear();
    this.onChangeText('');
    if (this.props.onClear) {
      this.props.onClear();
    }
  };
  onFocus = () => {
    if (this.props.onFocus) {
      this.props.onFocus();
    }
    this.setState({ isEmpty: this.props.value === '' });
  };
  onBlur = () => {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  };
  onChangeText = (text: string) => {
    if (this.props.onChangeText) {
      this.props.onChangeText(text);
    }
    this.setState({ isEmpty: text === '' });
  };
  render() {
    const { theme, ...rest } = this.props;
    const {
      lightTheme,
      round,
      clearIcon = defaultClearIcon(theme),
      containerStyle,
      searchIcon = defaultSearchIcon(theme),
      leftIconContainerStyle,
      rightIconContainerStyle,
      inputContainerStyle,
      inputStyle,
      showLoading,
      loadingProps,
      placeholderTextColor = theme.colors.grey3,
      ...attributes
    } = rest;
    const { isEmpty } = this.state;
    const { style: loadingStyle, ...otherLoadingProps } = loadingProps;
    return (
      <View
        style={StyleSheet.flatten([
          styles.container(theme),
          lightTheme && styles.containerLight(theme),
          containerStyle,
        ])}
      >
        <Input
          testID="searchInput"
          {...attributes}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChangeText={this.onChangeText}
          ref={this.input}
          placeholderTextColor={placeholderTextColor}
          inputStyle={StyleSheet.flatten([
            styles.inputStyle(theme),
            inputStyle,
          ])}
          inputContainerStyle={StyleSheet.flatten([
            styles.inputContentContainer(theme),
            lightTheme && styles.inputContentContainerLight(theme),
            round && styles.round,
            inputContainerStyle,
          ])}
          containerStyle={styles.inputContainer}
          leftIcon={renderNode(Icon, searchIcon, defaultSearchIcon(theme))}
          leftIconContainerStyle={StyleSheet.flatten([
            styles.leftIconContainerStyle,
            leftIconContainerStyle,
          ])}
          rightIcon={
            <View style={{ flexDirection: 'row' }}>
              {showLoading && (
                <ActivityIndicator
                  key="loading"
                  style={StyleSheet.flatten([{ marginRight: 5 }, loadingStyle])}
                  {...otherLoadingProps}
                />
              )}

              {!isEmpty &&
                renderNode(Icon, clearIcon, {
                  ...defaultClearIcon(theme),
                  key: 'cancel',
                  onPress: this.clear,
                })}
            </View>
          }
          rightIconContainerStyle={StyleSheet.flatten([
            styles.rightIconContainerStyle,
            rightIconContainerStyle,
          ])}
        />
      </View>
    );
  }
}

const styles = {
  container: (theme) => ({
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderTopColor: '#000',
    padding: 8,
    backgroundColor: theme.colors.grey0,
  }),
  rightIconContainerStyle: {
    marginRight: 8,
  },
  leftIconContainerStyle: {
    marginLeft: 8,
  },
  containerLight: (theme) => ({
    borderTopColor: '#e1e1e1',
    borderBottomColor: '#e1e1e1',
    backgroundColor: theme.colors.grey5,
  }),
  inputContainer: {
    paddingHorizontal: 0,
  },
  inputStyle: (theme) => ({
    color: theme.colors.grey3,
    marginLeft: 10,
  }),
  inputContentContainer: (theme) => ({
    borderBottomWidth: 0,
    borderRadius: 3,
    overflow: 'hidden',
    minHeight: 30,
    backgroundColor: theme.colors.searchBg,
  }),
  inputContentContainerLight: (theme) => ({
    backgroundColor: theme.colors.grey4,
  }),
  round: {
    borderRadius: 15,
  },
};
export default SearchBar;
