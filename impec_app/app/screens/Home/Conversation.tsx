import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {DateTime} from 'luxon';
import {Text} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Linking,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {MarkingProps} from 'react-native-calendars/src/calendar/day/marking';
import Icon from 'react-native-ionicons';
import {useQuery} from 'react-query';
import {useApi} from '../../hook/useApi';
import {colors} from '../../theme/colors';
import {ICourse} from '../../types/ICourse';
import {ContactTypes} from '../../types/ContactTypes';

// Interface pour le type des éléments de la liste
interface ListItem {
  id: string;
  title: string;
}

type DateOptionsMap = {
  [date: string]: MarkingProps;
};

// Propriétés du composant Conversation
interface ConversationProps {
  isDone?: Boolean;
  index: Number;
}

const Conversation: React.FC<ConversationProps> = ({isDone, index}) => {
  const {API} = useApi();

  const optionsDateSelected: MarkingProps = {
    selected: true,
    disableTouchEvent: false,
    selectedColor: colors.blue,
    selectedTextColor: colors.white,
    type: 'dot',
  };

  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [markedDates, setMarkedDates] = useState<DateOptionsMap>({});
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const showBottomSheet = () => {
    setIsBottomSheetVisible(true);
  };
  const hideBottomSheet = () => {
    setIsBottomSheetVisible(false);
  };
  const [listOfContacts, setListOfContacts] = useState<Array<ICourse>>();

  const readContact = async () => {
    try {
      const result = await API.getTaxiList({
        keyword: '',
      });

      if (result?.data?.response) {
        return result?.data?.data;
      }
    } catch (error) {
      console.log(' *** error read user ***', error);
    }
  };

  const userQuery = useQuery('readContacts', readContact);
  const {
    data: allContacts,
    refetch: refetch,
    isRefetching: refetchLoading,
    isLoading,
  } = userQuery;

  const handleDayPress = date => {
    setSelectedDate(date?.dateString);
    hideBottomSheet();
  };

  useEffect(() => {
    refetch();
  }, [selectedDate]);

  useEffect(() => {
    if (allContacts?.length > 0) {
      setListOfContacts(allContacts);
    }
  }, [allContacts]);

  const handlePhone = (tel: string) => {
    try {
        Linking.openURL(`tel:${tel}`);
    } catch (error) {   
        console.log(' *** error ***',error)
    }
  };

  const handleChat = item => {

    navigation.navigate('Chat', {data: item})
  }

  // Rendu des éléments de la liste
  const renderItem = ({item}: {item: ContactTypes}) => {
    return (
      <TouchableOpacity  onPress={() => handleChat(item)} style={styles.item}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
           
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon
              size={28}
              ios={'person'}
              android={'person'}
              color={colors.black}
              style={{marginLeft: 10}}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginLeft: 15,
              }}>
              <View
                style={{
                  height: 12,
                  width: 12,
                  backgroundColor:
                    item?.status === 'disponible' ? 'green' : 'red',
                  borderRadius: 6,
                  marginTop: 10,
                }}
              />
              <View style={{marginLeft: 10}}>
                <Text fontSize={18} fontWeight={'bold'}>
                  {item?.raison_social}
                </Text>

                <Text fontSize={18} fontWeight={'semiBold'}>
                  {item?.nom} {item?.prenom}
                </Text>
                <Text
                  fontSize={14}
                  fontWeight={'ligth'}
                  numberOfLines={1}
                  width={'80%'}>
                  {item?.prenom}
                </Text>
                <Text>{item?.date_prisecharge_display}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handlePhone(item?.tel ?? item?.fix)}
            style={{position:"absolute", right:10, backgroundColor:"#e0e0e0", padding:20, borderRadius:10}}>
            <Icon
              size={28}
              ios={'call'}
              android={'call'}
              color={colors.black}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={listOfContacts}
        renderItem={renderItem}
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                marginHorizontal: 16,
                marginTop: 40,
              }}>
              <Text fontWeight={'semibold'} textAlign={'center'}>
                Vous n'avez pas course {'\n'} Afficher le calendrier pour
                affiner par date
              </Text>
            </View>
          );
        }}
        ListHeaderComponent={() => {
          return (
            <View style={{}}>
              {selectedDate && (
                <Text>
                  <Text fontWeight={'medium'}> Prévu pour le : </Text>
                  {DateTime.fromISO(selectedDate).toFormat('cccc dd MMMM yyyy')}
                </Text>
              )}
            </View>
          );
        }}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

// Styles du composant
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
  },
  listContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  item: {
    borderRadius: 15,
    backgroundColor: '#E7E8E9',
    padding: 10,
    marginVertical: 10,
  },
});

export default Conversation;
