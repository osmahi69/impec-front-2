import React, {FC, ReactElement} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';

const categ = [
  {
    title: 'Coiffure',
    image: require('../../assets//menu/hair.png'),
  },
  {
    title: 'Regard',
    image: require('../../assets//menu/eyes.png'),
  },
  {
    title: 'Ongle',
    image: require('../../assets//menu/ongle.png'),
  },
  {
    title: 'Coiffure',
    image: require('../../assets//menu/hair.png'),
  },
  {
    title: 'Coiffure',
    image: require('../../assets//menu/hair.png'),
  },
];

type ChildProps = {
  //define props
  navigation?: NavigationProp<ParamListBase>;
  route?: RouteProp<ParamListBase>;
};
const CategoryComponent: FC<ChildProps> = (
  {
    /* destructured props */
  },
): ReactElement => {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{marginTop: 20}}>
      <View style={{flexDirection: 'row'}}>
        {categ.map((item, index) => {
          return (
            <View
              style={[
                {
                  alignItems: 'center',
                  marginHorizontal: 12,
                },
              ]}>
              <Image
                source={item?.image}
                style={[
                  {
                    borderRadius: 28,
                  },
                ]}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  fontWeight: '600',
                  marginTop: 7,
                }}>
                {item.title}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

CategoryComponent.propTypes = {};
CategoryComponent.defaultProps = {};
export default CategoryComponent;

const styles = StyleSheet.create({
  container: {},
});
