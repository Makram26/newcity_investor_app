import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native'

import colors from '../constants/Colors'
import  NetInfo  from "@react-native-community/netinfo";

export default function SplashScreen({navigation}) {
    const [isInternetReachable, setIsInternetReachable] = useState(false)

    useEffect(() => {
        // Subscribe
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsInternetReachable(state.isInternetReachable);
            console.log("Connection type", state.type);
            console.log("Is internet Reachable?", isInternetReachable);
            // if (isInternetReachable == false) {
            //     Alert.alert("Attention", "Please have an Internet Connection")
            // }
        });
        return () => {
            unsubscribe();
        };
    },[isInternetReachable])

    // if(isInternetReachable == false) {
    //     Alert.alert("Attention", "Please have an Internet Connection")
    // }

    const checkConnection = () => {
        if(isInternetReachable){
            navigation.navigate('LoginScreen')
        }
        else{
            Alert.alert("Attention", "Please check your Internet Connection")
        }
    }

    return (
        <View style={styles.screen}>
           <View style={{marginLeft:30,marginTop:20,alignSelf:'flex-start'}}>
                <Image
                    source={require('../assets/images/logo.png')}
                    style={{width:90,height:80}}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={{color:'white',fontSize:40,fontWeight:'bold',letterSpacing:1}}>Welcome to</Text>
                <Text style={{color:'white',fontSize:40,fontWeight:'bold',letterSpacing:1}}>Investor's App</Text>
                <Text style={{color:'white', fontSize:16}}>a <Text style={{color:colors.secondary}}>history app</Text> made for <Text style={{color:colors.secondary}}>you</Text></Text>
            </View>
            {/* <View style={{width:'50%'}}> */}
            <Image
                source={require('../assets/images/illustration.png')}
                style={{alignSelf:'flex-end', marginRight:15,width:'65%',height:'55%'}}
                resizeMode="contain"
            />

            {/* </View> */}
            <TouchableOpacity style={{
                backgroundColor:colors.secondary, 
                borderRadius:25,
                width:'40%',
                alignSelf:'center',
                padding:10,
                marginVertical:10
            }} onPress={()=>checkConnection()}>
                <Text style={{color:'white', alignSelf:'center',fontWeight:'900'}}>Get Started</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex:1,
        backgroundColor:colors.primary
    },
    textContainer: {
        // marginVertical:20,
        marginLeft:30
    }
})
