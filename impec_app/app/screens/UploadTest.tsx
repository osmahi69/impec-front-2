import React, {FC, ReactElement} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {RNFFmpeg} from 'react-native-ffmpeg';

type ChildProps = {
  //define props
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};
const UploadTest: FC<ChildProps> = (
  {
    /* destructured props */
  },
): ReactElement => {
  const handlePicker = async () => {
    const options = {
      mediaType: 'video',
    };
    const result = await launchImageLibrary(options);
    const path = result?.assets[0]?.uri;

    const urlComponents = path.split('/');

    RNFFmpeg.executeWithArguments([
      '-i',
      urlComponents,
      '-c:v',
      'mpeg4',
      'file2.mp4',
    ]).then(result => console.log(`FFmpeg process exited with rc=${result}.`));

    console.log(' *** result ***', JSON.stringify(result, null, 2));
  };
  return (
    <View style={styles.container}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            handlePicker();
          }}
          style={styles.btn}>
          <Text style={{fontSize: 14, color: '#fff'}}>Upload file</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

UploadTest.propTypes = {};
UploadTest.defaultProps = {};
export default UploadTest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  btn: {
    height: 48,
    width: '90%',
    backgroundColor: 'orange',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
