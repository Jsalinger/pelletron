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

type Props = {
    navigation: any,
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

export default class HomeScreen extends React.Component<Props, State> {

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
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.navigate("DrawerOpen")}>
                            <Icon name="menu" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Pelletron</Title>
                    </Body>
                    <Right />
                </Header>

                <Grid>
                    <Row size={20}>
                        <Col style={{ backgroundColor: 'black' }}>
                            <Row size={33} style={{ backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 30, color: 'white' }}>Temp</Text>
                            </Row>
                            <Row size={66} style={{ alignItems: 'center', justifyContent: 'space-around' }} >
                                <View size={25}>
                                    <Icon style={{ fontSize: 45, color: 'white' }} name="ios-thermometer-outline" />
                                </View>
                                <View size={75}>
                                    <Text style={{ fontSize: 60, color: 'white' }}>{this.state.temperature}&deg;</Text>
                                </View>
                            </Row>
                        </Col>
                        <Col style={{ backgroundColor: 'white' }}>
                            <Row size={33} style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 30, color: 'black' }}>Humidity</Text>
                            </Row>
                            <Row size={66} style={{ alignItems: 'center', justifyContent: 'space-around' }} >
                                <View size={25}>
                                    <Icon style={{ fontSize: 45 }} name="ios-rainy-outline" />
                                </View>
                                <View size={75}>
                                    <Text style={{ fontSize: 60 }}>{this.state.humidity}%</Text>
                                </View>
                            </Row>
                        </Col>
                    </Row>
                    <Row size={20}>
                        <Col style={{ backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center' }}>
                            <Icon ios='ios-flame' android="ios-flame" style={{ fontSize: 100, color: stoveIconColor }} />
                        </Col>
                    </Row>
                    <Row size={5}>
                        <Col style={{ backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 35, color: stoveIconColor }}>{stoveStatusMessage}</Text>
                            {/* <Text>{this.state.lastNetworkMessage}</Text> */}
                        </Col>
                    </Row>
                    <Row size={15} style={{ backgroundColor: 'gray', alignItems: 'center', justifyContent: 'space-around' }}>

                        <View>
                            <Button iconLeft danger rounded onPress={() => this.flipStoveState()} color="#841584" title="Flip">
                                <Icon ios="ios-power" android="ios-power" />
                                <Text>Flip Stove Switch</Text>
                            </Button>
                        </View>
                        <View>
                            <Button iconLeft dark rounded onPress={() => this.checkAllModuleInfo()} color="#841584" title="Refresh">
                                <Icon ios="ios-refresh" android="ios-refresh" />
                                <Text>Refresh</Text>
                            </Button>
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
        )
    }

}