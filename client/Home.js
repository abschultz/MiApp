import React, { Component } from 'react';
import { ActivityIndicator, ListView, Text, View } from 'react-native';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    return fetch('https://yijzrt7nu7.execute-api.us-east-1.amazonaws.com/dev/users')
      .then((response) => response.json())
      .then((responseJson) => {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson.users),
        }, function() {
          // do something with new state
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={{flex: 1, paddingTop: 20}}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <Text>{rowData.fullname}, {rowData.email}</Text>}
        />
      </View>
    );
  }
}


// import React from 'react';
// import { View, Text } from 'react-native';
//
// const url = 'https://yijzrt7nu7.execute-api.us-east-1.amazonaws.com'
//
// async function getUsersFromApi() {
//   try {
//     let response = await fetch(url + '/dev/users');
//     let responseJson = await response.json();
//     return responseJson.users[0].fullname;
//   } catch(error) {
//     console.error(error);
//   }
// }
//
// const test = () => {
//   return <Text>Home Screen! {getUsersFromApi()}</Text>
//
// }
//
// export default HomeScreen = () => (
//   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//     {test()}
//   </View>
// );
