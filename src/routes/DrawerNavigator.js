import React, {useContext, useEffect} from 'react';
import {View, Dimensions, TouchableOpacity, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {ModalPortal} from 'react-native-modals';

import AppNavigator from './AppNavigator';

import AuthContext from '../auth/context';
import useAuth from '../auth/useAuth';

function Logout({navigation}) {
    const {user, setUser} = useContext(AuthContext);
  
    const window = Dimensions.get('window');
    
    const logout = () => {
      useAuth().logOut();
      setUser(null);
    };
   
    return (
        <View
            style={{
                width: '40%',
                // marginHorizontal: 10,
                marginTop: window.height * 0.7,
                alignItems: 'center',
            }}
        >
        
            <TouchableOpacity
                onPress={logout}
                style={{
                    borderRadius: 30, 
                    width: '85%',
                    backgroundColor: '#433F5A',
                    alignSelf:'center',
                    padding:10,
                }}
            >
                <Text style={{
                    color:'white',
                    fontSize:20,
                    alignSelf:'center',
                    fontWeight:'900'
                }}>
                    Logout
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const Drawer = createDrawerNavigator();

function MyDrawer() {
    return (
      <Drawer.Navigator drawerContent={() => <Logout />}>
        <Drawer.Screen 
            name="Main" 
            component={AppNavigator}
            options={{
                headerShown: false,
            }} 
        />
      </Drawer.Navigator>
    );
}

export default function DrawerNavigator() {
    return (
        <NavigationContainer independent={true}>
            <MyDrawer />
            <ModalPortal />
        </NavigationContainer>
    )
}