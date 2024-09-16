import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import {colors} from '../../theme/colors';
import {Image} from 'react-native';

type AmbulanceTaxiChoiceProps = {
  isConventionned?: boolean;
  defaultChoice?:
    | 'Taxi'
    | 'Ambulance'
    | 'tpmr'
    | 'break'
    | 'berline'
    | 'monospace'
    | 'van';
  onSelectChoice: (
    choice:
      | 'Taxi'
      | 'Ambulance'
      | 'tpmr'
      | 'break'
      | 'berline'
      | 'monospace'
      | 'van',
  ) => void;
};

const ButtonAmbulanceTaxiChoice: React.FC<AmbulanceTaxiChoiceProps> = ({
  isConventionned,
  onSelectChoice,
  defaultChoice,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<
    'Taxi' | 'Ambulance' | 'tpmr' | 'break' | 'berline' | 'monospace' | 'van'
  >('Taxi');

  const ImageType = useMemo(() => {
    let image = null;

    if (selectedChoice == 'tpmr') {
      image = require('../../assets/tpmr.png');
    } else if (selectedChoice == 'Ambulance') {
      image = require('../../assets/ambulance.png');
    } else if (selectedChoice == 'Taxi') {
      image = require('../../assets/taxi_vsl.png');
    } else if (selectedChoice == 'monospace') {
      image = require('../../assets/van.png');
    } else if (selectedChoice == 'berline') {
      image = require('../../assets/berline_skoda.png');
    } else if (selectedChoice == 'van') {
      image = require('../../assets/van.png');
    } else if (selectedChoice == 'break') {
      image = require('../../assets/berline.png');
    }

    return <Image resizeMode="center" style={{height: 120}} source={image} />;
  }, [selectedChoice, isConventionned]);

  useEffect(() => {
    if (defaultChoice) {
      setSelectedChoice(defaultChoice);
    }
  }, [defaultChoice]);

  const handleTaxiPress = () => {
    setSelectedChoice('Taxi');
    onSelectChoice('Taxi');
  };

  const handleAmbulancePress = () => {
    setSelectedChoice('Ambulance');
    onSelectChoice('Ambulance');
  };

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        {/* <Text style={styles.title}>Vous êtes ?</Text> */}
        {ImageType || undefined}
        {/* {isConventionned ? (
          <Image
            resizeMode="center"
            style={{width: 80, height: 80}}
            source={require('../../assets/ambulance.png')}
          />
        ) : (
          <SvgUri
            width="40"
            height="40"
            source={require('../../assets/icons/taxi_svg.svg')}
          />
        )} */}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {isConventionned ? (
          <>
            <TouchableOpacity
              onPress={handleAmbulancePress}
              style={[
                styles.choiceButton,
                selectedChoice === 'Ambulance' && styles.selectedChoiceButton,
              ]}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Ambulance</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleTaxiPress}
              style={[
                styles.choiceButton,
                selectedChoice === 'Taxi' && styles.selectedChoiceButton,
              ]}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Taxi et VSL</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedChoice('tpmr');
                onSelectChoice('tpmr');
              }}
              style={[
                styles.choiceButton,
                selectedChoice === 'tpmr' && styles.selectedChoiceButton,
              ]}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>TPMR Médical</Text>
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => {
                setSelectedChoice('berline');
                onSelectChoice('berline');
              }}
              style={[
                styles.choiceButton,
                selectedChoice === 'berline' && styles.selectedChoiceButton,
              ]}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Berline</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSelectedChoice('break');
                onSelectChoice('break');
              }}
              style={[
                styles.choiceButton,
                selectedChoice === 'break' && styles.selectedChoiceButton,
              ]}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Break</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedChoice('monospace');
                onSelectChoice('monospace');
              }}
              style={[
                styles.choiceButton,
                selectedChoice === 'monospace' && styles.selectedChoiceButton,
              ]}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Monospace</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedChoice('van');
                onSelectChoice('van');
              }}
              style={[
                styles.choiceButton,
                selectedChoice === 'van' && styles.selectedChoiceButton,
              ]}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Van</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: '600',
    marginVertical: 15,
    textAlign: 'center',
    fontSize: 22,
  },
  container: {
    //flexDirection: 'row',
    /*   alignItems: 'center',
    justifyContent: 'center', */

    gap: 10,
  },
  choiceButton: {
    //flex: 1,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 5,
    padding: 10,

    /*   height: 90, */
  },
  selectedChoiceButton: {
    borderColor: colors.blue,
  },
  buttonContent: {
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ButtonAmbulanceTaxiChoice;
