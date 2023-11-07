import React, {useState, useEffect} from 'react'
import { View, Dimensions, SafeAreaView,ScrollView } from 'react-native'

import authStorage from './src/auth/storage'
import AuthContext from './src/auth/context'

import AuthNavigator from './src/routes/AuthNavigator'
import AppNavigator from './src/routes/AppNavigator'
import Verification from './src/screens/Verification'
import Login from './src/screens/Login'
import DrawerNavigator from './src/routes/DrawerNavigator'

export default function App() {
  const window = Dimensions.get('window')
  const [user, setUser] = useState(null)
  const [userID, setUserID] = useState(null);
  const [ready, setReady] = useState(true);

  const [name, setName] = useState(null)

  useEffect(() => {
    (async () => {
      const sess = await authStorage.getSession();
      const id = await authStorage.getUserID();
      if (sess !== null) {
        setUser(sess);
        setUserID(id);
      }
      setReady(false);
    })();
  }, []);
  if (ready) {
    return (
      <View
        style={{
          backgroundColor: 'white',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: window.height,
        }}>
      </View>
    );
  }
  return (
    <SafeAreaView style={{backgroundColor:"#433F5A",flex:1}}>
 
    <AuthContext.Provider
      value={{user, setUser, userID, setUserID,}}>
      {user ? <AppNavigator/> : <AuthNavigator />}
      {/* {user ? <Verification/> : <AuthNavigator />} */}
    </AuthContext.Provider>
    
    </SafeAreaView>
  );
}
