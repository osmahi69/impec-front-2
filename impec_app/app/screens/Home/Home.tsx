import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import React, {
  FC,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SearchBar} from 'react-native-screens';
import CategoryComponent from './CategoryComponent';
import ItemHomeList from '../../components/ItemList/ItemHomeList';
import SearchBarComponent from '../../components/SearchBarComponent';
import {colors} from '../../theme/colors';
import CustomButton from '../../components/customButton/CustomButton';
import ButtonComponent from '../../components/customButton/ButtonComponent';
import {UserContext} from '../../contexte/authContext';
import {useApi} from '../../hook/useApi';
import {useQuery} from 'react-query';
import useEtablissementRequest from '../../services/serviceAPI';
import {RequestContext} from '../../contexte/requestContext';
import {AxiosInstance} from 'axios';
import {EtablissementType} from '../../types/EtablissementTypes';

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
];

type ChildProps = {
  //define props
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

const HeaderHome = () => {
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
        <CategoryComponent />
      </View>
    </View>
  );
};

const Home: FC<ChildProps> = (
  {
    /* destructured props */
  },
): ReactElement => {
  const navigation = useNavigation();
  const {fetchEtablissementRadius} = useEtablissementRequest();

  const [etablissements, setEtablissements] = useState<EtablissementType | []>(
    [],
  );
  const handleSelectEnseign = (item: EtablissementType) => {
    navigation.navigate('Details', {data: item});
  };

  /*  const getEtablissements = async () => {
    try {
      const result = await fetchEtablissementRadius({
        lat: 0,
        lng: 0,
        limit: 30,
        skip: 0,
      });
      return result.data;
    } catch (error) {
      console.log(' *** error get etablissement ***', error);
    }
  };

  const userQuery = useQuery('etablissements', getEtablissements);
  const {data: dataEtablissement, isLoading: loadingUser, error} = userQuery; */

  /*   useEffect(() => {
    setEtablissements(dataEtablissement?.data);
  }, [dataEtablissement]); */

  /*   useEffect(() => {
    if (error) {
      console.log(' *** error  ***', error);
    }
  }, [error]); */

  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        handleSelectEnseign(item);
      }}
      style={{}}>
      <ItemHomeList {...item} />
    </TouchableOpacity>
  );

  const RdvComponent = useMemo(() => {
    const bool = true;
    const illustrationRdv = bool
      ? require('../../assets/illustrations/nothing.png')
      : require('../../assets/illustrations/rdv.png');

    const title = bool ? 'Pas de rendez-vous prévu' : 'Prochain rendez-vous';
    const date = bool ? 'Voir les catégories' : 'Lundi 12 février 2023';
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image source={illustrationRdv} />
        <View>
          <Text style={{fontSize: 16}}>{title}</Text>
          <Text
            style={{
              fontSize: 14,
              textAlign: 'center',
              textDecorationLine: 'underline',
            }}>
            {date}
          </Text>
        </View>
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <HeaderHome />

      <View style={styles.content}>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{marginHorizontal: 16}}
          ListHeaderComponent={() => {
            return (
              <>
                <View style={styles.imageCard}>{RdvComponent}</View>
                <View style={styles.title}>
                  <Text style={{fontSize: 24, fontWeight: '600'}}>
                    A proximité
                  </Text>
                  {/* <View style={{}}>
                    <ButtonComponent
                      onPress={() => {}}
                      container={{
                        backgroundColor: colors.black,
                        paddingHorizontal: 8,
                        paddingVertical: 8,
                        borderRadius: 10,
                      }}
                      title={'Voir plus'}
                      textStyle={{
                        fontSize: 14,
                        fontWeight: '700',
                        color: 'white',
                      }}
                    />
                  </View> */}
                </View>
              </>
            );
          }}
          data={etablissements}
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
    </View>
  );
};

Home.propTypes = {};
Home.defaultProps = {};
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    overflow: 'hidden',
    backgroundColor: colors.white,
    marginTop: -110,
    zIndex: 2,
    flex: 1,
  },
  title: {
    marginTop: 50,
    marginBottom: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    height: 120,
    backgroundColor: colors.oarangeLight,
    borderRadius: 20,
    marginTop: 20,
  },
  imageCard: {
    height: 103,
    backgroundColor: colors.beige,
    marginTop: 30,
    justifyContent: 'center',
    marginHorizontal: 16,
    borderRadius: 10,
  },
});
