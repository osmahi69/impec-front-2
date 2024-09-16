import React from 'react';
import {Platform} from 'react-native';
//import {ActionSheet} from 'react-native-cross-actionsheet';
import BottomSheet from 'react-native-bottomsheet';

const ActionSheet = {
  options: {},
};
const BottomSheetAction = opts => {
  var optsTitle = [];
  for (var i = 0; i < opts.length; i++) {
    var obj = opts[i].title;
    optsTitle.push(obj);
  }
  optsTitle.push('Annuler');
  BottomSheet.showBottomSheetWithOptions(
    {
      options: optsTitle,
      title: 'Choissisez une action',
      dark: false,
      cancelButtonIndex: 3,
    },
    value => {
      for (var i = 0; i < opts.length; i++) {
        switch (value) {
          case i:
            opts[i].callback();
            break;
          default:
            break;
        }
      }
      //alert(value);
    },
  );

  return;
  var itemList = [];
  if (Platform.OS === 'ios') {
    for (var i = 0; i < opts.length; i++) {
      var obj = {
        text: opts[i].title,
        onPress: opts[i].callback,
        destructive: opts[i].destructive,
      };
      itemList.push(obj);
    }

    ActionSheet.options({
      options: itemList,
      cancel: {text: 'Annuler', onPress: () => console.log('cancel')},
      title: 'Choisir une action',
      destructive: true,
      //tintColor: "red",
      // anchor : 2
    });
  } else {
    var optsTitle = [];
    for (var i = 0; i < opts.length; i++) {
      var obj = opts[i].title;
      optsTitle.push(obj);
    }
    optsTitle.push('Annuler');
    BottomSheet.showBottomSheetWithOptions(
      {
        options: optsTitle,
        title: 'Choissisez une action',
        dark: false,
        cancelButtonIndex: 3,
      },
      value => {
        for (var i = 0; i < opts.length; i++) {
          switch (value) {
            case i:
              opts[i].callback();
              break;
            default:
              break;
          }
        }
        //alert(value);
      },
    );
  }
};

export {BottomSheetAction};
