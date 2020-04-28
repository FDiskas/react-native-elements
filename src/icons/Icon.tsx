import React from 'react';
import {
  Platform,
  TouchableHighlight,
  View,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';
import Color from 'color';

import getIconType from '../helpers/getIconType';
import { withTheme } from '../config';
export type IconProps = {
  type?: string;
  name?: string;
  size?: number;
  color?: string;
  Component?: JSX.Element;
  underlayColor?: string;
  reverse?: boolean;
  raised?: boolean;
  containerStyle?: any;
  iconStyle?: any;
  onPress?: (...args: any[]) => any;
  reverseColor?: string;
  disabled?: boolean;
  disabledStyle?: any;
  solid?: boolean;
  brand?: boolean;
};
const Icon: React.SFC<IconProps> = (props) => {
  const {
    type,
    name,
    size,
    color,
    iconStyle,
    underlayColor,
    reverse,
    raised,
    containerStyle,
    reverseColor,
    disabled,
    disabledStyle,
    onPress,
    Component = onPress
      ? Platform.select({
          android: TouchableNativeFeedback,
          default: TouchableHighlight,
        })
      : View,
    solid,
    brand,
    ...attributes
  } = props;
  const IconComponent = getIconType(type);
  const getBackgroundColor = () => {
    if (reverse) {
      return color;
    }
    return raised ? 'white' : 'transparent';
  };
  const buttonStyles = {
    borderRadius: size + 4,
    height: size * 2 + 4,
    width: size * 2 + 4,
  };
  if (Platform.OS === 'android' && !attributes.background) {
    if (Platform.Version >= 21) {
      attributes.background = TouchableNativeFeedback.Ripple(
        Color(color).alpha(0.2).rgb().string(),
        true
      );
    }
  }
  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        (reverse || raised) && styles.button,
        (reverse || raised) && buttonStyles,
        raised && styles.raised,
        iconStyle && iconStyle.borderRadius
          ? {
              borderRadius: iconStyle.borderRadius,
            }
          : {},
        containerStyle && containerStyle,
      ])}
    >
      <Component
        {...attributes}
        {...(onPress && {
          onPress,
          disabled,
          underlayColor: reverse ? color : underlayColor,
          activeOpacity: 0.3,
        })}
      >
        <View
          style={StyleSheet.flatten([
            (reverse || raised) && buttonStyles,
            {
              backgroundColor: getBackgroundColor(),
              alignItems: 'center',
              justifyContent: 'center',
            },
            disabled && styles.disabled,
            disabled && disabledStyle,
          ])}
        >
          <IconComponent
            testID="iconIcon"
            style={StyleSheet.flatten([
              { backgroundColor: 'transparent' },
              iconStyle && iconStyle,
            ])}
            size={size}
            name={name}
            color={reverse ? reverseColor : color}
            solid={solid}
            brand={brand}
          />
        </View>
      </Component>
    </View>
  );
};
Icon.defaultProps = {
  underlayColor: 'transparent',
  reverse: false,
  raised: false,
  size: 24,
  color: 'black',
  reverseColor: 'white',
  disabled: false,
  type: 'material',
  solid: false,
  brand: false,
};
const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  button: {
    margin: 7,
  },
  raised: {
    ...Platform.select({
      android: {
        elevation: 2,
      },
      default: {
        shadowColor: 'rgba(0,0,0, .4)',
        shadowOffset: { height: 1, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
      },
    }),
  },
  disabled: {
    backgroundColor: '#D1D5D8',
  },
});
export { Icon };
export default withTheme(Icon, 'Icon');
