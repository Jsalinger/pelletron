// @flow

import React from 'react';
import { AsyncStorage } from 'react-native';
import { Row, Col, Grid, Container, Content, Text, List, ListItem, View, Icon, Header, Left, Button, Body, Right, Title, Input, Item } from "native-base";

type Props = {

}

type State = {
    storedServerValue: string,
    inputServerValue: string,
}

export default class Settings extends React.Component<Props, State> {

    changeServerValue: Function;
    leaveSettings: Function;

    constructor(props: Props) {
        super(props);

        this.state = {
            storedServerValue: '',
            inputServerValue: '',
        }

        this.changeServerValue = this.changeServerValue.bind(this);
        this.leaveSettings = this.leaveSettings.bind(this);
    }

    componentDidMount() {
        AsyncStorage.getItem('serverURL')
            .then((value) => {
                console.log("Got value from storage: " + value);
                this.setState({ storedServerValue: value })
            })
    }

    changeServerValue(text: string) {
        if (text != null && text != "") {
            this.setState({ inputServerValue: text });
        }
    }

    leaveSettings() {
        if (this.state.inputServerValue != null && this.state.inputServerValue != "") {
            AsyncStorage.setItem('serverURL', this.state.inputServerValue);
        }
        this.props.navigation.goBack();
    }

    render() {

        return (

            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.leaveSettings()}>
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Settings</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <Grid>
                        <Row size={25} style={{ backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ margin: 20, fontSize: 30, color: 'white' }}>Stove Server Settings</Text>
                        </Row>
                        <Row size={25} style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ margin: 10, fontSize: 20, color: 'red' }}>Current value: {this.state.storedServerValue}</Text>
                        </Row>
                        <Row size={25} style={{ margin: 10, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                            <Col size={10} />
                            <Col size={80}>
                                <Item regular>
                                    <Input
                                        placeholder='192.168.0.173 (for example)'
                                        value={this.state.inputServerValue}
                                        onChangeText={(text) => this.changeServerValue(text)}
                                    />
                                </Item>
                            </Col>
                            <Col size={10} />
                        </Row>
                        <Row size={25} style={{ backgroundColor: 'green', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ margin: 20, fontSize: 15, color: 'white' }}>If you change the value, just go back to save it.</Text>
                        </Row>
                    </Grid>
                </Content>


            </Container>

        )

    }

}