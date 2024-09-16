import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Image,
} from 'react-native';
import {Container, Spinner} from 'native-base';
import React, {useCallback, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import {createPaymentSession} from '../../services/toolsAPI';
import {colors} from '../../theme/colors';

const PaymentScreen = (
  {
    /* destructured props */
  },
) => {
  const [loading, setLoading] = useState(false);
  const [isMonth, setIsMonth] = useState('mensuel');
  const route = useRoute();
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const {payData} = route?.params || {};

  const handleSelect = async (
    type: 'mensuel' | 'annuel' | 'mensuel_ponctu',
  ) => {
    setIsMonth(type);
  };

  const handlePayment = useCallback(async () => {
    try {
      const session = await createPaymentSession({
        ...(isMonth === 'mensuel' && {isAnnual: true}),
        ...(isMonth === 'mensuel_ponctu' && {isMensuel: true}),
      });

      if (session?.response) {
        navigation.navigate('webview', {url: session?.data?.sessionlink});
      }
    } catch (error) {}
  }, [isMonth]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {loading ? (
            <Spinner color="blue" />
          ) : (
            <View>
              <View>
                <View style={styles.paymentContainer}>
                  {/*  <Text style={styles.headerText}>Votre abonnement</Text> */}
                  {/*   <Text style={styles.offerText}>{payData?.offer}</Text> */}
                  {/* <RenderHtml
                    contentWidth={width}
                    source={{
                      html: `${payData?.offer}`,
                    }}
                  /> */}
                  <Image source={require('../../assets/mini_map.png')} />
                  <Text style={{fontSize: 16, color: '#ffffff'}}>
                    {/* Im-pec est bien plus qu'une simple application de taxi.
                    C'est un outil conçu pour garantir votre indépendance en
                    tant que chauffeur de taxi, vous connectant avec d'autres
                    chauffeurs partageant les mêmes valeurs et aspirations.
                    Notre application vous permet de rejoindre une communauté de
                    chauffeurs de taxi qui partagent votre désir de préserver
                    l'artisanat et l'individualité dans ce secteur. */}{' '}
                    {'\n'}
                    {'\n'}
                    {/* Contrairement à d'autres applications, Im-pec est fondée sur
                    le principe de l'entraide. Nous croyons en la force de la
                    solidarité entre chauffeurs de taxi, et notre plateforme est
                    conçue pour faciliter le partage, l'entraide et le soutien
                    mutuel. Avec Im-pec, vous pouvez éviter les kilomètres à
                    vide, trouver des solutions de dépannage en cas de besoin,
                    et profiter d'une communauté de chauffeurs de taxi qui
                    comprend vos défis et vos aspirations. Rejoignez Im-pec dès
                    aujourd'hui et découvrez une nouvelle façon de vivre votre
                    métier de chauffeur de taxi, basée sur la solidarité,
                    l'entraide et l'indépendance */}
                  </Text>
                  <View style={{alignItems: 'center'}}>
                    <Text style={{fontSize: 16, color: '#FFFFFF'}}>
                      Proposer une course
                    </Text>
                    <Text
                      style={{fontSize: 16, color: '#FFFFFF', marginTop: 10}}>
                      Voir les courses autour de soi
                    </Text>
                    <Text
                      style={{fontSize: 16, color: '#FFFFFF', marginTop: 10}}>
                      Plannifer des courses à l'avance
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{paddingHorizontal: 10}}>
                <TouchableOpacity
                  style={[
                    styles.paymentButton,
                    {
                      borderColor:
                        isMonth === 'annuel' ? '#000000' : '#00000070',
                    },
                  ]}
                  disabled={loading}
                  onPress={() => handleSelect('annuel')}>
                  <Text style={[styles.buttonText, {fontSize: 12}]}>
                    Payer par mois (ht)
                  </Text>
                  <Text style={styles.buttonText}>19€/Mois</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.paymentButton,
                    {
                      borderColor:
                        isMonth === 'mensuel_ponctu' ? '#000000' : '#00000070',
                    },
                  ]}
                  disabled={loading}
                  onPress={() => handleSelect('mensuel_ponctu')}>
                  <Text style={[styles.buttonText, {fontSize: 12}]}>
                    Payer chaque mois
                  </Text>
                  <Text style={styles.buttonText}>25€/Mois</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.paymentButton,
                    {
                      borderColor:
                        isMonth === 'mensuel' ? '#000000' : '#00000070',
                    },
                  ]}
                  disabled={loading}
                  onPress={() => handleSelect('mensuel')}>
                  <Text style={[styles.buttonText, {fontSize: 12}]}>
                    Payer un an
                  </Text>
                  <Text style={styles.buttonText}>190€/année</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handlePayment()}
                  style={[
                    styles.buttonAccepted,
                    {backgroundColor: colors.primary},
                  ]}>
                  <Text style={{fontSize: 16, color: '#ffffff'}}>
                    Procéder au paiement
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  offerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  paymentContainer: {
    backgroundColor: 'rgba(59, 89, 152, 0.8)',
    paddingTop: 10,
    marginBottom: 10,
    /* shadowColor: 'rgba(59, 89, 152, 0.9)', */
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
    borderRadius: 10,
    shadowOpacity: 0.9,
    marginHorizontal: 10,
    padding: 9,
  },
  paymentButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#000000',
    padding: 15,
    marginTop: 30,
  },
  buttonAccepted: {
    alignSelf: 'center',
    marginTop: 40,
    height: 42,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 4.65,
    shadowOpacity: 0.29,
    elevation: 7,
    marginBottom: 40,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});
