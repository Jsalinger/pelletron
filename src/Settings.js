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
        try {
            AsyncStorage.getItem('serverURL')
                .then((value) => { 
                    console.log("Got value from storage: " + value);
                    this.setState({ storedServerValue: value })
                })
        } 
        catch (error) {
            console.error(error);
            // Error retrieving data
        }
    }

    changeServerValue(text: string) {
        this.setState({ inputServerValue: text });
    }

    leaveSettings() {
        AsyncStorage.setItem('serverURL', this.state.inputServerValue);
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
                    <Text>Please set your stove URL.</Text>
                    <Text>Current stored value: {this.state.storedServerValue}</Text>
                    <Text>Current input value: {this.state.inputServerValue}</Text>
                </View>
                <Content>
                    <Item regular>
                        <Input
                            placeholder='No value'
                            value={this.state.inputServerValue}
                            onChangeText={(text) => this.changeServerValue(text)}
                        />
                    </Item>
                </Content>


            </Container>

        )

    }

}