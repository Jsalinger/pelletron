// @flow

import React from 'react';
import { Container, Content, Text, List, ListItem, View, Icon, Header, Left, Button, Body, Right, Title } from "native-base";

type Props = {

}

type State = {

}

export default class Settings extends React.Component<Props, State> {

    render() {

        return (

            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
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
                </View>
            </Container>

        )

    }

}