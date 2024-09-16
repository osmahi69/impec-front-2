import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import React, {FC, ReactElement, useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useQuery} from 'react-query';
import ItemHomeList from '../components/ItemList/ItemHomeList';
import ItemService from '../components/ItemList/ItemService';
import useEtablissementRequest from '../services/serviceAPI';
import {colors} from '../theme/colors';
import {EtablissementType} from '../types/EtablissementTypes';
import {ServiceTypes} from '../types/ServicesTypes';

const LINK =
  'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

type ChildProps = {
  //define props
  navigation?: NavigationProp<ParamListBase>;
  route?: RouteProp<ParamListBase>;
  etablissementId: any;
};

const Services: FC<ChildProps> = (props: ChildProps): ReactElement => {
  const {etablissementId} = props;
  const {getServicesEtablissement} = useEtablissementRequest();
  const [services, setServices] = useState<ServiceTypes[] | []>([]);

  console.log(' *** etablissementId ***', etablissementId);
  const handleSelectEnseign = () => {
    navigation.navigate('Details');
  };

  const getServices = useCallback(async () => {
    try {
      const obj = {
        etablissement_id: etablissementId,
        skip: 0,
        limit: 10,
      };
      const result = await getServicesEtablissement(obj);
      return result.data;
    } catch (error) {
      console.log(' *** error get etablissement details ***', error);
    }
  }, [etablissementId]);

  const userQuery = useQuery('services', getServices);
  const {data, isLoading: loadingUser, error} = userQuery;

  useEffect(() => {
    console.log(' *** data?.service ***', data?.service);
    if (data?.service?.length > 0) {
      setServices(data?.service);
    }
    () => setServices([]);
  }, [data]);

  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const handleService = () => {
    navigation.navigate('Appointement');
  };

  return (
    <View style={{marginTop: 20, marginHorizontal: '4%'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 18, fontWeight: '800'}}>Nos prestations</Text>
        <TouchableOpacity
          style={{
            backgroundColor: colors.oarange,
            padding: 8,
            borderRadius: 5,
          }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '800',
              color: colors.white,
            }}>
            Voir plus
          </Text>
        </TouchableOpacity>
      </View>
      {data?.service?.map(item => {
        return (
          <View style={{marginTop: 10}}>
            <ItemService
              navigation={navigation}
              title={item.name}
              onPress={handleService}
            />
          </View>
        );
      })}
    </View>
  );
};

Services.propTypes = {};
Services.defaultProps = {};
export default Services;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  cover: {
    height: 280,
    width: '100%',
    borderBottomRightRadius: 20,
  },
  containerInfos: {
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  openText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.white,
  },
  iconStyle: {tintColor: colors.oarange, width: 14, height: 14},
  openContainer: {
    backgroundColor: colors.oarange,
    padding: 8,
    borderRadius: 15,
  },
  separator: {
    height: 1,
    marginTop: 20,
    width: '90%',
    backgroundColor: colors.gray,
    alignSelf: 'center',
  },
  tempcard: {
    height: 90,
    backgroundColor: colors.oarange,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
});
