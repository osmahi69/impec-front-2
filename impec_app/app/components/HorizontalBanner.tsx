import React from 'react';
import {Image, Platform} from 'react-native';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';

import {Dimensions, StyleSheet, View} from 'react-native';
import {colors} from '../theme/colors';

const {width} = Dimensions.get('window');
const HorizontalBanner = ({data}: {data: []}) => {
  /* 
     <ParallaxImage
            source={{uri: item.image.uri}}
            containerStyle={styles.imageContainer}
            style={styles.image}
            parallaxFactor={0.4}
            //="contain"
            {...parallaxProps}
          /> 
           */
  return (
    <Carousel
      data={data}
      renderItem={({item}, parallaxProps) => {
        return (
          <Image source={{uri: item.image.uri}} style={styles.imageContainer} />
        );
      }}
      hasParallaxImages={true}
      sliderWidth={width}
      sliderHeight={width}
      itemWidth={width - 10}
      autoplay
    />
  );
};

const styles = StyleSheet.create({
  container: {},
  bannerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  image: {
    width: width,
    marginRight: 10,
    borderRadius: 5,
  },
  imageContainer: {
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginTop: 0,
    height: 200,
    resizeMode: 'contain',
    overflow: 'hidden',
    width: '100%',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    //resizeMode: "stretch"
  },
});

export default HorizontalBanner;
