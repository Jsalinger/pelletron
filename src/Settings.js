// @flow

import React from 'react';
import { AsyncStorage } from 'react-native';
import { Container, Content, Text, List, ListItem, View, Icon, Header, Left, Button, Body, Right, Title, Input, Item } from "native-base";

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
                <View>
                    <Text>Change your stove URL below, if needed.</Text>
                    <Text>Current stove URL value: {this.state.storedServerValue}</Text>
                </View>
                <Content>
                    <Item regular>
                        <Input
                            placeholder='192.168.0.173 (for example)'
                            value={this.state.inputServerValue}
                            onChangeText={(text) => this.changeServerValue(text)}
                        />
                    </Item>
                </Content>


            </Container>

        )

    }

}