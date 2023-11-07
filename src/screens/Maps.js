import React, {useContext, useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'

import Colors from '../constants/Colors'
import Icon from 'react-native-vector-icons/FontAwesome5'

import AuthContext from '../auth/context';
import useAuth from '../auth/useAuth';

export default function Maps({navigation}) {
    const {user, setUser} = useContext(AuthContext);

    // useEffect(() => {
    //     setTimeout(() => {
    //         useAuth().logOut();
    //         setUser(null);
    //     }, 300000);
    // }, []);

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={styles.headerIcon}>
                        <Icon
                            name="chevron-left"
                            color='white'
                            size={25}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Maps</Text>
                </View>
                <Image
                    source={require('../assets/images/icons8-user-100.png')}
                    style={{width:30,height:40,alignSelf:'flex-end'}}
                    resizeMode="contain"
                />
            </View>
            <View style={{borderBottomWidth:0.5,borderColor:"grey"}}/>

            <Text style={styles.text}>Coming Soon</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    text:{
        color: 'white',
        fontSize:40,
        marginVertical:150,
        alignSelf:'center',
        textAlign:'center'
    },
    header:{
        backgroundColor: Colors.primary,
        width:'95%',
        alignSelf:'center',
        marginTop:10,
        padding:5,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    headerText:{
        color:'white',
        fontWeight:'900',
        fontSize:25
    },
    headerIcon: {
        marginRight:10
    }
})
