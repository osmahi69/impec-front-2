import React, {FC, ReactElement} from 'react';
import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import Icon from 'react-native-ionicons';

type ChildProps = {
  //define props
  navigation?: NavigationProp<ParamListBase>;
  route?: RouteProp<ParamListBase>;
  title?: string;
};

const LINK =
  'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

const ItemStaff: FC<ChildProps> = ({title}): ReactElement => {
  return (
    <View
      style={{
        flex: 1,
      }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 16,
        }}>
        <Image
          style={{width: 56, height: 56, borderRadius: 28}}
          source={{uri: LINK}}
        />
        <View style={{alignItems: 'center', margin: 11}}>
          <Text style={{fontSize: 14, fontWeight: '600'}}>Mia</Text>
          <Text style={{fontSize: 14}}>Robert</Text>
        </View>
      </View>
    </View>
  );
};

ItemStaff.propTypes = {};
ItemStaff.defaultProps = {};
export default ItemStaff;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
