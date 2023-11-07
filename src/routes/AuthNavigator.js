import React from 'react'
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import Verification from '../screens/Verification';
import SplashScreen from '../screens/SplashScreen';
import Login from '../screens/Login';
import Forgetpassword  from '../screens/forgetPassword';
import ResetPassword  from  '../screens/resetPassword';

const Stack = createStackNavigator();

const AuthNavigator = () => (
    <NavigationContainer independent={true}>
    <Stack.Navigator>
        <Stack.Screen
            name="SplashScreen"
            options={{
                headerShown: false,
            }}
            component={SplashScreen}
        />
        <Stack.Screen
            name="LoginScreen"
            options={{
                headerShown: false,
            }}
            component={Login}
        />
        <Stack.Screen
            name="Verification"
            options={{
                headerShown: false,
            }}
            component={Verification}
        />

        <Stack.Screen
            name="forgetpassword"
            options={{
                headerShown: false,
            }}
            component={Forgetpassword}
        />

        <Stack.Screen
            name="resetpassword"
            options={{
                headerShown: false,
            }}
            component={ResetPassword}
        />

    </Stack.Navigator>
    </NavigationContainer>
)

export default AuthNavigator