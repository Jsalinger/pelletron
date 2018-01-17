// @flow

import React from 'react';
import { StyleSheet, Text, View, Picker, Button } from 'react-native';

type Props = {

}

type State = {
  stoveOn: boolean,
  stoveSwitch: any,
  stoveVisibleOnNetwork: boolean,
}

export default class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      stoveOn: false,
      stoveSwitch: "off",
      stoveVisibleOnNetwork: false,
    }
  }

  componentDidMount() {
    this.checkStoveState();
  }

  changeStoveState(onOrOff: string) {
    let thisApp = this;

    let stoveStatus = (onOrOff == "on" ? 1 : 0);

    return fetch('http://192.168.0.173/digital/0/' + stoveStatus)
      .then((response) => response.json())
      .then((serviceResponseJson) => {
        console.log(serviceResponseJson);
        thisApp.checkStoveState();
      })
      .catch((error) => {
        console.log(error);
        thisApp.checkStoveState();
      });
  }

  checkStoveState() {
    let thisApp = this;

    return fetch('http://192.168.0.173/digital/0')
      .then((response) => response.json())
      .then((serviceResponseJson) => {
        thisApp.setState({
          stoveOn: serviceResponseJson.return_value == 1 ? true : false,
          stoveSwitch: serviceResponseJson.return_value == 1 ? "on" : "off",
          stoveVisibleOnNetwork: true,
        });
      })
      .catch((error) => {
        //Network error, couldn't contact the stove
        console.log(error);
        thisApp.setState({
          stoveVisibleOnNetwork: false,
        })
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Pelletron - Pellet Stove Control</Text>
        <Text>The stove is {this.state.stoveVisibleOnNetwork == true ? "online" : " not visible. Are you on the same network?"}</Text>
        {this.state.stoveVisibleOnNetwork &&
          <View>
            <Picker
              style={{ width: 100 }}
              selectedValue={this.state.stoveSwitch}
              onValueChange={(itemValue, itemIndex) => this.changeStoveState(itemValue)}>
              <Picker.Item label="On" value="on" />
              <Picker.Item label="Off" value="off" />
            </Picker>
            <Text>The Stove is {this.state.stoveOn == true ? "On" : "Not On"}</Text>
          </View>
        }
        {!this.state.stoveVisibleOnNetwork &&
          <Button
            onPress={() => this.checkStoveState()}
            title="Retry Stove Connect"
            color="black"
            accessibilityLabel="Click this button to retry connecting to stove"
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
