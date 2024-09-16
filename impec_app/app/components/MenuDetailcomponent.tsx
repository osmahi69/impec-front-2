import React, {FC, ReactElement, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
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
  callback?: () => void;
};
const MenuDetailComponent: FC<ChildProps> = ({callback}): ReactElement => {
  const MENU = [{title: 'About'}, {title: 'Services'}];
  const [indexSelected, setIndexSelected] = useState(0);
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', marginTop: 20}}>
        {MENU.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setIndexSelected(index);
                callback(item?.title);
              }}
              activeOpacity={0.7}
              style={{
                backgroundColor: Boolean(indexSelected === index)
                  ? colors.oarange
                  : 'transparent',
                borderColor: Boolean(indexSelected !== index)
                  ? colors.oarange
                  : 'transparent',
                borderWidth: 1,
                marginLeft: 10,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                borderRadius: 20,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: Boolean(indexSelected !== index)
                    ? colors.oarange
                    : colors.white,
                  fontWeight: '800',
                }}>
                {item?.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

MenuDetailComponent.propTypes = {};
MenuDetailComponent.defaultProps = {};
export default MenuDetailComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
