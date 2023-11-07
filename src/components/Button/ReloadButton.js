import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5'
import Colors from '../../constants/Colors'
import { RFValue } from "react-native-responsive-fontsize";

export default function ReloadButton({onPress}) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Icon
                name = 'redo-alt'
                size = {RFValue(20)}
                style= {styles.icon} 
            />
            <Text style={styles.text}>Retry</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '25%',
        //height: '20%',
        // paddingLeft: 10,
        flexDirection: 'row',
        padding: 13,
        alignContent: 'center',
        marginTop: 20,
        // marginRight: 20,
        alignSelf:'center',
        justifyContent:'center',
        shadowColor:'black',
        shadowOffset:{
            width:0, height:2
        },
        shadowRadius:6,
        shadowOpacity:0.26,
        elevation:8,
    },
    text: {
        color: Colors.primary,
        fontSize: RFValue(17),
        paddingLeft: 14,
        fontWeight: 'bold',
        // marginRight:5
    },
    icon: {
        paddingLeft: 15,
        paddingTop: 2,
        color: Colors.primary,
        justifyContent:'flex-start'
    }
})
