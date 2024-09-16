import {
  ParamListBase,
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { Icon } from 'native-base';
import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useState
} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useQueryClient } from 'react-query';
import { useApi } from '../../hook/useApi';
import { colors } from '../../theme/colors';
import { ContactTypes } from '../../types/ContactTypes';

type ChildProps = {};
const ChatScreen: FC<ChildProps> = ({}): ReactElement => {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamListBase>>();
  const {data}: {data: ContactTypes} = route.params || {};
  const isFocused = useIsFocused();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  const [idDiscussion, setIdDiscussion] = useState();
  const [lastDate, setLastDate] = useState();
  const [lastId, setLastId] = useState();
  const BG_CHAT = require('../../assets/bg/chat_bg.jpg');
  const queryClient = useQueryClient();
  const [discussionIdState, setDiscussionIdState] = useState(null);

  const {API} = useApi();

  /* useEffect(() => {
    const unsubscribe = userRef.onSnapshot(doc => {
      if (doc?.exists) {
        let userConnected = doc.data();
        setCurrentUser({...userConnected, user});
      } else {
      }
    });
  }, [user]); */

  React.useLayoutEffect(() => {
    const parent = navigation.getParent();
    navigation.setOptions({
      tabBarHideOnKeyboard: true,
      tabBarStyle: {display: 'none'},
      //headerTitle: `Ecrire à ${animal?.user?.firstname} pour  ${animal?.animal?.name}`,
      headerTitle: `${'animal?.animal?.name'} `,
      /*  headerRight: () => (
        <FastImage
          source={{uri: animal?.animal?.photo}}
          style={{width: 80, height: 80, marginRight: 10, borderRadius: 40}}
        />
      ), */
      tabBarHideOnKeyboard: true,
      tabBarStyle: {display: 'none'},
    });
  }, [navigation, isFocused]);

  const fetchMessageInDiscussion = async () => {
    try {
      setLoading(true);
      const result = await API.fetchMessageDiscussion({
        user: data?.id,
        discussionId: data?.discussion?.id,
      });
      if (result?.data?.response) {
        return result?.data?.data;
      }
    } catch (error) {
      console.log(' *** error read user ***', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const result = await API.fetchMessageDiscussion({
        user: data?.id,
        discussionId: discussionIdState,
      });

      if (result?.data?.response) {
        const m = result?.data?.data.map(msg => {
          var _msg = {...msg};
          _msg._id = msg.created;
          _msg.createdAt = msg.created;
          _msg.text = msg?.msg;
          _msg.user = {_id: msg?.isMine ? 1 : 2};
          const data = {
            ..._msg,
            //user: { _id: 2 },
          };
          return data;
        });
        setMessages(m.reverse());
      }
    } catch (error) {
      console.log(' *** error read user ***', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (discussionIdState) {
      const timer = setInterval(() => {
        fetchDiscussions();
      }, 2000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [discussionIdState]);

  const {
    data: allMessages,
    refetch: refetch,
    isRefetching: refetchLoading,
    isLoading,
  } = useQuery('fetchMessageInDiscussions', fetchMessageInDiscussion);

  useEffect(() => {
    if (allMessages?.length > 0) {
      if (allMessages?.[0]?.discussion) {
        setIdDiscussion(allMessages?.[0]?.discussion);
      }
      if (allMessages?.[0]?.created) {
        setLastDate(allMessages?.[0]?.created);
      }
      if (allMessages?.[0]?.id) {
        setLastId(allMessages?.[0]?.id);
      }
      const m = allMessages.map(msg => {
        var _msg = {...msg};
        _msg._id = msg.created;
        _msg.createdAt = msg.created;
        _msg.text = msg?.msg;
        _msg.user = {_id: msg?.isMine ? 1 : 2};
        const data = {
          ..._msg,
          //user: { _id: 2 },
        };
        return data;
      });
      setMessages(m.reverse());

      const timer = setInterval(() => {
        fetchDiscussions();
      }, 2000);
      return () => {
        clearInterval(timer); // Effacez le minuteur lorsque le composant est démonté
      };
    }
  }, [data, allMessages]);

  const onSend = useCallback(
    async (newMessages = []) => {
      const message = newMessages[0];

      const obj = {user: data.id, message: message?.text};
      const text = message.text;

      API.sendMessage(obj)
        .then(res => {
          if (res?.data?.response && res?.data !== null) {
            console.log(
              ' *** res?.data?.data?.discussion ***',
              res?.data?.data?.discussion,
            );
            setDiscussionIdState(res?.data?.data?.discussion);
            setLastId(res?.data?.data?.id);
          }
        })
        .catch(error => {
          console.log(' *** error send message ***', error);
        });
      console.log(' *** data ***', JSON.stringify(obj, null, 2));
    },
    [currentUser, data, messages],
  );

  /*   const onSend = useCallback((messages = []) => {
    console.log(' ***  ***', JSON.stringify(messages, null, 2));
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []); */

  /*  if (loading) {
    return (
      <View style={{}}>
        <ActivityIndicator />
      </View>
    );
  } */
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return <ActivityIndicator size="large" color={colors.blue} />;
  }

  const renderInputToolbar = props => {
    return (
      <>
        <View style={{height: 42, backgroundColor: '#DDDDDD'}}>
          {/* Element */}
        </View>
        <InputToolbar
          {...props}
          containerStyle={{backgroundColor: '#e2e2e2'}}
        />
      </>
    );
  };

  return (
    <ImageBackground style={styles.container} source={BG_CHAT}>
      {console.log(' ***  ***',JSON.stringify(data,null,2))}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          navigation.goBack();
        }}
        style={{paddingVertical:10, width:"100%", backgroundColor:colors.gray, alignItems:"center",justifyContent:"center" }}>
        <Text style={{fontSize:16, fontWeight:"600"}} >{data?.raison_social}</Text>
        <Text style={{fontSize:12, fontWeight:"600"}} >{data?.status}</Text>
        <Text style={{fontSize:14, fontWeight:"600"}} >Voir tout les contacts</Text>
      </TouchableOpacity>
      <GiftedChat
        isAnimated
        renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
        messages={messages}
        onSend={messages => onSend(messages)}
        alwaysShowSend
        renderSend={props => {
          return (
            <Send {...props}>
              <View
                style={{
                  marginRight: 10,
                  marginBottom: 5,
                  backgroundColor: colors.blue,
                  padding: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                }}>
                <Text style={{fontWeight: '600'}}>Envoyer</Text>
              </View>
            </Send>
          );
        }}
        renderTime={() => null}
        isLoadingEarlier={true}
        renderInputToolbar={renderInputToolbar}
        user={{
          _id: 1,
        }}
        bottomOffset={insets.bottom}
      />
    </ImageBackground>
  );
};

ChatScreen.propTypes = {};
ChatScreen.defaultProps = {};
export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
