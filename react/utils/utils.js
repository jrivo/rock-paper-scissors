import {SERVER_ADDRESS} from '../const/constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Login(username) {
  return axios
    .post(
      SERVER_ADDRESS + '/login',
      {username: username},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then(response => {
      return response.data.token;
    })
    .catch(error => {
      return error;
    });
}

export async function joinMatch() {
  let token = await getItem('token');
  if (!token) {
    console.log('No token');
    return;
  }
  return await axios
    .post(
      SERVER_ADDRESS + '/matches',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      },
    )
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error.response.status === 400) {
        return {
          match: 'You already have a match',
        };
      } else return error;
    });
}

export async function sendMove(matchId, turn, move) {
  let token = await getItem('token');
  if (!token) {
    console.log('No token');
    return;
  }
  return axios
    .post(
      SERVER_ADDRESS + '/matches/' + matchId + '/turns/' + turn,
      {move: move},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      },
    )
    .then(response => {
      console.log(response.data)
      return 'accepted';
    })
    .catch(error => {
      if (error.response.status === 400) {
        return error.response.data.turn;
      }
    });
}

export async function fetchMatches() {
  let token = await getItem('token');
  if (!token) {
    console.log('No token');
    return;
  }
  return axios
    .get(SERVER_ADDRESS + '/matches', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      return error;
    });
}
export function storeItem(key, value) {
  return AsyncStorage.setItem(key, JSON.stringify(value));
}

export function getItem(key) {
  return AsyncStorage.getItem(key).then(value => JSON.parse(value));
}

async function sendRequest(uri, headers, body = null) {
  return fetch(SERVER_ADDRESS + uri, {
    method: 'post',
    headers: headers,
    body: body,
  })
    .then(response => {
      response.json().then(data => {
        return data;
      });
    })
    .catch(error => {
      console.error(error);
    });
}

export function getLastTurn(match) {
  let currentTurn = 1;
  let turns = match.turns;
  for (i = 0; i < 2; i++) {
    let turn = turns[i];
    if (turn) {
      if (turn.user1 && turn.user2) {
        currentTurn = i + 2;
      }
    } else {
      currentTurn = i + 1;
      break;
    }
  }
  return currentTurn;
}

export function subscribeEvents (matchId)
{
  new EventSource(SERVER_ADDRESS + '/matches/' + matchId).onmessage = function(event) {

  }
}
