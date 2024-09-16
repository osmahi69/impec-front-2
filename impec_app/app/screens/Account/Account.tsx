import React, {FC, ReactElement, useContext, useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, FlatList, Text} from 'react-native';
import PropTypes from 'prop-types';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {theme} from '../../theme/theme';
import {UserContext} from '../../contexte/authContext';
import {useQuery} from 'react-query';
import {useApi} from '../../hook/useApi';
import {
  Heading,
  View,
  Box,
  HStack,
  VStack,
  Avatar,
  Spacer,
  Container,
  Image,
  AlertDialog,
  Button,
  Center,
} from 'native-base';
import Icon from 'react-native-ionicons';
import {colors} from '../../theme/colors';
import Separator from '../../components/Separator';

type ChildProps = {
  //define props
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};
const Account: FC<ChildProps> = (
  {
    /* destructured props */
  },
): ReactElement => {
  const {logout} = useContext(UserContext);
  const {API} = useApi();
  const [isOpen, setIsOpen] = React.useState(false);
  const [user, setUser] = useState(null);
  const readUser = async () => {
    try {
      const result = await API.readUser();
      return result.data;
    } catch (error) {
      console.log(' *** error read user ***', error);
    }
  };

  const userQuery = useQuery('user', readUser);
  const {data: dataUser, isLoading: loadingUser} = userQuery;

  useEffect(() => {
    if (dataUser?.success) {
      setUser(dataUser?.user);
    }
  }, [dataUser]);

  const handleLogout = () => {
    logout();
  };

  const data = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      fullName: 'Editer mon profil',
      onPress: () => {},
      iconLeft: <Image source={require('../../assets/icons/User.png')} />,
      icon: <Icon size={18} name="arrow-forward" color={colors.black} />,
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      fullName: 'Mes réservations',
      onPress: () => {},
      iconLeft: <Image source={require('../../assets/icons/Note-check.png')} />,
      icon: <Icon size={18} name="arrow-forward" color={colors.black} />,
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      fullName: 'Editer mes identifiants',
      onPress: () => {},
      iconLeft: <Image source={require('../../assets/icons/Lock.png')} />,
      icon: <Icon size={18} name="arrow-forward" color={colors.black} />,
    },
    {
      id: '68694a0f-3da1-431f-bd56-142371e29d72',
      fullName: 'Les CGU',
      onPress: () => {},
      iconLeft: <Image source={require('../../assets/icons/cgu.png')} />,
      icon: <Icon size={18} name="arrow-forward" color={colors.black} />,
    },
    {
      id: 'logout',
      fullName: 'Se déconnecter',
      onPress: () => setIsOpen(true),
      iconLeft: <Image source={require('../../assets/icons/turnoff.png')} />,
      icon: <Icon size={18} name="arrow-forward" color={colors.black} />,
    },
  ];
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);

  const AlertDelelete = () => (
    <Center>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Information</AlertDialog.Header>
          <AlertDialog.Body>Se deconnecter</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}>
                Cancel
              </Button>
              <Button colorScheme="danger" onPress={() => logout()}>
                Se deconnecter
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );

  return (
    <View flex={1}>
      <Box safeArea marginX={10} marginTop={'30px'}>
        <AlertDelelete />
        <FlatList
          data={data}
          ListHeaderComponent={() => {
            return (
              <View style={{marginBottom: 20}}>
                <Avatar
                  justifyContent={'center'}
                  alignSelf={'center'}
                  size={100}
                  source={{
                    uri: API.baseUrl + user?.avatar,
                  }}
                />
                <Container
                  marginTop={'12px'}
                  alignSelf={'center'}
                  alignItems={'center'}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontFamily: theme.fonts.bold,
                    }}>
                    {user?.firstname} {user?.lastname}
                  </Text>
                  <Text style={{fontFamily: theme.fonts.regular}}>
                    {user?.email}
                  </Text>
                </Container>
                <Separator
                  marginVertical={{
                    marginTop: 20,
                    marginBottom: 12,
                  }}
                />
              </View>
            );
          }}
          renderItem={({item}) => (
            <Box pl={['0', '4']} pr={['0', '5']} py="2" my={2}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={item.onPress}
                style={{}}>
                <HStack space={[2, 3]} alignItems={'center'}>
                  {item.iconLeft}
                  <VStack>
                    <Text
                      style={{
                        fontFamily: theme.fonts.semiBold,
                        fontSize: 12,
                        marginLeft: 12,
                      }}>
                      {item.fullName}
                    </Text>
                  </VStack>
                  <Spacer />
                  {item.icon}
                </HStack>
              </TouchableOpacity>
            </Box>
          )}
          keyExtractor={item => item.id}
        />
      </Box>
    </View>
  );
};

Account.propTypes = {};
Account.defaultProps = {};
export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
