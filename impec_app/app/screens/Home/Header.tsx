import React, {FC, ReactElement, useContext} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UserContext} from '../../contexte/authContext';
import {colors} from '../../theme/colors';
import {Box, Divider, Heading, Input, VStack} from 'native-base';
import Icon from 'react-native-ionicons';

type ChildProps = {
  //define props
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

const Header: FC<ChildProps> = (
  {
    /* destructured props */
  },
): ReactElement => {
  const insets = useSafeAreaInsets();
  const {user} = useContext(UserContext);
  const navigation = useNavigation();

  function SearchBar() {
    return (
      <VStack
        my="4"
        space={5}
        w="100%"
        pb={'12px'}
        divider={
          <Box px="2">
            <Divider />
          </Box>
        }>
        <VStack w="100%" space={5}>
          <Input
            placeholder="Ex : beauty zen"
            width="100%"
            borderRadius="12"
            borderColor={colors.white}
            py="3"
            px="1"
            fontSize="14"
            placeholderTextColor={colors.white}
            color={colors.white}
            focusOutlineColor={colors.white}
            bgColor={'transparent'}
            cursorColor={colors.white}
            InputRightElement={
              <Icon
                size={24}
                ios={'search'}
                android={'search'}
                color={colors.white}
                style={{paddingRight: 16}}
              />
            }
          />
        </VStack>
      </VStack>
    );
  }

  return (
    <View
      style={{
        backgroundColor: colors.main,
        borderBottomStartRadius: 20,
        borderBottomEndRadius: 20,
      }}>
      <View style={{marginTop: insets.top}}>
        <View style={{paddingHorizontal: 16}}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              navigation.goBack();
            }}
            style={{}}>
            <Icon
              size={38}
              ios={'arrow-round-back'}
              android={'arrow-round-back'}
              color={colors.white}
              style={{paddingRight: 16}}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Text style={{color: 'white', fontSize: 32, fontWeight: 'bold'}}>
              Coiffure
            </Text>
          </View>
          {/* searchbar */}
          <SearchBar />
        </View>
        {/* Category */}
        {/*  <CategoryComponent /> */}
      </View>
    </View>
  );
};

Header.propTypes = {};
Header.defaultProps = {};
export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
