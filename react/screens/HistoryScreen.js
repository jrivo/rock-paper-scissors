import React, {useEffect} from 'react';
import {SafeAreaView, View,Text} from 'react-native';
import MatchItem from '../components/MatchItem';
import {fetchMatches, getItem} from '../utils/utils';

export default function HistoryScreen() {
  const [matches, setMatches] = React.useState([]);
  const [username, setUsername] = React.useState('');

  useEffect(async() => {
    let user = await getItem('username');
    let data = await fetchMatches();
    setUsername(user);
    setMatches(data);
  }, []);
  return (
    <SafeAreaView>
      <View>
        {matches[0] ? matches.map(match => (
          <View key={match._id}>
            <MatchItem match={match} username={username} />
          </View>
        )) : <Text>Loading matches</Text>}
      </View>
    </SafeAreaView>
  );
}
