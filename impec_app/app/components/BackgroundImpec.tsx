import React, {FC, ReactElement, ReactNode} from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';

type ChildProps = {
    children: ReactNode
};
const BackgroundImpec: FC<ChildProps> = (
    {children}
): ReactElement => {
  const bg =
    'https://images.pexels.com/photos/12742133/pexels-photo-12742133.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  return (
    <ImageBackground source={require("../assets/bg-clair.jpg")} style={{flex: 1}}>
      {children}
      <View style={styles.overlay}></View>

    </ImageBackground>
  );
};

BackgroundImpec.propTypes = {};
BackgroundImpec.defaultProps = {};
export default BackgroundImpec;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Couleur de l'overlay avec une opacité de 0.5
    zIndex: -99, // Assurez-vous que l'overlay est au-dessus des autres composants
  },
});
