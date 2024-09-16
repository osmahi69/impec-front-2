import {useIsFocused, useNavigation} from '@react-navigation/native';
import {HStack, Switch} from 'native-base';
import React, {FC, ReactElement, useEffect, useState} from 'react';
import VersionInfo from 'react-native-version-info';
import {getVersion} from '../../services/toolsAPI';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import Icon from 'react-native-ionicons';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import HorizontalBanner from '../../components/HorizontalBanner';
import useBackgroundLocationService from '../../components/useBackgroundLocationService';
import {useApi} from '../../hook/useApi';
import {colors} from '../../theme/colors';
import {UserContext} from '../../contexte/authContext';
import {DateTime} from 'luxon';
import BackgroundImpec from '../../components/BackgroundImpec';
import {myProfile, updateStatusAvailable} from '../../services/authAPI';
import Share from 'react-native-share';
import {checkPaymentStatus} from '../../services/toolsAPI';
import ModalUpdateApp from '../../components/modalUpdateVersion';
import {Linking} from 'react-native';

type ChildProps = {};

const ButtonComponent = ({
  item,
  navigation,
  handleShare,
  totalFuturAccepted,
  totalProposal,
  totalTodayAccepted,
  launchPopWarningDoneCourse,
  totalAttentes,
}: {
  item: Object;
  navigation?: any;
  handleShare?: any;
  totalFuturAccepted?: number;
  totalProposal: number;
  totalTodayAccepted: number;
  totalAttentes: number;
  launchPopWarningDoneCourse?: any;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        if (item?.key === 'addCourse' && totalTodayAccepted > 0) {
          return launchPopWarningDoneCourse();
        }
        item?.key == 'share'
          ? handleShare()
          : navigation?.navigate?.(item?.screen);
      }}
      style={[styles.item, {backgroundColor: item.color}]}>
      <View style={{flexDirection: 'row', gap: 10}}>
        {item.id == 5 && totalProposal > 0 && (
          <>
            <NotifInformations number={totalProposal} />
          </>
        )}
        {item.id == 2 && totalAttentes > 0 && (
          <>
            <NotifInformations number={totalAttentes} />
          </>
        )}
        {item.id == 3 && totalFuturAccepted > 0 && (
          <>
            <NotifInformations number={totalFuturAccepted} />
          </>
        )}

        {item.id == 3 && totalTodayAccepted > 0 && (
          <>
            <NotifInformations number={totalTodayAccepted} isToday={true} />
          </>
        )}
      </View>

      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.itemText}>{item.title}</Text>
        <Icon
          size={28}
          ios={item.icon}
          android={item.icon}
          color={colors.white}
          style={{marginTop: 5}}
        />
      </View>
    </TouchableOpacity>
  );
};
const data = [
  {
    id: '1',
    title: 'Mon agenda',
    color: colors.primary,
    icon: 'book',
    screen: 'AgendaScreen',
  },
  {
    id: '2',
    title: 'Courses en attente',
    color: colors.primary,
    icon: 'hourglass',
    screen: 'WaitingRideTab',
  },
  {
    id: '3',
    title: 'Courses acceptées',
    color: colors.primary,
    icon: 'checkmark',
    screen: 'AcceptedRideTab',
  },
  {
    id: '6',
    title: 'Courses terminée',
    color: colors.primary,
    icon: 'car',
    screen: 'ProposedRideTab',
  },
  {
    id: '4',
    title: 'Proposer une course',
    key: 'addCourse',
    color: colors.primary,
    icon: 'today',
    screen: 'AddCourseForm',
  },
  {
    id: '5',
    title: 'Mes courses proposées',
    color: colors.primary,
    icon: 'car',
    screen: 'ProposedRideTab',
  },
  {
    id: '9',
    title: 'Messages',
    color: colors.primary,
    icon: 'chatboxes',
    screen: 'Conversation',
  },
  {
    id: '10',
    title: `Inviter client ou chauffeur`,
    color: colors.primary,
    icon: 'share-alt',
    screen: 'AgendaScreen',
  },
];
const NotifInformations = ({
  number,
  isToday,
}: {
  number: number;
  isToday?: boolean;
}) => {
  return (
    <View
      style={{
        backgroundColor: isToday ? colors.error : '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        height: 25,
        width: 25,
        borderRadius: 20,
        marginVertical: 5,
      }}>
      <Text
        style={[
          {fontSize: 14, fontWeight: 'bold'},
          isToday && {color: '#ffffff'},
        ]}>
        {number}
      </Text>
    </View>
  );
};
const HomeScreen: FC<ChildProps> = (
  {
    /* destructured props */
  },
): ReactElement => {
  const [totalFuturAccepted, setTotalFuturAccepted] = useState(0);
  const [totalProposal, setTotalProposal] = useState(0);
  const [totalAttentes, setTotalAttentes] = useState(0);
  const [totalTodayAccepted, setTotalTodayAccepted] = useState(0);
  const navigation = useNavigation();
  const [bannerList, setBannerList] = useState([]);
  const {userInfos} = React.useContext(UserContext);
  const isFocused = useIsFocused();
  const [showPopupForce, setShowPopupForce] = React.useState(false);
  const [showPopup, setShowPopup] = React.useState(false);
  useBackgroundLocationService();
  const {API} = useApi();

  if (data.length % 2 !== 0) {
    data.push({id: ' ', color: 'transparent'});
  }

  const readBannerHome = async () => {
    try {
      const result = await API.homerBanner({
        params: 'all',
      });
      return result.data;
    } catch (error) {
      console.log(' *** error banner ***', error);
    }
  };
  const queryClient = useQueryClient();
  const profilRequest = useQuery('status_profile', myProfile);
  const {data: profilData, isLoading: loadingUser, error} = profilRequest;
  const userQuery = useQuery('user', readBannerHome);
  const {data: dataBanner, refetch: refetchBannner} = userQuery;
  const {data: dataPaymentStatus, refetch: refecthPaymentStatus} = useQuery(
    'payment_status',
    checkPaymentStatus,
  );

  useEffect(() => {
    if (dataPaymentStatus?.data) {
      if (!dataPaymentStatus?.data?.response) {
        Alert.alert("IM'PEC", dataPaymentStatus?.data?.msg, [
          {
            text: 'Valider',
            onPress: () => {},
          },
        ]);
        navigation.navigate('PaymentScreen', {
          payData: dataPaymentStatus?.data?.data,
        });
      }
    }
  }, [dataPaymentStatus?.data?.msg]);

  useEffect(() => {
    if (__DEV__) {
      const img1 =
        'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
      const img2 =
        'https://images.pexels.com/photos/163046/welcome-to-our-home-welcome-tablet-an-array-of-163046.jpeg?auto=compress&cs=tinysrgb&w=800';
      const img3 =
        'https://images.pexels.com/photos/3473085/pexels-photo-3473085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
      const fakeDataBanner = `${img1}|${img2}|${img3}`;
      const linksArray = fakeDataBanner?.split('|')?.map(banner => {
        return {
          image: {
            uri: banner,
          },
        };
      });
      setBannerList(linksArray);
    } else {
      if (dataBanner?.data?.homebanner) {
        const linksArray = dataBanner?.data?.homebanner
          ?.split('|')
          ?.map(banner => {
            return {
              image: {
                uri: banner,
              },
            };
          });
        setBannerList(linksArray);
      }
    }
  }, [dataBanner?.data]);

  const totNotifications = async () => {
    try {
      const result = await API.totnotifs({});
      setTotalFuturAccepted(result?.data?.data['TotFuturAcceptees']);
      setTotalProposal(result?.data?.data['TotProposees']);
      setTotalTodayAccepted(result?.data?.data['TotTodayAcceptees']);
      setTotalAttentes(result?.data?.data['TotTodayAttentes']);
      return result.data;
    } catch (error) {
      console.log(' *** error read user ***', error);
    }
  };

  useEffect(() => {
    totNotifications();
  }, []);

  useEffect(() => {
    if (isFocused) {
      totNotifications();
    }
  }, [isFocused]);

  const launchPopWarningDoneCourse = () => {
    return Alert.alert(
      'Inforamtion',
      "Vous avez des courses en cours, n'oubliez pas de déposer le client avant d'en créer une nouvelle",
      [
        {
          text: 'ok',
          onPress: () => {},
        },
      ],
    );
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (totalTodayAccepted > 0) {
        launchPopWarningDoneCourse();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [totalTodayAccepted]);

  const reqUpdateStatuAvailable = useMutation(updateStatusAvailable);
  const {isLoading, isError, isSuccess, data: d} = reqUpdateStatuAvailable;

  const handleChangeDispo = (val: any) => {
    reqUpdateStatuAvailable.mutate({status: val});
  };

  useEffect(() => {
    if (d?.response) {
      queryClient.invalidateQueries('status_profile');
    }
  }, [d]);

  const dispo = React.useMemo(() => {
    return profilData?.data?.current_status === 'disponible';
  }, [profilData]);

  const handleShare = async () => {
    try {
      const options = {
        message: 'Téléchargez notre superbe application !',
        url: 'https://votre-lien-de-téléchargement',
      };

      await Share.open(options);
    } catch (error) {
      console.error('Erreur lors du partage :', error.message);
    }
  };

  React.useEffect(() => {
    handleVersion();
  }, []);

  const handleUpdateApp = () => {
    const linkANDROID = 'market://details?id=fr.impec.mobile';
    const linkIOS = 'itms-apps://itunes.apple.com/fr/app/impec/id1560009435';
    if (Platform.OS === 'android') {
      Linking.canOpenURL(linkANDROID)
        .then(() => Linking.openURL(linkANDROID).catch())
        .catch();
    } else if (Platform.OS === 'ios') {
      Linking.canOpenURL(linkIOS).then(
        supported => {
          supported && Linking.openURL(linkIOS);
        },
        err => console.log(err),
      );
    }
  };

  const handleVersion = async () => {
    const majorVersion = version => {
      let v = version.split('.')[0];
      return parseInt(v);
    };
    const minorsVersion = version => {
      let v = version.split('.')[1];
      return parseInt(v);
    };

    const currentMajorVerisonAPP = majorVersion(VersionInfo.appVersion);
    const currentMinorverisonAPP = minorsVersion(VersionInfo.appVersion);

    if (Platform.OS === 'android') {
      console.log('Current version android ----', VersionInfo.appVersion);
    }
    if (Platform.OS === 'ios') {
      console.log('Current version android ----', VersionInfo.appVersion);
    }

    const res = await getVersion(undefined);
    const {response, iosVersion: ios, androidVersion: android} = res;

    if (response) {
      let majorVersionIOS = majorVersion(ios);
      let minorVersionIOS = minorsVersion(ios);

      let majorVersionANDROID = majorVersion(android);
      let minorVersionANDROID = minorsVersion(android);

      if (Platform.OS === 'android') {
        if (majorVersionANDROID > currentMajorVerisonAPP) {
          //display forcing pop up upadte
          setShowPopupForce(true);
        } else if (minorVersionANDROID > currentMinorverisonAPP) {
          setShowPopup(true);
        }
      }

      if (Platform.OS === 'ios') {
        console.log(' *** majorVersionIOS ***', majorVersionIOS);
        console.log(' *** currentMajorVerisonAPP ***', currentMajorVerisonAPP);

        console.log(' *** minorVersionIOS ***', minorVersionIOS);
        console.log(' *** currentMinorverisonAPP ***', currentMinorverisonAPP);
        if (majorVersionIOS > currentMajorVerisonAPP) {
          //display forcing pop up upadte
          setShowPopupForce(true);
        } else if (minorVersionIOS > currentMinorverisonAPP) {
          setShowPopup(true);
        }
      }
    }
  };

  const renderItem = ({item, index}) => (
    <>
      <ButtonComponent
        item={item}
        handleShare={handleShare}
        totalFuturAccepted={totalFuturAccepted}
        totalProposal={totalProposal}
        totalTodayAccepted={totalTodayAccepted}
        totalAttentes={totalAttentes}
        navigation={navigation}
        launchPopWarningDoneCourse={launchPopWarningDoneCourse}
      />
    </>
  );

  return (
    <BackgroundImpec>
      <>
        {showPopupForce && (
          <ModalUpdateApp
            showPopupForce={showPopupForce}
            showPopup={showPopup}
            handleUpdateApp={handleUpdateApp}
          />
        )}

        {showPopup && (
          <ModalUpdateApp
            callbackModal={() => {
              setShowPopup(false);
            }}
            showPopupForce={showPopupForce}
            showPopup={showPopup}
            handleUpdateApp={handleUpdateApp}
          />
        )}
      </>
      <FlatList
        ListHeaderComponent={() => (
          <>
            <HorizontalBanner data={bannerList} />
            <HStack alignItems="center" space={0} marginTop={5}>
              {loadingUser || isLoading ? (
                <ActivityIndicator
                  size={'small'}
                  style={{marginHorizontal: 10}}
                />
              ) : (
                <Switch
                  value={dispo ?? false}
                  onValueChange={val => handleChangeDispo(val)}
                  size="sm"
                />
              )}
              <View
                style={{
                  backgroundColor:
                    dispo ?? false ? colors.success : colors.error,
                  padding: 8,
                  borderRadius: 8,
                }}>
                <Text
                  style={{fontSize: 14, fontWeight: '600', color: '#ffffff'}}>
                  {dispo ?? false ? 'Disponible' : 'Indisponible'}
                </Text>
              </View>
            </HStack>
          </>
        )}
        data={data}
        extraData={totNotifications}
        renderItem={renderItem}
        contentContainerStyle={{marginTop: 20}}
        keyExtractor={item => item.id}
        numColumns={2}
        ListFooterComponent={() => {
          return (
            <View style={{}}>
              {/*  <ButtonComponent
                item={{
                  id: '1',
                  title: `Inviter un client ou un chauffeur`,
                  color: colors.primary,
                  icon: "share-alt",
                  screen: 'AgendaScreen',
                }}
              /> */}
            </View>
          );
        }}
      />
    </BackgroundImpec>
  );
};

HomeScreen.propTypes = {};
HomeScreen.defaultProps = {};
export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    //resizeMode: 'cover',
  },
  item: {
    flex: 1,
    //aspectRatio: 1.9,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 5,
  },
  itemText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  backgroundImage: {
    //flex: 1,
    resizeMode: 'cover',
    height: 45,
    marginHorizontal: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateTimeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
