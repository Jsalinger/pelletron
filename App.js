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
  StyleProvider,
  View
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
  lastNetworkMessage: string,
  temperature: string,
  humidity: string
}

export default class App extends React.Component<Props, State> {

  handleTextInput: Function;
  // handleStoveClick: Function;

  constructor(props: Props) {
    super(props);

    this.state = {
      stoveOn: false,
      stoveSwitch: "off",
      stoveVisibleOnNetwork: false,
      moduleStatus: {},
      stoveURL: "192.168.0.173",
      lastNetworkMessage: "None",
      temperature: "?",
      humidity: "?"
    }

    this.handleTextInput = this.handleTextInput.bind(this);
    // this.handleStoveClick = this.handleStoveClick.bind(this);
  }

  componentDidMount() {
    this.checkAllModuleInfo();
  }

  callStove(path: string): Promise<any> {

    let thisApp = this;
    let fullURL = 'http://' + this.state.stoveURL + '/' + path;
    let completed = false;
    let response = "";

    return new Promise((resolve, reject) => {

      fetch(fullURL)
        .then((response) => response.json())
        .then((serviceResponseJson) => {
          thisApp.setState({ lastNetworkMessage: JSON.stringify(serviceResponseJson) });
          resolve(serviceResponseJson);
        })
        .catch((error) => {
          thisApp.setState({ lastNetworkMessage: error });
          reject(error);
        })
    })
  }

  // handleStoveClick(event: any) {

  //   //TODO: read the actual event
  //   console.log("Clicked the button");
  //   console.log(event);

  //   if (this.state.stoveOn) {
  //     this.changeStoveState("off");
  //   }
  //   else {
  //     this.changeStoveState("on");
  //   }
  // }

  flipStoveState() {
    let thisApp = this;

    // let stoveStatus = (onOrOff == "on" ? 1 : 0);

    // this.callStove("digital/0/" + stoveStatus)
    //   .then((serviceResponseJson) => {
    //     console.log("Changed stove state.");
    //     thisApp.checkStoveState();
    //   })
    //   .catch((error) => {
    //     console.log("Failed to change stove status.");
    //     thisApp.checkStoveState();
    //   })

    thisApp.callStove("flip")
      .then((serviceResponseJson) => {
        console.log("Changed stove state.");
        thisApp.checkAllModuleInfo();
      })
      .catch((error) => {
        console.log("Failed to change stove status.");
        thisApp.checkAllModuleInfo();
      })

  }

  checkStoveState() {
    let thisApp = this;

    this.callStove("digital/0")
      .then((serviceResponseJson) => {
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

    this.callStove("")
      .then((serviceResponseJson) => {
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

  checkStoveTemperature() {
    let thisApp = this;

    this.callStove("temperature")
      .then((serviceResponseJson) => {
        let temp = serviceResponseJson.return_value;

        if (temp < 200) {
          thisApp.setState({
            temperature: temp,
          });
        }
        else {
          thisApp.setState({
            temperature: "-"
          })
        }
      })
      .catch((error) => {
        thisApp.setState({
          temperature: "?"
        })
      })
  }

  checkStoveHumidity() {
    let thisApp = this;

    this.callStove("humidity")
      .then((serviceResponseJson) => {
        let humidity = serviceResponseJson.return_value;

        if (humidity < 200) {
          thisApp.setState({
            humidity: humidity,
          });
        }
        else {
          thisApp.setState({
            humidity: "-",
          });
        }
      })
      .catch((error) => {
        thisApp.setState({
          temperature: "?"
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
    this.checkStoveTemperature();
    this.checkStoveHumidity();
  }

  render() {

    let stoveStatusMessage = "Stove status unknown";
    this.state.stoveOn ? stoveStatusMessage = "Stove is ON" : stoveStatusMessage = "Stove is OFF";

    let stoveIconColor = "#fff";
    this.state.stoveOn ? stoveIconColor = 'red' : stoveIconColor = "#fff";

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
                  <Text style={{ fontSize: 30 }}>Temperature</Text>
                </Row>
                <Row size={2}>
                  <Text style={{ fontSize: 50 }}>{this.state.temperature}&deg;</Text>
                </Row>
              </Col>
              <Col style={{ backgroundColor: '#5364c3', alignItems: 'center' }}>
                <Row size={1} style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 30 }}>Humidity</Text>
                </Row>
                <Row size={2}>
                  <Text style={{ fontSize: 50 }}>{this.state.humidity}%</Text>
                </Row>
              </Col>
            </Row>
            <Row size={25}>
              <Col style={{ backgroundColor: '#5f6fc7', justifyContent: 'center', alignItems: 'center' }}>
                <Icon ios='ios-flame' android="ios-flame" style={{ fontSize: 100, color: stoveIconColor }} />
              </Col>
            </Row>
            <Row size={20}>
              <Col style={{ backgroundColor: '#36469c', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 35, color: stoveIconColor }}>{stoveStatusMessage}</Text>
                {/* <Text>{this.state.lastNetworkMessage}</Text> */}
              </Col>
            </Row>
            <Row size={30} style={{ backgroundColor: '#b8bfe6', alignItems: 'center', alignContent: 'center', justifyContent: 'space-around'}}>
                  
              <View>      
                <Button onPress={() => this.flipStoveState()} color="#841584" title="Flip"><Text>Flip Stove Switch</Text></Button>
              </View>
              <View>
                <Button onPress={() => this.checkAllModuleInfo()} color="#841584" title="Refresh"><Text>Refresh</Text></Button>
              </View>

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