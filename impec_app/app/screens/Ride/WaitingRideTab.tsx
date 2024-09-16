import React, {useState} from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import ProposedRide from './ProposedRide';
import {HeaderAuth} from '../../navigation/stacks/AuthStack';
import WaitingRide from './WaitingRide';
import { colors } from '../../theme/colors';
import BackgroundImpec from '../../components/BackgroundImpec';

const initialLayout = {width: Dimensions.get('window').width};

const MesCoursesProposeesScreen = () => {
  return <View style={{}}>{/* Element */}</View>;
};

const MesCoursesAVenirScreen = () => {
  return <View style={{}}>{/* Element */}</View>;
};

const WaitingRideTab = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([{key: 'coursesProposees', title: 'Du Jour'}]);

  const renderScene = SceneMap({
    coursesProposees: WaitingRide,
    coursesAVenir: MesCoursesAVenirScreen,
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
      <HeaderAuth title="Courses en attente" />
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
    backgroundColor: "#fff" // Couleur de l'indicateur de l'onglet actif
  },
});

export default WaitingRideTab;
