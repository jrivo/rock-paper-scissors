import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {Button, SafeAreaView, Text, View} from 'react-native';
import EventSource from 'react-native-sse';
import tailwind from 'tailwind-rn';
import {SERVER_ADDRESS} from '../const/constants';
import {
  fetchMatches,
  getItem,
  getLastTurn,
  joinMatch,
  sendMove,
  subscribeEvents,
} from '../utils/utils';

export default function MatchScreen({navigation}) {
  const [inMatch, setInMatch] = React.useState(false);
  const [activeMatch, setActiveMatch] = React.useState(null);
  const [turn, setTurn] = React.useState(null);

  const askMatch = async () => {
    let match = await joinMatch();
    console.log(match);
    if (match.match == 'You already have a match') {
      match = (await fetchMatches()).filter(
        match => match.winner == undefined,
      )[0];
      console.log('current match joined : ', match);
      setTurn(getLastTurn(match));
      setActiveMatch(match);
    } else {
      setActiveMatch(match);
      setTurn(1);
    }
    // setTurn(1);
    console.log('activeMatch', activeMatch);
  };
  const sendAction = async action => {
    console.log('will post for turn : ' + turn);
    let res = await sendMove(activeMatch._id, turn, action);
    if (res == 'accepted') {
      setTurn(turn + 1);
      let nextTurn = turn + 1;
      setTurn(nextTurn);
    } else {
      console.log('error occured : ', res);
    }
  };

  const navigateHistory = () => {
    navigation.navigate('History');
  };

  const disconnect = () => {
    AsyncStorage.clear();
    navigation.navigate('Login');
  };

  useEffect(() => {
    turn > 3 ? setInMatch(false) : null;
    // if (turn >3){
    //   setInMatch(false);
    // }
  }, [turn]);

  useEffect(() => {
    async function subscribeSSE() {
      let token = await getItem('token');
      const events = new EventSource(
        SERVER_ADDRESS + '/matches/' + activeMatch._id + '/subscribe',
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );
      events.addEventListener('open', e =>
        console.log('Events successfully subscribed'),
      );
      events.addEventListener('message', e => {
        console.log('received message : ', e.data);
      });
    }
    if (activeMatch) {
      subscribeSSE();
    }
  }, [activeMatch]);

  // useEffect(() => {
  //   async function getToken() {
  //     let token = await getItem('token');
  //     // console.log("match token : ", token);
  //     return token
  //   }
  //   let connected = getToken();
  //   console.log(connected)
  //   console.log("test")
  //   if (!connected) {
  //     navigation.navigate('Login');
  //   }
  // }, []);

  useEffect(() => {
    console.log('activeMatch is ', activeMatch);
    activeMatch ? setInMatch(true) : null;
  }, [activeMatch]);

  return (
    <SafeAreaView>
      <View style={tailwind('mx-4')}>
        {inMatch && activeMatch ? (
          <View>
            <Text style={tailwind('font-bold')}>
              {'Match ID : ' + activeMatch._id}
            </Text>
            <Text style={tailwind('font-bold')}>
              {activeMatch.user1.username} VS {activeMatch?.user2?.username}
            </Text>
            <Text>{'Turn : ' + turn}</Text>
            <Text>
              <Button
                onPress={() => sendAction('rock')}
                title="Rock"
                color="#651651"></Button>
              <Button
                onPress={() => sendAction('paper')}
                title="Paper"
                color="#651651"></Button>
              <Button
                onPress={() => sendAction('scissors')}
                title="Scissors"
                color="#651651"></Button>
            </Text>
          </View>
        ) : (
          <View style={tailwind('mt-2')}>
            <Button onPress={askMatch} title="Join Match" color="#841584" />
          </View>
        )}
        <View style={tailwind('mt-2')}>
          <Button onPress={navigateHistory} title="History"></Button>
        </View>
        <View style={tailwind('mt-2')}>
          <Button onPress={disconnect} title="Disconnect"></Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
