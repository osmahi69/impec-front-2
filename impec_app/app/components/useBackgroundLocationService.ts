import {useEffect} from 'react';
import Geolocation from 'react-native-geolocation-service';
import {useApi} from '../hook/useApi';
import {useMutation, useQuery} from 'react-query';
import axios from 'axios';
import PK from '../../app.json';
import {PermissionsAndroid, PermissionStatus, Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const API_URL = PK.API_URL;
const PERMISSIONS_ANDROID = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
const PERMISSIONS_IOS = 'whenInUse';

const requestLocationPermission = async () => {
  const backgroundPermission = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);

  if (backgroundPermission !== RESULTS.GRANTED) {
    const result = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
    return result === RESULTS.GRANTED;
  }

  return true;
};

const PERMISSIONS_MESSAGES = {
  android: {
    title: "Permission d'accès à la localisation",
    message:
      'Nous avons besoin de votre permission pour accéder à votre emplacement.',
    buttonPositive: 'Autoriser',
  },
  ios: 'whenInUse', // Vous pouvez ajuster le message pour iOS si nécessaire
};

const requestPermission = async (permission, platform) => {
  try {
    if (platform === 'android') {
      const granted = await PermissionsAndroid.request(
        permission,
        PERMISSIONS_MESSAGES.android,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else if (platform === 'ios') {
      const statuswhenInUse = await Geolocation.requestAuthorization(
        'whenInUse',
      );
      if (statuswhenInUse === 'granted') {
        return statuswhenInUse;
      }

      const statuAlways = await Geolocation.requestAuthorization('always');
      if (statuAlways === 'granted') {
        return statuAlways;
      }
      return false;
    }
    return false;
  } catch (e) {
    console.log('Erreur lors de la vérification de la permission GPS', e);
    return false;
  }
};

const checkPermissionGPS = async () => {
  const platform = Platform.OS;
  const permission =
    platform === 'android' ? PERMISSIONS_ANDROID : PERMISSIONS_IOS;

  try {
    const granted = await requestPermission(permission, platform);

    if (granted) {
      return true;
    } else {
      console.log(`Permission GPS non accordée sur ${platform}`);
      return false;
    }
  } catch (e) {
    console.log('Erreur lors de la vérification de la permission GPS', e);
    return false;
  }
};

const savePosition = async (position: any) => {
  try {
    const res = await axios.post(`${API_URL}/users/savepoz`, position);
  } catch (error) {
    console.log(' *** error ***', error);
  }
};

const useBackgroundLocationService = () => {
  useEffect(() => {
    const launchServiceBG = async () => {
      await sendUserLocation();
      // Vous pouvez également ajouter d'autres tâches d'initialisation ici si nécessaire
    };

    const sendUserLocation = async () => {
      try {
        if (__DEV__) {
          let location = {
            latitude: 48.8562098,
            longitude: 2.4257559,
          };

          savePosition(location); //
          return;
        }

        const isBackgroundPermissionGranted = await requestLocationPermission();

        const permissions = await checkPermissionGPS();
        if (permissions) {
          Geolocation.getCurrentPosition(
            position => {
              const {latitude, longitude} = position.coords;

              if (__DEV__) {
                let location = {
                  latitude: 48.8562098,
                  longitude: 2.4257559,
                };

                savePosition(location);
                return;
              }

              let location;
              location = {latitude, longitude};

              savePosition(location);
            },
            error => {
              // Gérer les erreurs ici si nécessaire
              console.log(
                'Erreur lors de la récupération de la position GPS',
                error,
              );
            },
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
          );

          // Configuration de la géolocalisation
          const geoOptions = {
            enableHighAccuracy: true,
            showsBackgroundLocationIndicator: true, // Indicateur de suivi en arrière-plan
            locationTimeout: 10000, // Temps d'attente pour la nouvelle position en arrière-plan (en millisecondes)
            distanceFilter: 20, // Mettez à 10 pour recevoir des mises à jour toutes les 10 mètres
            fastestInterval: 5000, // Intervalle minimum entre les mises à jour (en millisecondes)
          };

          // Démarrez le suivi de la position
          const watchId = Geolocation.watchPosition(
            position => {
              const {latitude, longitude} = position.coords;
              let location;
              location = {latitude, longitude};
              savePosition(location);
            },
            error => console.error(error),
            geoOptions,
          );

          // Nettoyez le suivi de la position lorsque le composant est démonté
          return () => {
            Geolocation.clearWatch(watchId);
          };
        } else {
          console.log('Problème de permission GPS');
        }
      } catch (e) {
        // Gérer les erreurs ici si nécessaire
        console.log("Erreur lors de l'envoi de la localisation GPS", e);
      }
    };

    launchServiceBG();

    // Nettoyage : arrêter le service de localisation lorsque le composant est démonté
    return () => {
      // Vous pouvez arrêter le service de localisation ici si nécessaire
    };
  }, []);

  return null; // Ce hook n'a pas besoin de renvoyer de JSX, donc nous renvoyons simplement null
};

export default useBackgroundLocationService;
