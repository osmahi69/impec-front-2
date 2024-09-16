import React, {FC, ReactElement, useEffect, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import PropTypes from 'prop-types';
import {Text} from 'react-native';
import {StackActions, useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-ionicons';
import {colors} from '../../theme/colors';
import StarRating from 'react-native-star-rating';
import {ICourse} from '../../types/ICourse';
import {TouchableOpacity} from 'react-native';
import {terminerCourse} from '../../services/courseAPI';
import {useMutation} from 'react-query';
import {Alert} from 'react-native';
import {HeaderAuth} from '../../navigation/stacks/AuthStack';

type ChildProps = {};
const DepositedCustomer: FC<ChildProps> = ({}): ReactElement => {
  const route = useRoute();
  const navigation = useNavigation();
  const {data}: {data: ICourse | undefined} = route.params;
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState({
    starCount: 4,
  });

  const onStarRatingPress = rating => {
    setRating({starCount: rating});
  };
  const terminerCourseRequest = async obj => {
    try {
      const result = terminerCourse(obj);
      return (await result).data;
    } catch (error) {
      console.log(' *** error ***', error);
    }
  };

  const terminerCourseMutation = useMutation(terminerCourseRequest);
  const {data: result, isLoading, error, isError} = terminerCourseMutation;

  const handleSubmit = () => {
    const obj = {
      ...data,
      commentaire: comment,
      note: rating?.starCount,
    };
    terminerCourseMutation.mutate(obj);
  };

  useEffect(() => {
    if (result?.response) {
      Alert.alert('Client déposé', 'Course finie avec succès');
      navigation.dispatch(StackActions.popToTop());
    }
  }, [result]);

  return (
    <View style={styles.container}>
      <HeaderAuth title="Client déposé" />
      <View
        style={{marginHorizontal: 16, justifyContent: 'center', marginTop: 30}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 14, fontWeight: '600'}}>Client :</Text>
          <Text style={{fontSize: 14, marginLeft: 10}}>
            {data?.client_nom_prenom}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            alignItems: 'center',
          }}>
          <Icon name={'calendar'} color={colors.black} />
          <View style={{}}>
            <Text style={{fontSize: 14, marginLeft: 10}}>
              {data?.heure_prisecharge}
            </Text>
            <Text style={{fontSize: 14, marginLeft: 10}}>
              {data?.date_prisecharge}
            </Text>
          </View>
        </View>
        <View style={{width: '90%', marginTop: 20}}>
          <Text style={{fontWeight: '600'}}>Avis client </Text>
          <StarRating
            disabled={false}
            emptyStar={'ios-star-outline'}
            fullStar={'ios-star'}
            halfStar={'ios-star-half'}
            iconSet={'Ionicons'}
            maxStars={5}
            rating={rating.starCount}
            selectedStar={rating => onStarRatingPress(rating)}
            fullStarColor={'#ffab00'}
          />
        </View>
        <View style={styles.containerComment}>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={6}
            placeholder="Ajouter un commentaire..."
            value={comment}
            onChangeText={setComment}
            textAlignVertical="top"
          />
        </View>
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            backgroundColor: colors.blue,
            borderRadius: 10,
            justifyContent: 'center',
          }}>
          <Text style={{marginLeft: 10, fontWeight: '600', color: '#ffffff'}}>
            Valider
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

DepositedCustomer.propTypes = {};
DepositedCustomer.defaultProps = {};
export default DepositedCustomer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  containerComment: {
    padding: 10,
    marginTop: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
});
