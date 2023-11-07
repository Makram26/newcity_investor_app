import React from 'react'
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';

import {NavigationContainer} from '@react-navigation/native';

import Dashboard from '../screens/Dashboard';
import RequestHistory from '../screens/RequestHistory';
import NewRequest from '../screens/NewRequest';

import PaymentHistory from '../screens/PaymentHistory'
import AvailableFiles from '../screens/AvailableFiles';
import IssuedFiles from '../screens/IssuedFiles';
import AuthorizedPerson from '../screens/AuthorizedPerson';
import ForgotpasswordScreen from '../screens/forgetPassword';
import Maps from '../screens/Maps';
import ResetPassword from '../screens/resetPassword';
import ChangePassword from '../screens/ChangePassword';

import PortfolioSummary from '../screens/PortfolioSummary';
import AvailableFilesDetails from '../screens/AvailableFilesDetails';
import IssuedFilesDetails from '../screens/IssuedFilesDetails';
import ResetPasswordDash from '../screens/ResetPasswordDash';
import RequestHistoryDetails from '../screens/RequestHistoryDetails';
import AllSummary from '../screens/AllSummary';

const Stack = createStackNavigator();

const AppNavigator = () => (
    <NavigationContainer independent={true}>
    <Stack.Navigator>
        <Stack.Screen
            name="Dashboard"
            options={{
                headerShown: false,
            }}
            component={Dashboard}
        />
        <Stack.Screen
            name="Request History"
            options={{
                headerShown: false,
            }}
            component={RequestHistory}
        />
        <Stack.Screen
            name="New Request"
            options={{
                headerShown: false,
            }}
            component={NewRequest}
        />
        <Stack.Screen
            name="Payment History"
            options={{
                headerShown: false,
            }}
            component={PaymentHistory}
        />
        <Stack.Screen
            name="Available Files"
            options={{
                headerShown: false,
            }}
            component={AvailableFiles}
        />
        <Stack.Screen
            name="Issued Files"
            options={{
                headerShown: false,
            }}
            component={IssuedFiles}
        />
        <Stack.Screen
            name="Authorized Person"
            options={{
                headerShown: false,
            }}
            component={AuthorizedPerson}
        />
        <Stack.Screen
            name="Maps"
            options={{
                headerShown: false,
            }}
            component={Maps}
        />
        <Stack.Screen
            name="Portfolio"
            options={{
                headerShown: false,
            }}
            component={PortfolioSummary}
        />
        <Stack.Screen
            name="resetpassword"
            options={{
                headerShown: false,
            }}
            component={ResetPassword}
        />
        <Stack.Screen
            name="changepassword"
            options={{
                headerShown: false,
            }}
            component={ChangePassword}
        />
        <Stack.Screen
            name="AvailableFilesDetails"
            options={{
                headerShown: false,
            }}
            component={AvailableFilesDetails}
        />
        <Stack.Screen
            name="IssuedFilesDetails"
            options={{
                headerShown: false,
            }}
            component={IssuedFilesDetails}
        />
        <Stack.Screen
            name="ResetPasswordDash"
            options={{
                headerShown: false,
            }}
            component={ResetPasswordDash}
        />
        <Stack.Screen
            name="RequestHistoryDetails"
            options={{
                headerShown: false,
            }}
            component={RequestHistoryDetails}
        />
        <Stack.Screen
            name="AllSummary"
            options={{
                headerShown: false,
            }}
            component={AllSummary}
        />
       
    </Stack.Navigator>
    </NavigationContainer>
)

export default AppNavigator