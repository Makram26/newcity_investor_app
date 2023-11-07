import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import Colors from '../../constants/Colors'

export default function PortfolioSummaryCard({
    onPress,
    investment_name,
    sector_name,
    due_amount,
    total_deal_amount
}) {
    return (
        <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
            <Image
                source={require("../../assets/images/investing.png")}
                style={{ width: 30, height: 40, tintColor:Colors.primary}}
                resizeMode="contain"
            />
            <View style={styles.cardTextContainer}>
                <View>
                <Text style={{color:Colors.primary,fontWeight:'bold'}}>{investment_name}</Text>
                <Text style={{fontSize:14,color:'#242526',fontWeight:'700'}}>{sector_name}</Text>
                </View>
                <View>
                <View style={{flexDirection:'row'}}>
                <Text style={{color:Colors.primary,fontWeight:'900'}}>Rs.{due_amount}</Text>
                    {/* <Text style={{color:Colors.primary,fontWeight:'900'}}>Rs.{item.total_deal_amount && item.total_deal_amount ? item.total_deal_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""}</Text> */}
                    <Text>{" / "}</Text>
                    {/* <Text style={{color:Colors.primary,fontWeight:'900'}}>Rs.{item.due_amount && item.due_amount ? item.due_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""}</Text> */}
                    <Text style={{color:Colors.primary,fontWeight:'900'}}>Rs.{total_deal_amount}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:"center"}}>
                    <Text style={{fontSize:12,color:'#3a3b3c'}}>Due Amount</Text>
                    <Text>{" / "}</Text>
                    <Text style={{fontSize:12,color:'#242526',fontWeight:'600'}}>Total Amount</Text>
                </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardContainer:{
        marginVertical:10,
        // borderColor:'red',
        // borderWidth:1,
        width:'95%',
        alignSelf:'center',
        flexDirection:'row',
        alignItems:'center',
        padding:10,
        borderRadius:10,
        elevation: 5,
        shadowOpacity: 0.26,
        shadowRadius: 6,
        shadowColor: 'black',
        shadowOffset: {
          width: 0, height: 2
        },
        flexWrap:"wrap",
        padding: 3,
        backgroundColor: 'white'
      },
      cardTextContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        // borderWidth:1,
        // borderColor:'purple',
        flex:1,
        marginLeft:10
      },
})
