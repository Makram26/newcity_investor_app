import React,{useState, useContext, useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import Colors from '../constants/Colors'
import { RFValue } from "react-native-responsive-fontsize";

import Header from '../components/Header';
import AuthContext from '../auth/context';
import useAuth from '../auth/useAuth';

import Icon from 'react-native-vector-icons/MaterialIcons'

export default function IssuedFilesDetails({route, navigation}) {
    const {user, setUser} = useContext(AuthContext);

    const order = route.params;
    // console.log("order",order)

    // useEffect(() => {
    //     setTimeout(() => {
    //         useAuth().logOut();
    //         setUser(null);
    //     }, 300000);
    // }, []);

    return (
        <View style={styles.screen}>
            <Header
                name="Issued Files Details"
                onPress={() => navigation.goBack()}
            />
            <View style={{borderBottomWidth:0.5,borderColor:"grey"}}/>

            <View style={styles.detailsContainer}>
           
                <View style={styles.tableHead}>
                    <View style={styles.tableHCell1}><Text style={styles.tableHText}>Plot No</Text></View>
                    <View style={styles.tableHCell}><Text style={styles.tableHText}>Product</Text></View>
                    <View style={styles.tableHCell}><Text style={styles.tableHText}>Sector</Text></View>
                    <View style={styles.tableHCell}><Text style={styles.tableHText}>Size</Text></View>
                </View>
                <ScrollView>
            {order.issued_files.length>0 && order.issued_files.map((item,index)=>
                <View style={styles.tableHead}>
                    <View style={styles.tableCell1}><Text style={styles.tableText}>{item.inventory_id}</Text></View>
                    <View style={styles.tableCell}><Text style={styles.tableText}>{item.unit_category_type_id}</Text></View>
                    <View style={styles.tableCell}><Text style={styles.tableText}>{item.sector_id}</Text></View>
                    <View style={styles.tableCell}><Text style={styles.tableText}>{item.size_id}</Text></View>
                </View>
             )}
             </ScrollView>
             </View>
             <View style={{marginVertical:10}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.primary
    },
    text:{
        color: Colors.primary,
        fontSize:20,
        marginVertical:20,
        alignSelf:'center'
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
        fontSize:RFValue(22)
    },
    headerIcon: {
        marginRight:10
    },
   
    cardContainer: {
        backgroundColor:'white',
        padding:5,
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
        flex:0.5,
        marginVertical:10
    },
    detailsContainer: {
        width:'95%',
        alignSelf:'center',
        // flexDirection:'row'
        // borderColor:'red',
        // borderWidth:1,
        borderRadius:10,
        overflow:'hidden',
        marginVertical:15
    },
    tableHead: {
        // borderColor:'black',
        // borderWidth:1,
        // marginTop:50,
        // padding:2,
        // width:'95%',
        // alignSelf:'center',
        flexDirection:'row',
        justifyContent:'space-evenly'
    },
    tableCell: {
        borderWidth:0.5,
        borderColor: 'black',
        padding:5,
        flex:1,
        textAlign:'center',
        alignItems:'center',
        backgroundColor: 'white',
        justifyContent:'center'
    },
    tableCell1: {
        borderWidth:0.5,
        borderColor: 'black',
        padding:5,
        flex:1.5,
        textAlign:'center',
        alignItems:'center',
        backgroundColor: 'white',
        justifyContent:'center'
    },
    tableText: {
        color:'black',
        fontWeight:'900',
        fontSize: RFValue(12)
    },
    tableHCell: {
        borderWidth:0.5,
        borderColor: 'black',
        padding:5,
        flex:1,
        textAlign:'center',
        alignItems:'center',
        backgroundColor: "white"
    },
    tableHCell1: {
        borderWidth:0.5,
        borderColor: 'black',
        padding:5,
        flex:1.5,
        textAlign:'center',
        alignItems:'center',
        backgroundColor: "white"
    },
    tableHText: {
        color: Colors.primary,
        fontWeight:'bold',
        fontSize: RFValue(14)
    },
})
