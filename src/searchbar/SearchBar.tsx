import * as React from 'react';

import { withTheme } from '../config';
import IOSSearchBar from './SearchBar-ios';
import AndroidSearchBar from './SearchBar-android';
import DefaultSearchBar from './SearchBar-default';
const SEARCHBAR_COMPONENTS = {
  ios: IOSSearchBar,
  android: AndroidSearchBar,
  default: DefaultSearchBar,
};
type SearchBarProps = {
  platform: 'default' | 'ios' | 'android';
};
class SearchBar extends React.Component<SearchBarProps, {}> {
  searchbar = React.createRef<SearchBar>();
  static defaultProps = {
    platform: 'default',
  };
  focus = () => {
    if (this.searchbar.current) {
      this.searchbar.current.focus();
    }
  };
  blur = () => {
    if (this.searchbar.current) {
      this.searchbar.current.blur();
    }
  };
  clear = () => {
    if (this.searchbar.current) {
      this.searchbar.current.clear();
    }
  };
  cancel = () => {
    if (this.searchbar.current && this.searchbar.current.cancel) {
      this.searchbar.current.cancel();
    }
  };
  render() {
    const Component =
      SEARCHBAR_COMPONENTS[this.props.platform] || DefaultSearchBar;
    return <Component ref={this.searchbar} {...this.props} />;
  }
}

export { SearchBar };
export default withTheme(SearchBar, 'SearchBar');
