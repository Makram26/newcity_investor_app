import React,{useState, useEffect, useContext} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert, FlatList } from 'react-native'

import CheckBox from '@react-native-community/checkbox';
import requestApi from '../api/investor'
import Colors from '../constants/Colors'
import { RFValue } from "react-native-responsive-fontsize";

import Icon from 'react-native-vector-icons/MaterialIcons'

import PortfolioSummaryCard from '../components/Card/PortfolioSummaryCard';
import AuthContext from '../auth/context';
import Header from '../components/Header'
import useAuth from '../auth/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authStorage from '../auth/storage'

export default function AllSummary({navigation, route}) {
    const {user, setUser} = useContext(AuthContext);
    const [userID, setUserID] = useState(null);

    const Order = route.params;
    // console.log("order", Order)

    // useEffect(() => {
    //     setTimeout(() => {
    //       useAuth().logOut();
    //       setUser(null);
    //     }, 300000);
    // }, []);


    return (
        <View style={styles.screen}>
            <Header
                onPress={() => navigation.goBack()}
                name="Portfolio Summary"
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('Payment History')}>
                    <Text style={styles.buttonText}>Payment History</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={Order}
                keyExtractor={(stock) => stock.id}
                renderItem={({item, index}) => {
                return (
                    <PortfolioSummaryCard
                        key={item.investment_id}
                        onPress={() => navigation.navigate('Portfolio', item.investment_id)}
                        investment_name={item.investment_name}
                        sector_name={item.sector_name}
                        due_amount={item.due_amount && item.due_amount ? item.due_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""}
                        total_deal_amount={item.total_deal_amount && item.total_deal_amount ? item.total_deal_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""}
                    />
                )
                }}
                // refreshControl= {<RefreshControl refreshing={loading} onRefresh={loadMaintenance} />}
            /> 
            <View style={{marginVertical:20}}></View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.primary
    },
    buttonText:{
        alignSelf:'center',
        color:'white',
        fontWeight:'bold'
    },
    buttonContainer:{
        // borderColor:'red',
        // borderWidth:1,
        marginVertical:10,
        width:'90%',
        alignSelf:'center',
    },
    button:{
        width:'40%',
        // borderColor:'green',
        // borderWidth:1,
        backgroundColor:'#CA7F3C',
        borderRadius:5,
        alignItems:'center',
        padding:6,
        alignSelf:'flex-end'
    }
})
