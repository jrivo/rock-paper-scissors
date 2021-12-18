import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {Button, SafeAreaView, Text, TextInput, View} from 'react-native';
import tailwind from 'tailwind-rn';
import {Login, storeItem} from '../utils/utils';

export default function LoginScreen({navigation}) {
  const [username, setUsername] = React.useState('');
  const [connected, setConnected] = React.useState(false);
  const handleConnection = async username => {
    await AsyncStorage.clear();
    console.log("storage cleared")
    let token = await Login(username);
    storeItem('username', username);
    storeItem('token', token);
    console.log(token)
    setConnected(true);
  };

  useEffect(() => {
    connected ? console.log('connected') : console.log('not connected');
    navigation.navigate('Match');
  }, [connected]);
  return (
    <SafeAreaView>
      <View>
        <Text style={tailwind('font-bold')}>Username</Text>
        <TextInput placeholder="Type here..." onChangeText={setUsername} />
        <Button
          onPress={() => handleConnection(username)}
          title="Login"
          color="#841584"
        />
      </View>
    </SafeAreaView>
  );
}
