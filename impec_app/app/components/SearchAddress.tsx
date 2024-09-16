// @flow
import Voice from '@react-native-community/voice';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import React, {FC, ReactElement, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  FlatList,
  Route,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {HeaderAuth} from '../navigation/stacks/AuthStack';
import {colors} from '../theme/colors';
import {theme} from '../theme/theme';
import Icon from 'react-native-ionicons';

/**
 * Options menu droite (details sujet)
 * Signalement d'urgence, contenu illicite, non respect de la chart
 */

export type addressAutocomplete = {
  latitude: number;
  longitude: number;
  address: string;
};
type ChildProps = {
  //define props
  route: Route;
  navigation: Route;
  callback: (value: addressAutocomplete) => void;
};
export const SearchAddress: FC<ChildProps> = ({route}): ReactElement => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const {callback} = route?.params || {};
  const onSelect = route?.params?.onSelect;
  const filterList = route?.params?.filterList;
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const formMethods = useForm({
    defaultValues: {},
  });
  const watchSearch = formMethods.watch('search');
  const [isRecording, setIsRecording] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [isRecordingLoading, setIsRecordingLoading] = useState(false);

  const [loading, setLoading] = React.useState(false);
  const GOOGLE_API_KEY = 'AIzaSyArj8Ko69EZzAo8i3JIOsyn2126IBdP6ck';

  const startRecording = async () => {
    setIsRecordingLoading(true);

    try {
      await Voice.start('fr-FR'); // Démarre l'enregistrement en français
      Voice.onSpeechResults = onSpeechResults;
      setIsRecording(true);
      setIsRecordingLoading(false);
    } catch (e) {
      console.error(e);
      setIsRecordingLoading(false);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    Voice.destroy().then(Voice.removeAllListeners);
  };

  const onSpeechResults = event => {
    setText(event.value[0]);
    setSpeechText(event.value[0]);
  };

  React.useEffect(() => {
    if (text?.length > 2) {
      const timeout = setTimeout(() => {
        setLoading(true);
        searchAPI(text)
          .then(e => e.json())
          .then(e => {
            if (e?.predictions?.length > 0) {
              if (filterList) {
                setSearchResults(
                  e?.predictions?.filter(e =>
                    e.types.find(f => f === filterList),
                  ),
                );
              } else {
                setSearchResults(e?.predictions);
              }
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }, 800);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [text, setText]);

  const searchAPI = address => {
    const countryRestriction = 'fr'; // Code pays pour la France
    //const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?language=fr&place_id=${placeId}&fields=name,geometry,address_component&key=${GOOGLE_API_KEY}`;

    const link = `https://maps.googleapis.com/maps/api/place/autocomplete/json?language=fr&key=${GOOGLE_API_KEY}&input=${address}&types=${
      filterList ?? 'address'
    }`;

    return fetch(link);
  };

  const getCoordinatesFromPlaceId = async placeId => {
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.results.length > 0) {
        const location = data.results[0].geometry.location;
        const address = data.results[0].formatted_address;
        const addressComponents = data.results[0].address_components;
        const city = addressComponents.find(component =>
          component.types.includes('locality'),
        )?.long_name;
        const postalCode = addressComponents.find(component =>
          component.types.includes('postal_code'),
        )?.long_name;
        return {
          latitude: location.lat,
          longitude: location.lng,
          address,
          zipcode: postalCode,
          city,
        };
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectAddress = async (address: any) => {
    const coords = await getCoordinatesFromPlaceId(address?.place_id);

    if (coords) {
      callback(coords);
      navigation.goBack();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <HeaderAuth title="Adresse" />
      {/* <View style={styles.containerText}>
          <Text style={styles.text}>
            {isRecording ? 'Arrêter' : 'Commencer'}
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={isRecording ? stopRecording : startRecording}
            style={{}}>
            <View
              style={{
                height: 80,
                width: 80,
                backgroundColor: !isRecording ? colors.blue : colors.graylight,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 40,
              }}>
              {isRecordingLoading ? (
                <ActivityIndicator />
              ) : (
                <Icon
                  size={24}
                  ios={'mic'}
                  android={'mic'}
                  color={colors.white}
                />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.speechText}>{speechText}</Text>
        </View> */}

      <View style={{marginHorizontal: 16}}>
        <TextInput
          autoFocus
          name={'search'}
          placeholder={'Adresse'}
          placeholderHead={'Adresse'}
          placeholderHeadStyle={{
            color: colors.white,
            fontSize: 18,
            fontFamily: theme.fonts.regular,
          }}
          onChangeText={text => setText(text)}
          style={{
            height: 52,
            borderRadius: 10,
            backgroundColor: colors.textInput,
            paddingHorizontal: 10,
            marginVertical: 5,
            justifyContent: 'center',
            marginTop: 20,
            fontSize: 18,
          }}
        />

        {/* Show result */}
        <FlatList
          contentContainerStyle={{
            backgroundColor: colors.white,
            borderRadius: 10,
          }}
          ListHeaderComponent={
            loading && <ActivityIndicator color={colors.orange} style={{}} />
          }
          ItemSeparatorComponent={() => <View style={{}} />}
          data={searchResults}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => handleSelectAddress(item)}
                activeOpacity={0.7}
                style={{
                  height: 48,
                  width: '100%',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: theme.fonts.regular,
                    fontWeight: '400',
                  }}>
                  {item?.description}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  select: {
    height: 120,
    width: '100%',
    borderStyle: 'dashed',
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultItem: {
    justifyContent: 'center',
    height: 52,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingLeft: 15,
  },
  containerText: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  speechText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});
