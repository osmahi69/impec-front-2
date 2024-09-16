import React, {FC, ReactElement} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {colors} from '../theme/colors';

type ChildProps = {
  //define props
  navigation?: NavigationProp<ParamListBase>;
  route?: RouteProp<ParamListBase>;
};
const SearchBarComponent: FC<ChildProps> = (
  {
    /* destructured props */
  },
): ReactElement => {
  return (
    <View style={{marginTop: 20}}>
      <TextInput
        placeholder="Search"
        style={{
          height: 48,
          width: '100%',
          borderRadius: 10,
          backgroundColor: colors.graylight,
          alignSelf: 'center',
          paddingLeft: 10,
        }}></TextInput>
    </View>
  );
};

SearchBarComponent.propTypes = {};
SearchBarComponent.defaultProps = {};
export default SearchBarComponent;

const styles = StyleSheet.create({
  container: {},
});
