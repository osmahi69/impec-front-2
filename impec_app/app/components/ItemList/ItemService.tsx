import React, {FC, ReactElement} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import {HomeStackParams} from '../../navigation/stacks/HomeStack';
import ButtonComponent from '../customButton/ButtonComponent';

type ChildProps = {
  //define props
  route?: RouteProp<ParamListBase>;
  title?: string;
  onPress: (value: any) => void;
};

const LINK =
  'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

const ItemService: FC<ChildProps> = ({route, onPress, title}): ReactElement => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  return (
    <View
      style={{
        width: '100%',
        backgroundColor: colors.graylight,
        borderRadius: 20,
        justifyContent: 'center',
        paddingVertical: 12,
      }}>
      <View style={{flexDirection: 'row'}}>
        <Image
          style={{width: 90, height: 90, marginLeft: 20, borderRadius: 20}}
          source={{uri: LINK}}
        />

        <View style={{marginLeft: 20}}>
          {/* title */}
          <View style={{}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontSize: 18, fontWeight: '600'}}>
                Beauty Makeup
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '600',
                  color: colors.black,
                }}>
                20€
              </Text>
            </View>
            <Text
              numberOfLines={3}
              style={{
                fontSize: 14,
                fontWeight: '300',
                width: 200,
                marginTop: 10,
              }}>
              Special offer package, valid until Dec 14 Special offer package,
              valid until Dec 14 Special offer package, valid until Dec 14
              Special offer package, valid until Dec 14 offer package, valid
              until Dec 14
            </Text>
          </View>
          {/* Icons */}
          <View style={{marginTop: 10}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <ButtonComponent
                onPress={onPress}
                container={{
                  backgroundColor: colors.black,
                  borderRadius: 10,
                  padding: 8,
                  width: 75,
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Réserver"
                textStyle={{
                  fontSize: 10,
                  color: colors.white,
                  fontWeight: '500',
                }}
              />
              {/* <TouchableOpacity
                onPress={() => navigation.navigate('Appointement')}
                style={{
                  height: 32,
                  width: 88,
                  backgroundColor: colors.oarange,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.black,
                    fontWeight: '500',
                  }}>
                  Réserver
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

ItemService.propTypes = {};
ItemService.defaultProps = {};
export default ItemService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
