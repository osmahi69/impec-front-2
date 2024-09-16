import React, {FC, ReactElement} from 'react';
import {Image, StyleSheet, TextInput, View} from 'react-native';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import Icon from 'react-native-ionicons';
import {theme} from '../../theme/theme';
import {Text} from 'native-base';

type ChildProps = {
  //define props
  navigation?: NavigationProp<ParamListBase>;
  route?: RouteProp<ParamListBase>;
  title?: string;
};

const LINK =
  'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

const ItemHomeList: FC<ChildProps> = ({
  name,
  description,
  address,
  distance,
}): ReactElement => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={{flexDirection: 'row'}}>
          <Image
            style={{width: 95, height: 106, borderRadius: 20}}
            source={{uri: LINK}}
          />

          <View style={{marginTop: 16, marginLeft: 20, flex: 1}}>
            {/* title */}
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 16,
                  fontFamily: theme.fonts.bold,
                  flex: 1,
                }}>
                {name}
              </Text>
              <View style={{justifyContent: 'flex-end'}}>
                <Icon name="heart" color={colors.main} size={20} />
              </View>
            </View>

            <Text
              numberOfLines={2}
              style={{
                fontSize: 12,
                marginTop: 5,
                fontFamily: theme.fonts.regular,
              }}>
              {description}
            </Text>

            {/* <Text
              style={{
                fontSize: 10,
                marginTop: 5,
                fontFamily: theme.fonts.regular,
              }}>
              {address}
            </Text> */}
            {/* Icons */}
            <View style={{flexDirection: 'row', marginTop: 10}}>
              {/*  <View style={{flexDirection: 'row'}}>
                <Image
                  style={{tintColor: colors.main, width: 16, height: 16}}
                  source={require('../../assets/pin.png')}
                />
                <Icon name="marker" color={colors.black} />

                <Text style={{fontSize: 12}}>{distance}</Text>
              </View> */}
              <View style={{flexDirection: 'row'}}>
                <Icon name="time" color={colors.main} size={20} />
                <Text
                  fontSize={'12px'}
                  fontFamily={theme.fonts.bold}
                  color={colors.main}
                  ml={'10px'}>
                  Ouvert maintenant
                </Text>
              </View>
            </View>
          </View>
          <View style={{position: 'absolute', right: 20}}>
            {/* <Image
            style={{tintColor: colors.oarange, width: 16, height: 16}}
            source={require('../../assets/heart.png')}
          /> */}
          </View>
        </View>
      </View>
    </View>
  );
};

ItemHomeList.propTypes = {};
ItemHomeList.defaultProps = {};
export default ItemHomeList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5.46,
    elevation: 9,
  },
});
