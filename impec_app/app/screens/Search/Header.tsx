import React, {FC, ReactElement, useContext} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UserContext} from '../../contexte/authContext';
import {colors} from '../../theme/colors';

type ChildProps = {
  //define props
  navigation?: NavigationProp<ParamListBase>;
  route?: RouteProp<ParamListBase>;
};
const Header: FC<ChildProps> = (
  {
    /* destructured props */
  },
): ReactElement => {
  const insets = useSafeAreaInsets();
  const {user} = useContext(UserContext);

  return (
    <View
      style={{
        height: 378,
        backgroundColor: colors.main,
      }}>
      <View style={{marginTop: insets.top}}>
        <View style={{paddingHorizontal: 16}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{color: 'white', fontSize: 32, fontWeight: 'bold'}}>
              Hello {user?.firstname} 👋
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                //
              }}
              style={{}}>
              <Image source={require('../../assets/menu/filter.png')} />
            </TouchableOpacity>
          </View>
          <Text style={{color: 'white', fontSize: 20, fontWeight: '600'}}>
            Que voulez-vous faire aujourd'hui ?
          </Text>
        </View>
        {/* Category */}
        {/*  <CategoryComponent /> */}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
