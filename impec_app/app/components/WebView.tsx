import React, {useEffect, useState} from 'react';
import {WebView} from 'react-native-webview';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface MyWebViewParams {
  title: string;
  url: string;
  callback: (event: string) => void;
}

export type MyWebViewParamList = ParamListBase & {
  MyWebView: MyWebViewParams;
};
interface Props {
  route: RouteProp<MyWebViewParamList, 'MyWebView'>;
}

const MyWebView: React.FC<Props> = ({route}) => {
  const {title, url, callback, disableBack} = route.params;
  const [currentUrl, setCurrentUrl] = useState(url);
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const insets = useSafeAreaInsets();

  /* useEffect(() => {
    if (disableBack)
      navigation.setOptions({
        headerShown: false,
      });
  }, [disableBack]);
*/
  const handleNavigationStateChange = (navState: any) => {
    if (navState.url.includes('https://billing.im-pec.fr/paiement/success')) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Accueil'}],
      });
    }
  };

  return (
    <WebView
      style={{marginTop: insets.top}}
      source={{uri: url}}
      onNavigationStateChange={handleNavigationStateChange}
    />
  );
};

export default MyWebView;
