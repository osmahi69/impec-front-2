import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { useApi } from '../../hook/useApi';
import { ActivityIndicator, Text } from 'react-native';

const AboutPage = () => {

const [htmlContent, setHtmlcontent] = useState(null)
const [loading, setLoading] = useState(false)
  const {API} = useApi()
  useEffect(() =>{
    load()
  },[])

  const load = async () =>{
    setLoading(true)
    try {
        const res = await API.texte({typedoc : "APROPOS"});
         setHtmlcontent({ html: res?.data?.data })
    } catch (error) {
      setHtmlcontent({uri:"https://www.im-pec.fr/conditions-generales-de-vente/"})
    } finally{
      setLoading(false)
    }
  }

  if(loading){
    return <><ActivityIndicator /></>
  }

  return (
    <WebView
    source={htmlContent}
    style={{ flex: 1 }} // Ajustez le style en fonction de vos besoins
    />
  );
}

export default AboutPage;
