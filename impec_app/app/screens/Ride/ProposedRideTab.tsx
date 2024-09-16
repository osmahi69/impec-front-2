import React, {useState} from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import ProposedRide from './ProposedRide';
import {HeaderAuth} from '../../navigation/stacks/AuthStack';
import ProposedRideDone from './ProposedRideDone';
import {colors} from '../../theme/colors';
import BackgroundImpec from '../../components/BackgroundImpec';
/* import MesCoursesProposeesScreen from './MesCoursesProposeesScreen'; // Remplacez par le chemin vers votre composant
import MesCoursesAVenirScreen from './MesCoursesAVenirScreen'; // Remplacez par le chemin vers votre composant */

const initialLayout = {width: Dimensions.get('window').width};

const ProposedRideTab = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'coursesProposees', title: 'À venir'},
    {key: 'courseProposeesDone', title: 'Terminées'},
  ]);

  const renderScene = SceneMap({
    coursesProposees: () => <ProposedRide index={index} />,
    courseProposeesDone: () => <ProposedRideDone isDone={true} index={index} />,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
      labelStyle={{color: colors.white}}
    />
  );

  return (
    <BackgroundImpec>
      <HeaderAuth title="Mes courses proposées" />
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
    backgroundColor: colors.primary,
    marginTop: 20,
  },
  indicator: {
    backgroundColor: '#fff', // Couleur de l'indicateur de l'onglet actif
  },
});

export default ProposedRideTab;
