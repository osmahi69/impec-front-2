import React, {FC, ReactElement} from 'react';
import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import Header from '../Home/Header';
import ItemHomeList from '../../components/ItemList/ItemHomeList';
import {colors} from '../../theme/colors';
import {Text, View} from 'native-base';
import {theme} from '../../theme/theme';

type ChildProps = {
  //define props
  navigation?: NavigationProp<ParamListBase>;
  route?: RouteProp<ParamListBase>;
};
const Search: FC<ChildProps> = (
  {
    /* destructured props */
  },
): ReactElement => {
  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        //handleSelectEnseign();
      }}
      style={{}}>
      <ItemHomeList {...item} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      {/*  */}
      <FlatList
        ListHeaderComponent={() => (
          <View flexDirection={'row'} style={{marginVertical: 20}}>
            <Text
              //fontWeight={'semibold'}
              fontFamily={theme.fonts.bold}
              fontWeight={'600'}
              fontSize={'sm'}>
              Résultat pour :{' '}
            </Text>
            <Text fontSize={'sm'}>Hairkut</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{marginHorizontal: 16}}
        data={[0, 1, 2]}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              marginVertical: 10,
              backgroundColor: colors.graylight,
            }}
          />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

Search.propTypes = {};
Search.defaultProps = {};
export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
