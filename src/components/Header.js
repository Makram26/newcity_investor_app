import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity,Image } from 'react-native'

import Colors from '../constants/Colors'
import Icon from 'react-native-vector-icons/FontAwesome5'

const Header = ({
    name,
    onPress
}) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onPress} style={{flexDirection:'row',alignItems:'center'}}>
                <View style={styles.headerIcon}>
                    <Icon
                        name="chevron-left"
                        color='white'
                        size={25}
                    />
                </View>
                <Text style={styles.headerText}>{name}</Text>
            </TouchableOpacity>
            <Image
                source={require('../assets/images/icons8-user-100.png')}
                style={{width:30,height:40,alignSelf:'flex-end'}}
                resizeMode="contain"
            />
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    header:{
        backgroundColor: Colors.primary,
        width:'95%',
        alignSelf:'center',
        marginTop:10,
        padding:5,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    headerText:{
        color:'white',
        fontWeight:'900',
        fontSize:25
    },
    headerIcon: {
        marginRight:10
    },
})
