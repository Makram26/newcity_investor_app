import React, { useState, useEffect, useContext } from 'react'
import {
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  FlatList, 
  ActivityIndicator,
  RefreshControl
} from 'react-native'

import { RFValue } from "react-native-responsive-fontsize";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import RequestNumber from '../components/Card/RequestNumber'
import Colors from '../constants/Colors'

import requestApi from '../api/investor'
import ReloadButton from '../components/Button/ReloadButton'
import Header from '../components/Header';

import AuthContext from '../auth/context';
import useAuth from '../auth/useAuth';


export default function RequestHistory({ navigation }) {

  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState(false)

  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    loadRequestHistory()
  }, [])

  const loadRequestHistory = async () => {
    setLoading(true)
    const response = await requestApi.getRequestHistory();
    setLoading(false)
    if (response.ok) {
      // setRequestInfo(JSON.stringify(response.data))
      setFilteredData(response.data)
      // console.log("Investments", response.data)
      setErrors(false)
    }
    else {
      // console.log("error in getting data")
      return setErrors(true)
    }
  }

  //   useEffect(() => {
  //     setTimeout(() => {
  //       useAuth().logOut();
  //       setUser(null);
  //     }, 300000);
  // }, []);


  return (
    <View style={styles.screen}>
      <Header
        name="Request History"
        onPress={() => navigation.navigate('Dashboard')}
      />
      <View style={{ borderBottomWidth: 0.5, borderColor: "grey" }} />

      <TouchableOpacity style={styles.requestButton} onPress={() => navigation.navigate('New Request')}>
        <Text style={{ color: 'white', fontSize: RFValue(15) }}>New Request</Text>
      </TouchableOpacity>

      {/* {loading && <ActivityIndicator />} */}
      {errors && (<>
        <Text style={styles.errorText}>Couldn't retrive History</Text>
        <ReloadButton onPress={loadRequestHistory} />
      </>)}
      <FlatList
        data={filteredData}
        keyExtractor={(stock) => stock.id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity style={{ marginBottom: 5 }} onPress={() => navigation.navigate('RequestHistoryDetails', item)}>
              <View style={{ width: '90%', alignSelf: 'center', marginTop: 10 }}>
                <Text style={{ fontSize: RFValue(17), fontWeight: 'bold', color: 'white' }}>Request No. {item.request_no}</Text>
              </View>
              <View style={styles.cardContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, flex: 1 }}>
                  <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: RFValue(12) }}>Investment Name</Text>
                    <Text style={{ fontSize: RFValue(12) }}>{item.investment_name}</Text>
                  </View>
                  {
                    (item.appointment_date !== "") ?
                      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: RFValue(12) }}>Appointment Date</Text>
                        <Text style={{ fontSize: RFValue(12) }}>{item.appointment_date}</Text>
                      </View> :
                      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: RFValue(12) }}>Appointment Date</Text>
                        <Text style={{ fontSize: RFValue(12) }}>None</Text>
                      </View>
                  }


                  <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: RFValue(12) }}>Type</Text>
                    <Text style={{ fontSize: RFValue(12) }}>{item.transaction_type}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: RFValue(18), color: '#FF9E2D', alignSelf: 'center', marginTop: 10, flex: 1 }}>{item.request_state.toUpperCase()}</Text>

              </View>
            </TouchableOpacity>

          )
        }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadRequestHistory} />}
      />
      {/* <RequestNumber 
          approved={filteredData.request_state}
        /> */}
      {/* <RequestNumber/>
        <RequestNumber/> */}

    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.primary
  },
  header: {
    // borderWidth:1,
    // borderColor:'red',
    width: '95%',
    alignSelf: 'center',
    marginTop: 10,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerText: {
    fontSize: RFValue(22),
    color: 'white',
    fontWeight: '900'
  },
  requestButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 30,
    width: '30%',
    padding: 5,
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 15,
    marginRight: 10
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
    marginTop: 5,
    elevation: 5,
    shadowOpacity: 0.26,
    shadowRadius: 6,
    shadowColor: 'black',
    shadowOffset: {
      width: 0, height: 2
    },
    shadowRadius: 6,
    flex: 0.25
  },
  errorText: {
    fontSize: RFValue(25),
    color: 'white',
    alignSelf: 'center',
  },
})
