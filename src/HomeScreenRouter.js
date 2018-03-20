import React, { Component } from "react";
import HomeScreen from './HomeScreen.js'
import Settings from "./Settings.js";
import SideBar from "./SideBar.js";
import { DrawerNavigator } from "react-navigation";

const HomeScreenRouter = DrawerNavigator(
    {
      Home: { screen: HomeScreen },
      Settings: { screen: Settings }
    },
    {
      contentComponent: props => <SideBar {...props} />
    }
  );

export default HomeScreenRouter;