import React, { Component } from 'react';
import {
  Platform,
  AsyncStorage,
  StyleSheet,
  Text,
  Button,
  View
} from 'react-native';
import Auth0 from 'react-native-auth0';
const auth0 = new Auth0({ domain: 'mi-app.auth0.com', clientId: 'A-fquBjOMtFufUM6ME9QBatyjn1ap6mk' });

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
  constructor(props) {
    super(props);

    this.state = {
      token: null,
      checkedSignIn: false
    };
  }

  componentWillMount() {
    this._isSignedIn()
      .then(res => {
        this.setState({ token: res, checkedSignIn: true })
      })
      .catch(err => alert("An error occurred"));
  }

  _onLogin = () => {
    auth0
        .webAuth
        .authorize({scope: 'openid email', audience: 'https://mi-app.auth0.com/userinfo'})
        .then(credentials => {
          AsyncStorage.setItem('TOKEN', credentials.accessToken);
          this.setState({ token: credentials.accessToken })
        })
        .catch(error => alert(JSON.stringify(error)));
  };

  _onLogout = () => {
    if (Platform.OS === 'android') {
      AsyncStorage.removeItem('TOKEN');
      this.setState({ token: null })
    } else {
      auth0.webAuth
        .clearSession({})
        .then(success => {
          AsyncStorage.removeItem('TOKEN');
          this.setState({ token: null })
        })
        .catch(error => console.log(error));
    }
  };

  _isSignedIn = async () => {
    try {
      const value = await AsyncStorage.getItem('TOKEN');
      return value
    } catch (error) {
      alert('Error fetching token')
    }
  };

  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
        <Text>
          You are {this.state.token ? '' : 'not '}logged in.
        </Text>
        <Button
          onPress={this.state.token ? this._onLogout : this._onLogin}
          title={this.state.token ? 'Log Out' : 'Log In'}
        />
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
