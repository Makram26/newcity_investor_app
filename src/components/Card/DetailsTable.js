import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import CheckBox from '@react-native-community/checkbox';

export default function DetailsTable({
    check,
    plot,
    category,
    size,
    product,
    value,
    toggleCheckbox
}) {
    return (
        <View style={styles.screen}>
            <View style={styles.tableHead}>
                <View style={styles.tableCell}>
                <CheckBox
                    disabled={false}
                    value={value}
                    // style={styles.checkBox}
                    tintColors={{true: '#433F5A', false: '#433F5A'}}
                    onValueChange={toggleCheckbox}
                />
                </View>
                <View style={styles.tableCell1}><Text  style={styles.tableText}>{plot}</Text></View>
                <View style={styles.tableCell1}><Text  style={styles.tableText}>{category}</Text></View>
                <View style={styles.tableCell}><Text  style={styles.tableText}>{size}</Text></View>
                <View style={styles.tableCell}><Text  style={styles.tableText}>{product}</Text></View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex:1,
        backgroundColor:'white'
    },
    tableHead:{
        // width:'95%',
        alignSelf:'center',
        flexDirection:'row',
        justifyContent:'space-evenly',
        justifyContent:'center'
    },
    tableCell: {
        borderWidth:0.5,
        borderColor: 'black',
        padding:10,
        flex:1,
        textAlign:'center',
        alignItems:'center',
        backgroundColor: 'white'
    },
    tableCell1: {
        borderWidth:0.5,
        borderColor: 'black',
        padding:10,
        flex:1.5,
        textAlign:'center',
        alignItems:'center',
        backgroundColor: 'white'
    },
    tableText:{
        color:'#788190',
        fontSize:12
    },
    // checkBox:{
    //     { true?: ?ColorValue, false?: ?ColorValue }
    // }
})
