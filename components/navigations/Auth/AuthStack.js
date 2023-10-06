import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import AuthView from '../../../views/Auth/AuthView';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="login"
        options={{headerShown: false}}
        component={AuthView}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
