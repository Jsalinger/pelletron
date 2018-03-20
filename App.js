// @flow

import React from 'react';
import getTheme from './native-base-theme/components';
import { StyleProvider } from "native-base";
import HomeScreen from './src/HomeScreen.js'

type Props = {

}

type State = {

}

export default class App extends React.Component<Props, State> {

  render() {

    return (
      <StyleProvider style={getTheme()}>
        <HomeScreen />
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