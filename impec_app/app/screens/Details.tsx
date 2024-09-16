import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import React, {FC, ReactElement, useEffect, useMemo, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ItemStaff from '../components/ItemList/ItemStaff';
import {colors} from '../theme/colors';
import {theme} from '../theme/theme';
import About from './About';
import Services from './Services';
import Icon from 'react-native-ionicons';
import useEtablissementRequest from '../services/serviceAPI';
import {useQuery} from 'react-query';
import {EtablissementType} from '../types/EtablissementTypes';

type ChildProps = {
  //define props
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

const LINK =
  'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

type RouteParams = {
  data?: EtablissementType;
};

const Details: FC<ChildProps> = ({navigation}): ReactElement => {
  const route = useRoute();
  const {params: {data: etab} = {}} = route as {params: RouteParams};

  const [menuSelected, setMenuSeletected] = useState('About');
  const insets = useSafeAreaInsets();
  const {getDetailsEtablissementById} = useEtablissementRequest();

  const [etablissements, setEtablissements] =
    useState<EtablissementType | null>(null);
  const handleSelectEnseign = () => {
    navigation.navigate('Details');
  };

  const getEtablissements = async () => {
    console.log(' *** id ***');
    try {
      const result = await getDetailsEtablissementById(etab?.id);
      return result.data;
    } catch (error) {
      console.log(' *** error get etablissement details ***', error);
    }
  };

  const userQuery = useQuery('etab_details', getEtablissements);
  const {data, isLoading: loadingUser, error} = userQuery;

  useEffect(() => {
    if (data?.success) {
      setEtablissements(data.etablissement);
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{}}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              height: 30,
              width: 30,
              position: 'absolute',
              top: insets.top,
              left: 15,
              zIndex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              //backgroundColor: colors.main,
              borderRadius: 15,
            }}>
            <Icon
              //size={28}
              ios="arrow-round-back"
              android="arrow-round-back"
              color="#FFFFFF"
            />
          </TouchableOpacity>
          <Image style={styles.cover} source={{uri: LINK}} />
        </View>
        <View style={{marginHorizontal: 16}}>
          <View style={styles.containerInfos}>
            <Text style={{fontSize: 26, fontFamily: theme.fonts.semiBold}}>
              {etablissements?.name}
            </Text>
            <TouchableOpacity style={styles.openContainer}>
              <Text style={styles.openText}>OUVERT</Text>
            </TouchableOpacity>
          </View>
          {/*  */}
          <View style={{marginTop: 15}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={styles.iconStyle}
                source={require('../assets/pin.png')}
              />
              <View style={{marginLeft: 10}}>
                <Text style={{fontSize: 14, fontFamily: theme.fonts.regular}}>
                  {etablissements?.address}
                </Text>
                <Text style={{fontSize: 14, fontFamily: theme.fonts.regular}}>
                  {etablissements?.city}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.separator} />
          {/* links */}
          <View style={{}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image source={require('../assets/icons/Instagram.png')} />
              <Text style={{marginLeft: 10, fontFamily: theme.fonts.regular}}>
                O point de beauté
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 12,
              }}>
              <Image source={require('../assets/icons/facebook.png')} />
              <Text style={{marginLeft: 10, fontFamily: theme.fonts.regular}}>
                https://www.facebook.com/opointdebeaute
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 12,
              }}>
              <Image source={require('../assets/icons/phone.png')} />
              <Text style={{marginLeft: 10, fontFamily: theme.fonts.regular}}>
                {etablissements?.phone}
              </Text>
            </View>
          </View>
          {/* About */}
          <View style={styles.containerInfos}>
            <Text style={{fontSize: 26, fontWeight: 'bold'}}>Informations</Text>
          </View>
          <About description={etablissements?.description} />
          {/* Team */}
          <View style={styles.containerInfos}>
            <Text style={{fontSize: 26, fontWeight: 'bold'}}>
              Membres de l'équipe
            </Text>
          </View>
        </View>

        <ScrollView horizontal contentContainerStyle={{marginVertical: 20}}>
          {[0, 2, 3, 4].map(item => {
            return <ItemStaff />;
          })}
        </ScrollView>
        {/* Services */}
        <Services etablissementId={etab?.id} />
      </ScrollView>
    </View>
  );
};

Details.propTypes = {};
Details.defaultProps = {};
export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  cover: {
    height: 280,
    width: '100%',
  },
  containerInfos: {
    marginTop: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  openText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.white,
  },
  iconStyle: {tintColor: colors.main, width: 14, height: 14},
  openContainer: {
    backgroundColor: colors.main,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  separator: {
    height: 1,
    width: '90%',
    backgroundColor: colors.gray,
    alignSelf: 'center',
    marginVertical: 20,
  },
  tempcard: {
    height: 90,
    backgroundColor: colors.oarange,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
});
