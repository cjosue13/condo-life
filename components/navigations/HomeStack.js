import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Home from '../../views/Home';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        options={{
          title: 'Inicio',
          headerTitleAlign:'center'
        }}
        component={Home}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
