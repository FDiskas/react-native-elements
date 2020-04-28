import * as React from 'react';
import {
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';

import Input from '../input/Input';
import Icon from '../icons/Icon';
import { renderNode } from '../helpers';
const IOS_GRAY = '#7d7d7d';
const defaultSearchIcon = {
  type: 'ionicon',
  size: 20,
  name: 'ios-search',
  color: IOS_GRAY,
};
const defaultClearIcon = {
  type: 'ionicon',
  name: 'ios-close-circle',
  size: 20,
  color: IOS_GRAY,
};
type SearchBarProps = {
  value?: string;
  cancelButtonProps?: object;
  cancelButtonTitle?: string;
  clearIcon?: any;
  searchIcon?: any;
  loadingProps?: object;
  showLoading?: boolean;
  onClear?: (...args: any[]) => any;
  onCancel?: (...args: any[]) => any;
  onFocus?: (...args: any[]) => any;
  onBlur?: (...args: any[]) => any;
  onChangeText?: (...args: any[]) => any;
  containerStyle?: any;
  leftIconContainerStyle?: any;
  rightIconContainerStyle?: any;
  inputContainerStyle?: any;
  inputStyle?: any;
  placeholderTextColor?: string;
  showCancel?: boolean;
};
type SearchBarState = {
  hasFocus: boolean;
  isEmpty: boolean;
  cancelButtonWidth: null | number;
};
class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      hasFocus: false,
      isEmpty: value ? value === '' : true,
      cancelButtonWidth: null,
    };
  }
  static defaultProps = {
    value: '',
    cancelButtonTitle: 'Cancel',
    loadingProps: {},
    cancelButtonProps: {},
    showLoading: false,
    onClear: () => null,
    onCancel: () => null,
    onFocus: () => null,
    onBlur: () => null,
    onChangeText: () => null,
    placeholderTextColor: IOS_GRAY,
    searchIcon: defaultSearchIcon,
    clearIcon: defaultClearIcon,
    showCancel: false,
  };
  focus = () => {
    this.input.focus();
  };
  blur = () => {
    this.input.blur();
  };
  clear = () => {
    this.input.clear();
    this.onChangeText('');
    this.props.onClear();
  };
  cancel = () => {
    this.onChangeText('');
    if (this.props.showCancel) {
      UIManager.configureNextLayoutAnimation && LayoutAnimation.easeInEaseOut();
      this.setState({ hasFocus: false });
    }
    setTimeout(() => {
      this.blur();
      this.props.onCancel();
    }, 0);
  };
  onFocus = () => {
    this.props.onFocus();
    UIManager.configureNextLayoutAnimation && LayoutAnimation.easeInEaseOut();
    this.setState({
      hasFocus: true,
      isEmpty: this.props.value === '',
    });
  };
  onBlur = () => {
    this.props.onBlur();
    UIManager.configureNextLayoutAnimation && LayoutAnimation.easeInEaseOut();
    if (!this.props.showCancel) {
      this.setState({
        hasFocus: false,
      });
    }
  };
  onChangeText = (text) => {
    this.props.onChangeText(text);
    this.setState({ isEmpty: text === '' });
  };
  render() {
    const {
      cancelButtonProps,
      cancelButtonTitle,
      clearIcon,
      containerStyle,
      leftIconContainerStyle,
      rightIconContainerStyle,
      inputContainerStyle,
      inputStyle,
      placeholderTextColor,
      showLoading,
      loadingProps,
      searchIcon,
      showCancel,
      ...attributes
    } = this.props;
    const { hasFocus, isEmpty } = this.state;
    const { style: loadingStyle, ...otherLoadingProps } = loadingProps;
    const {
      buttonStyle,
      buttonTextStyle,
      color: buttonColor,
      disabled: buttonDisabled,
      buttonDisabledStyle,
      buttonDisabledTextStyle,
      ...otherCancelButtonProps
    } = cancelButtonProps;
    return (
      <View style={StyleSheet.flatten([styles.container, containerStyle])}>
        <Input
          testID="searchInput"
          {...attributes}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChangeText={this.onChangeText}
          ref={(input) => {
            this.input = input;
          }}
          inputStyle={StyleSheet.flatten([styles.input, inputStyle])}
          containerStyle={{
            paddingHorizontal: 0,
          }}
          inputContainerStyle={StyleSheet.flatten([
            styles.inputContainer,
            hasFocus && { marginRight: this.state.cancelButtonWidth },
            inputContainerStyle,
          ])}
          leftIcon={renderNode(Icon, searchIcon, defaultSearchIcon)}
          leftIconContainerStyle={StyleSheet.flatten([
            styles.leftIconContainerStyle,
            leftIconContainerStyle,
          ])}
          placeholderTextColor={placeholderTextColor}
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
                  ...defaultClearIcon,
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

        <View
          style={StyleSheet.flatten([
            styles.cancelButtonContainer,
            {
              opacity: this.state.cancelButtonWidth === null ? 0 : 1,
              right: hasFocus ? 0 : -this.state.cancelButtonWidth,
            },
          ])}
          onLayout={(event) =>
            this.setState({ cancelButtonWidth: event.nativeEvent.layout.width })
          }
        >
          <TouchableOpacity
            accessibilityRole="button"
            onPress={this.cancel}
            disabled={buttonDisabled}
            {...otherCancelButtonProps}
          >
            <View style={[buttonStyle, buttonDisabled && buttonDisabledStyle]}>
              <Text
                style={[
                  styles.buttonTextStyle,
                  buttonColor && { color: buttonColor },
                  buttonTextStyle,
                  buttonDisabled &&
                    (buttonDisabledTextStyle || styles.buttonTextDisabled),
                ]}
                disabled={buttonDisabled}
              >
                {cancelButtonTitle}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    paddingBottom: 13,
    paddingTop: 13,
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
  },
  input: {
    marginLeft: 6,
    overflow: 'hidden',
  },
  inputContainer: {
    borderBottomWidth: 0,
    backgroundColor: '#dcdce1',
    borderRadius: 9,
    minHeight: 36,
    marginLeft: 8,
    marginRight: 8,
  },
  rightIconContainerStyle: {
    marginRight: 8,
  },
  leftIconContainerStyle: {
    marginLeft: 8,
  },
  buttonTextStyle: {
    color: '#007aff',
    textAlign: 'center',
    padding: 8,
    fontSize: 18,
  },
  buttonTextDisabled: {
    color: '#cdcdcd',
  },
  cancelButtonContainer: {
    position: 'absolute',
  },
});
export default SearchBar;
