import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import Colors from '../../constants/Colors'

export default function RequestNumber({approved, requestNumber, investment, investor, Res1, Res2, Plot1, Plot2}) {
    return (
        <View style={styles.main}>
            <View style={{width:'90%',alignSelf:'center',marginTop:10}}>
                <Text style={{fontSize:RFValue(17),fontWeight:'bold',color:'white'}}>{requestNumber}</Text>
            </View>
            <View style={styles.cardContainer}>
                <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:10,flex:1}}>
                    <View style={{flexDirection:'column',alignItems:'center'}}>
                        <Text style={{fontWeight:'bold'}}>Investment Name</Text>
                        <Text>{investment}</Text>
                    </View>
                    <View style={{flexDirection:'column',alignItems:'center'}}>
                        <Text style={{fontWeight:'bold'}}>Investor Name</Text>
                        <Text>{investor}</Text>
                    </View>
                    {/* <View style={{flexDirection:'column'}}>
                        <Text style={{fontWeight:'bold'}}>Plot Number</Text>
                        <Text>Plot Number</Text>
                    </View> */}
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:10,flex:1}}>
                    <View style={{flexDirection:'column', alignItems:'center'}}>
                        <Text style={{fontWeight:'bold'}}>{Res1}</Text>
                        <Text>{Plot1}</Text>
                    </View>
                    <View style={{flexDirection:'column',alignItems:'center'}}>
                        <Text style={{fontWeight:'bold'}}>{Res2}</Text>
                        <Text>{Plot2}</Text>
                    </View>
                    {/* <View style={{flexDirection:'column'}}>
                        <Text style={{fontWeight:'bold'}}>Plot Number</Text>
                        <Text>Plot Number</Text>
                    </View> */}
                </View>
                <Text style={{fontSize:RFValue(20),color:'#FF9E2D',alignSelf:'center',marginTop:10,flex:1}}>{approved}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    main:{
        flex:1,
        // backgroundColor: Colors.primary
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
