// @flow

import React from 'react';
import { StyleSheet, Text, TextInput, View, Picker, Button } from 'react-native';

type Props = {

}

type State = {
  stoveOn: boolean,
  stoveSwitch: any,
  stoveVisibleOnNetwork: boolean,
  moduleStatus: any,
  stoveURL: string,
}

export default class App extends React.Component<Props, State> {

  handleTextInput: Function;

  constructor(props: Props) {
    super(props);

    this.state = {
      stoveOn: false,
      stoveSwitch: "off",
      stoveVisibleOnNetwork: false,
      moduleStatus: {},
      stoveURL: "192.168.0.173",
    }

    this.handleTextInput = this.handleTextInput.bind(this);
  }

  componentDidMount() {
    this.checkStoveState();
    this.updateModuleStatus();
  }

  changeStoveState(onOrOff: string) {
    let thisApp = this;

    let stoveStatus = (onOrOff == "on" ? 1 : 0);

    //TODO: Need to wrap whole thing with try/catch and all other fetches
    return fetch('http://' + this.state.stoveURL + '/digital/0/' + stoveStatus)
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

    return fetch('http://' + this.state.stoveURL + '/digital/0')
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

  updateModuleStatus() {
    let thisApp = this;

    return fetch('http://' + this.state.stoveURL)
      .then((response) => response.json())
      .then((serviceResponseJson) => {
        thisApp.setState({
          moduleStatus: serviceResponseJson,
        });
      })
      .catch((error) => {
        //Network error, couldn't contact the stove
        console.log(error);
        thisApp.setState({
          stoveVisibleOnNetwork: false,
          stoveOn: false,
          stoveSwitch: "off",
          moduleStatus: {},
        })
      })
  }

  setServer() {
    this.checkStoveState();
    this.updateModuleStatus();
  }

  handleTextInput(event: any) {
    this.setState({
      stoveURL: event,
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Pelletron - Pellet Stove Control</Text>
        <View>
          <TextInput
            style={styles.input}
            placeholder="192.168.0.173"
            placeholderTextColor="#9fa4ad"
            label="Server URL:"
            onChangeText={this.handleTextInput}
            value={this.state.stoveURL} />
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => this.setServer()}
              title="Set Server"
              color="black"
              accessibilityLabel="Click this button to set the server"
            />
          </View>
        </View>
        <Text>The stove is {this.state.stoveVisibleOnNetwork == true ? "online" : " not visible at the server URL."}</Text>
        {this.state.stoveVisibleOnNetwork &&
          <View style={{ height: 75, width: 150 }}>
            <Picker
              itemStyle={{ height: 75 }}
              selectedValue={this.state.stoveSwitch}
              onValueChange={(itemValue, itemIndex) => this.changeStoveState(itemValue)}>
              <Picker.Item label="On" value="on" />
              <Picker.Item label="Off" value="off" />
            </Picker>
          </View>
        }
        {!this.state.stoveVisibleOnNetwork &&
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => this.checkStoveState()}
              title="Retry Stove Connect"
              color="black"
              accessibilityLabel="Click this button to retry connecting to stove"
            />
          </View>
        }
        <View>
          <Text>The Stove is {this.state.stoveOn == true ? "On" : "Not On"}</Text>
          <Text>ID: {this.state.moduleStatus.id}</Text>
          <Text>Name: {this.state.moduleStatus.name}</Text>
          <Text>Hardware: {this.state.moduleStatus.hardware}</Text>
          <Text>Module connected: {"" + this.state.moduleStatus.connected}</Text>
          <Text>Current server URL:</Text>
          <Text>{this.state.stoveURL}</Text>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50
  },
  input: {
    margin: 15,
    padding: 10,
    height: 40,
    width: 150,
    borderColor: '#2853a0',
    borderWidth: 1
  },
  buttonContainer: {
    backgroundColor: '#2E9298',
    borderRadius: 10,
    padding: 5,
    margin: 15,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 10,
    shadowOpacity: 0.25
  }
});
