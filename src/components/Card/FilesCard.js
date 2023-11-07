import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Colors from '../../constants/Colors'

export default function FilesCard({requestNumber,sector,plot,category,type,size,product,price}) {
    return (
        <View style={styles.screen}>
            <View style={{width:'90%',alignSelf:'center',marginTop:10}}>
                <Text style={{fontSize:RFValue(17),fontWeight:'bold',color:'white'}}>{requestNumber}</Text>
            </View>
            <View style={styles.cardContainer}>
                <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:10,flex:1}}>
                    <View style={{flexDirection:'column',alignItems:'center'}}>
                        <Text style={{fontWeight:'bold'}}>Sector</Text>
                        <Text>{sector}</Text>
                    </View>
                    <View style={{flexDirection:'column',alignItems:'center'}}>
                        <Text style={{fontWeight:'bold'}}>Plot Number</Text>
                        <Text>{plot}</Text>
                    </View>
                    <View style={{flexDirection:'column',alignItems:'center'}}>
                        <Text style={{fontWeight:'bold'}}>Category</Text>
                        <Text>{category}</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:10,flex:1}}>
                    <View style={{flexDirection:'column', alignItems:'center'}}>
                        <Text style={{fontWeight:'bold'}}>Type</Text>
                        <Text>{type}</Text>
                    </View>
                    <View style={{flexDirection:'column',alignItems:'center'}}>
                        <Text style={{fontWeight:'bold'}}>Size</Text>
                        <Text>{size}</Text>
                    </View>
                    <View style={{flexDirection:'column',alignItems:'center'}}>
                        <Text style={{fontWeight:'bold'}}>Product</Text>
                        <Text>{product}</Text>
                    </View>
                </View>
                <Text style={{fontSize:RFValue(20),color:'#FF9E2D',alignSelf:'center',marginTop:10,flex:1}}>PKR {price}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex:1
    },
    cardContainer: {
        backgroundColor:'white',
        padding:10,
        width:'90%',
        alignSelf:'center',
        borderRadius:16,
        marginTop:5,
        elevation:5,
        shadowOpacity:0.26,
        shadowRadius:6,
        shadowColor:'black',
        shadowOffset:{
            width:0, height:2
        },
        shadowRadius:6,
        flex:0.25
    }
})
