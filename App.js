// @flow

import React from 'react';
import {
  H1,
  H2,
  H3,
  Grid,
  Row,
  Col,
  Container,
  Header,
  Footer,
  Title,
  Left,
  Icon,
  Right,
  Button,
  Body,
  Content,
  Text,
  Card,
  CardItem,
  StyleProvider
}
  from "native-base";

import getTheme from './native-base-theme/components';

type Props = {

}

type State = {
  stoveOn: boolean,
  stoveSwitch: any,
  stoveVisibleOnNetwork: boolean,
  moduleStatus: any,
  stoveURL: string,
  lastNetworkMessage: string
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
      lastNetworkMessage: "",
    }

    this.handleTextInput = this.handleTextInput.bind(this);
  }

  componentDidMount() {
    this.checkAllModuleInfo();
  }

  callStove(path: string): Promise<any> {

    let timeoutMs = 3000;
    let fullURL = 'http://' + this.state.stoveURL + '/' + path;
    let completed = false;
    let response = "";

    return new Promise((resolve, reject) => {

      setTimeout(function () {
        if (!completed) {
          completed = true;
          response = "Network Timeout in: " + timeoutMs + "ms";
          this.setState({ lastNetworkMessage: response });
          reject(response)
        }
      }, timeoutMs)

      fetch(fullURL)
        .then((response) => response.json())
        .then((serviceResponseJson) => {
          if (!completed) {
            completed = true;
            response = serviceResponseJson;
            this.setState({ lastNetworkMessage: JSON.stringify(response) });
            resolve(response);
          }
        })
        .catch((error) => {
          if (!completed) {
            completed = true;
            response = "Error during fetch: " + error;
            this.setState({ lastNetworkMessage: response });
            reject(response);
          }
        })
    })
  }

  changeStoveState(onOrOff: string) {
    let thisApp = this;

    let stoveStatus = (onOrOff == "on" ? 1 : 0);

    this.callStove("digital/0/" + stoveStatus).then((serviceResponseJson) => {
      thisApp.checkStoveState();
    })
      .catch((error) => {
        thisApp.checkStoveState();
      })
  }

  checkStoveState() {
    let thisApp = this;

    this.callStove("digital/0").then((serviceResponseJson) => {
      thisApp.setState({
        stoveOn: serviceResponseJson.return_value == 1 ? true : false,
        stoveSwitch: serviceResponseJson.return_value == 1 ? "on" : "off",
        stoveVisibleOnNetwork: true,
      });
    })
      .catch((error) => {
        thisApp.setState({
          stoveVisibleOnNetwork: false,
        })
      })
  }

  updateModuleStatus() {
    let thisApp = this;

    this.callStove("").then((serviceResponseJson) => {
      thisApp.setState({
        moduleStatus: serviceResponseJson,
      });
    })
      .catch((error) => {
        thisApp.setState({
          stoveVisibleOnNetwork: false,
          stoveOn: false,
          stoveSwitch: "off",
          moduleStatus: {},
        })
      })
  }

  handleTextInput(event: any) {
    this.setState({
      stoveURL: event,
    })
  }

  checkAllModuleInfo() {
    this.checkStoveState();
    this.updateModuleStatus();
  }

  render() {
    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Header>
            <Left>
              <Button transparent>
                <Icon name="menu" />
              </Button>
            </Left>
            <Body>
              <Title>Pelletron</Title>
            </Body>
            <Right />
          </Header>

            <Grid>
              <Row size={25}>
                <Col style={{ backgroundColor: '#4659bf', alignItems: 'center' }}>
                  <Row size={1} style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 30}}>Temperature</Text>
                  </Row>
                  <Row size={2}>
                    <Text style={{ fontSize: 50 }}>72&deg;</Text>
                  </Row>
                </Col>
                <Col style={{ backgroundColor: '#5364c3', alignItems: 'center' }}>
                  <Row size={1} style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 30 }}>Humidity</Text>
                  </Row>
                  <Row size={2}>
                    <Text style={{ fontSize: 50 }}>33%</Text>
                  </Row>
                </Col>
              </Row>
              <Row size={25}>
                <Col style={{ backgroundColor: '#5f6fc7', justifyContent: 'center', alignItems: 'center' }}>
                  <Icon ios='ios-menu' android="ios-flame" style={{fontSize: 100, color: '#d11b1b'}}/>
                </Col>
              </Row>
              <Row size={20}>
                <Col style={{ backgroundColor: '#36469c', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 35, color: 'white' }}>Stove Online</Text>
                </Col>
              </Row>
              <Row size={30}>
                <Col style={{ backgroundColor: '#929dd9', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 70 }}>ON</Text>
                </Col>
                <Col style={{ backgroundColor: '#b8bfe6', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 70 }}>OFF</Text>
                </Col>
              </Row>
            </Grid>


          {/*
        <View>
          <Text>Pelletron - Pellet Stove Control</Text>
          <View>
            <TextInput
              placeholder="192.168.0.173"
              placeholderTextColor="#9fa4ad"
              label="Server URL:"
              onChangeText={this.handleTextInput}
              value={this.state.stoveURL}
              underlineColorAndroid='transparent' />
            <View>
              <Button
                onPress={() => this.checkAllModuleInfo()}
                title="Set Server"
                color="black"
                accessibilityLabel="Click this button to set the server"
              />
            </View>
          </View>
          <Text>The stove is {this.state.stoveVisibleOnNetwork == true ? "online" : " not visible at the server URL."}</Text>
          {this.state.stoveVisibleOnNetwork &&
            <View>
              <Picker
                selectedValue={this.state.stoveSwitch}
                onValueChange={(itemValue, itemIndex) => this.changeStoveState(itemValue)}>
                <Picker.Item label="On" value="on" />
                <Picker.Item label="Off" value="off" />
              </Picker>
            </View>
          }
          {!this.state.stoveVisibleOnNetwork &&
            <View>
              <Button
                onPress={() => this.checkAllModuleInfo()}
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
            <Text>Last network message: {this.state.lastNetworkMessage}</Text>
          </View>

        </View>
*/}

        </Container>
      </StyleProvider>
    );
  }
}

/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
*/