import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'

export default function DashCard({onPress}) {
    return (
        <View style={styles.screen}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.card} onPress={onPress}>
                    <Image
                        source={require('../../assets/icons/copy.png')}
                        resizeMode="contain"
                        style={{width:40,height:40,alignSelf:'center'}}
                    />
                </TouchableOpacity>
                <View style={{marginVertical:5}}>
                    <Text style={{alignSelf:'center'}}>Payment History</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex:1
    },
    container:{
        // borderColor:'red',
        // borderWidth:1,
        width:'28%',
        marginVertical:10,
        marginHorizontal:15,
       
    },
    card: {
        // borderColor:'green',
        // borderWidth:1,
        padding:10,
        backgroundColor:'white',
        elevation:5,
        shadowOpacity:0.26,
        shadowRadius:6,
        shadowColor:'black',
        shadowOffset:{
            width:0, height:2
        },
        shadowRadius:6,
    }
})
