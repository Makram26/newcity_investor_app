import React, { useState, USeEffect, useEffect, useContext } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, RefreshControl, FlatList } from 'react-native'
import requestApi from '../api/investor'
import Colors from '../constants/Colors'
import { RFValue } from "react-native-responsive-fontsize";
import Moment from 'moment';
import AuthContext from '../auth/context';
import useAuth from '../auth/useAuth';

import ReloadButton from '../components/Button/ReloadButton'
import Header from '../components/Header';

import Icon from 'react-native-vector-icons/MaterialIcons'

export default function PaymentHistory({ navigation }) {

    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, SetLoading] = useState(false)
    const [errors, setErrors] = useState(false)

    const { user, setUser } = useContext(AuthContext);


    useEffect(() => {
        loadPaymentHistory()
    }, [])

    const loadPaymentHistory = async () => {
        SetLoading(true)
        setPaymentHistory([]);
        const response = await requestApi.getPaymentHistory();
        SetLoading(false)
        if (response && response.data && response.data.length > 0) {
            setPaymentHistory(response.data)
            console.log("paymentHistory", response.data)
            setErrors(false)
        }
        else {
            console.log("error in getting data")
            return setErrors(true)
        }
    }

    // const logout = () => {
    //     useAuth().logOut();
    //     setUser(null);
    // };

    // useEffect(() => {
    //     setTimeout(() => {
    //       useAuth().logOut();
    //       setUser(null);
    //     }, 300000);
    // }, []);


    return (
        <View style={styles.screen}>
            <Header
                name="Payment History"
                onPress={() => navigation.navigate('Dashboard')}
            />
            <View style={{ borderBottomWidth: 0.5, borderColor: "grey" }} />

            {errors && (<>
                <Text style={styles.errorText}>Couldn't retrive Payment History</Text>
                <ReloadButton onPress={loadPaymentHistory} />
            </>)}
            <ScrollView>
                {paymentHistory.length > 0 && paymentHistory.map((item, index) =>

                    <View style={styles.screen} key={item.investment_no}>
                        <View style={{ width: '90%', alignSelf: 'center', marginTop: 10 }}>
                            <Text style={{ fontSize: RFValue(15), fontWeight: 'bold', color: 'white' }}>{item.investment_name}</Text>
                        </View>
                        <View style={styles.cardContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10,  }}>
                                <View style={{  alignItems: 'center',flex:2, }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: RFValue(12) }}>Receipt #</Text>
                                </View>
                                <View style={{  alignItems: 'center',flex:1.5, }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: RFValue(12) }}>Payment Date</Text>
                                   
                                </View>
                                <View style={{  alignItems: 'center',flex:1, }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: RFValue(12) }}>Mode</Text>
                                    
                                </View>
                                <View style={{  alignItems: 'center',flex:2, }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: RFValue(12) }}>Payment Amount</Text>
                                    
                                </View>
                            </View>
                            {
                                item.payments.map((items) =>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop:5 }}>
                                        <View style={{ alignItems: 'center',flex:2, }}>
                                            {/* <Text style={{ fontWeight: 'bold', fontSize: RFValue(12) }}>Receipt #</Text> */}
                                            <Text style={{ fontSize: RFValue(11) }}>{items.payment_no}</Text>
                                        </View>
                                        <View style={{ alignItems: 'center',flex:1.5,}}>
                                            {/* <Text style={{ fontWeight: 'bold', fontSize: RFValue(12) }}>Payment Date</Text> */}
                                            <Text style={{ fontSize: RFValue(11) }}>{Moment(items.payment_date).format('DD-MM-YYYY')}</Text>
                                        </View>
                                        <View style={{ alignItems: 'center',flex:1, }}>
                                            {/* <Text style={{ fontWeight: 'bold', fontSize: RFValue(12) }}>Mode</Text> */}
                                            <Text style={{ fontSize: RFValue(11) }}>{items.mode_of_payment}</Text>
                                        </View>
                                        <View style={{ alignItems: 'center',flex:2, }}>
                                            {/* <Text style={{ fontWeight: 'bold', fontSize: RFValue(12) }}>Payment Amount</Text> */}
                                            <Text style={{ fontSize: RFValue(11) }}>{items.payment_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                        </View>
                                    </View>
                                )
                            }
                            
                        </View>
                    </View>

                )}
                {<RefreshControl refreshing={loading} onRefresh={loadPaymentHistory} />}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.primary
    },
    text: {
        color: Colors.primary,
        fontSize: 20,
        marginVertical: 20,
        alignSelf: 'center'
    },
    header: {
        backgroundColor: Colors.primary,
        width: '95%',
        alignSelf: 'center',
        marginTop: 10,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerText: {
        color: 'white',
        fontWeight: '900',
        fontSize: RFValue(22)
    },
    headerIcon: {
        marginRight: 10
    },

    cardContainer: {
        backgroundColor: 'white',
        padding: 10,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 16,
        marginVertical: 5,
        elevation: 5,
        shadowOpacity: 0.26,
        shadowRadius: 6,
        shadowColor: 'black',
        shadowOffset: {
            width: 0, height: 2
        },
        shadowRadius: 6,
        flex: 0.5
    },
    errorText: {
        fontSize: RFValue(25),
        color: 'white',
        alignSelf: 'center',
        marginTop:20
    },

})
