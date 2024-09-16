import React, {FC, ReactElement} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import PropTypes from 'prop-types';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';

type ChildProps = {
  //define props
  navigation?: NavigationProp<ParamListBase>;
  route?: RouteProp<ParamListBase>;
  marginVertical?: ViewStyle;
  style?: ViewStyle;
};
const Separator: FC<ChildProps> = ({marginVertical, style}): ReactElement => {
  return (
    <View
      style={[
        {
          height: 1,
          width: '100%',
          backgroundColor: '#C6C6C640',
          marginVertical: 37,
        },
        marginVertical,
        style,
      ]}>
      {/* Element */}
    </View>
  );
};

Separator.propTypes = {};
Separator.defaultProps = {};
export default Separator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
