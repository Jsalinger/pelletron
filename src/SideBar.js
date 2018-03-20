// @flow

import React from 'react';
import { AppRegistry, Image, StatusBar } from "react-native";
import { Container, Content, Text, List, ListItem, View, Icon } from "native-base";

const routes = ["Home", "Settings"];

type Props = {

}

type State = {

}

export default class SideBar extends React.Component<Props, State> {

    render() {
        return (
            <Container>
                <Content>
                    <View style={{
                            height: 120,
                            width: "100%",
                            alignSelf: "stretch",
                            position: "absolute",
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: "black"
                        }}
                    >
                        <Icon ios='ios-flame' android="ios-flame" style={{ fontSize: 70, color: 'red' }} />
                    </View>

                    <List
                        dataArray={routes}
                        contentContainerStyle={{ marginTop: 120 }}
                        renderRow={data => {
                            return (
                                <ListItem button onPress={() => this.props.navigation.navigate(data)}>
                                    <Text>{data}</Text>
                                </ListItem>
                            );
                        }}
                    />
                </Content>
            </Container>
        );
    }

}