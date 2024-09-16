import React, {useState} from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import ProposedRide from './ProposedRide';
import {HeaderAuth} from '../../navigation/stacks/AuthStack';
import AcceptedRide from './AcceptedRide';
import AcceptedRideDone from './AcceptedRideDone';
import BackgroundImpec from '../../components/BackgroundImpec';
import { colors } from '../../theme/colors';
/* import MesCoursesProposeesScreen from './MesCoursesProposeesScreen'; // Remplacez par le chemin vers votre composant
import MesCoursesAVenirScreen from './MesCoursesAVenirScreen'; // Remplacez par le chemin vers votre composant */

const initialLayout = {width: Dimensions.get('window').width};

const MesCoursesProposeesScreen = () => {
  return <View style={{}}>{/* Element */}</View>;
};

const MesCoursesAVenirScreen = () => {
  return <View style={{}}>{/* Element */}</View>;
};

const AcceptedRideTab = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'coursesProposees', title: 'À venir'},
    {key: 'coursesAVenir', title: 'Terminées'},
  ]);

  const renderScene = SceneMap({
    coursesProposees: () => <AcceptedRide />,
    coursesAVenir: () => <AcceptedRideDone />,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
      labelStyle={{ color: colors.white }} 
    />
  );

  return (
    <BackgroundImpec>
      <HeaderAuth title="Mes courses acceptées" />
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />
    </BackgroundImpec>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.primary, // Couleur de fond de l'onglet
    marginTop: 20,
  },
  indicator: {
    backgroundColor: "#fff" // Couleur de l'indicateur de l'onglet actif
  },
});

export default AcceptedRideTab;
