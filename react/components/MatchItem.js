import React from 'react';
import {View, Text} from 'react-native';
import tailwind from 'tailwind-rn';
import {useEffect} from 'react/cjs/react.development';

function MatchItem({match, username}) {
  const [bgStyle, setBgStyle] = React.useState('');
  const [status, setStatus] = React.useState('');
  useEffect(() => {
      console.log("match : ", match);
    switch (match.winner) {
      case undefined:
        setBgStyle('bg-gray-300');
        setStatus('Pending');
        break;
      default:
        if (match?.winner?.username == username) {
          setBgStyle('bg-green-300');
          setStatus('Win');
        } else {
          setBgStyle('bg-red-300');
          setStatus('Lose');
        }
    }
  }, []);
  return (
    <View style={tailwind('my-2 border border-gray-800 ' + bgStyle)}>
      <View style={tailwind('bg-gray-400')}>
        <Text>{'Match ID : ' + match._id}</Text>
      </View>
      <View>
        <Text style={tailwind('text-black font-bold')}>
          {match.user1?.username} VS {match.user2?.username}
        </Text>
      </View>
      <View>
        <Text style={tailwind('text-black font-bold')}>
          {'Status : ' + status}
        </Text>
      </View>
    </View>
  );
}

export default MatchItem;
