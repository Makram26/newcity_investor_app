import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, FlatList, ScrollView,SafeAreaView } from "react-native";
import { useFocusEffect } from '@react-navigation/native';

import { RFValue } from "react-native-responsive-fontsize";
import colors from '../constants/Colors'
import Icon from 'react-native-vector-icons/FontAwesome5'

import AuthContext from '../auth/context';
import useAuth from '../auth/useAuth';

import ReloadButton from '../components/Button/ReloadButton'
import PortfolioSummaryCard from "../components/Card/PortfolioSummaryCard";
// import DashIcon from '../assets/images/dashIcon.jfif'
import requestApi from '../api/investor'
// import { ScrollView } from "react-native-gesture-handler";
import Colors from "../constants/Colors";
import authStorage from '../auth/storage'

export default function Dashboard({ navigation }) {

  const [open, setOpen] = useState(false);
  const { user, setUser } = useContext(AuthContext);

  const [errors, setErrors] = useState(false)
  const [loading, SetLoading] = useState(false)

  const [dashInfo, SetDashInfo] = useState([])
  const [forwardInfo, SetforwardInfo] = useState([])
  const [investor, SetInvestor] = useState('')

  const [total, setTotal] = useState('')
  const [totalDue, setTotalDue] = useState('')
  const [totalInvestments, setTotalInvestments] = useState('')

  const [userName, setUserName] = useState('');

  useEffect(() => {
    (async () => {
      const id = await authStorage.getUserName();
      setUserName(id)

    })();
  }, []);
  // console.log("@dashpartner_id", userName)

  useEffect(() => {
    loadInvestments()
  }, [])

  const loadInvestments = async () => {
    SetLoading(true)
    SetDashInfo([]);
    let tempArray = []
    let temDueAmountArray = []
    const response = await requestApi.getInvestments();
    if (response && response.data && response.data.length > 0) {
      SetDashInfo(response.data.slice(0, 5))
      SetforwardInfo(response.data)
      // console.log("DataResponse",response.data)
      SetInvestor(response.data[0].investor_name)
      response.data.forEach((emp) => {
        tempArray.push(emp.total_deal_amount);
        temDueAmountArray.push(emp.due_amount)
      })
      // console.log("tempArray",tempArray)
      // console.log("temDueAmountArray",temDueAmountArray)
      setTotalInvestments(tempArray.length)
      var total = 0;
      for (var i in tempArray) {
        total += tempArray[i];
      }
      var dueAmount = 0;
      for (var i in temDueAmountArray) {
        dueAmount += temDueAmountArray[i];
      }
      setTotalDue(dueAmount.toFixed(2))
      setTotal(total)
      setErrors(false)

    }
    else {
      // console.log("error in getting data")
      return setErrors(true)
    }
  }

  const logout = () => {
    useAuth().logOut();
    setUser(null);
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     useAuth().logOut(); 
  //     setUser(null);
  //   }, 300000);
  // }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.Dashboard}>
      <View style={styles.DashboardUpper}>
        <View style={styles.header}>
          <TouchableOpacity onPress={logout}>
            <Icon
              name="power-off"
              color="white"
              size={25}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate("Authorized Person")}>
            <Image
              source={require('../assets/images/icons8-user-100.png')}
              style={{ width: 30, height: 40, alignSelf: 'flex-end', alignItems: 'center', alignContent: 'flex-end' }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.TextPortionDashboard}>
          <Text style={styles.ProfileName}>Welcome, <Text style={{ fontWeight: 'bold' }}>{investor && investor ? investor : ""}</Text></Text>
          <View style={{
            width: '85%', alignSelf: 'center'
          }}>
            {/* <Text style={styles.ProfileDetail}>Hope you are fine</Text> */}
            <TouchableOpacity onPress={() => navigation.navigate('changepassword')}>
              <Text style={{ color: Colors.secondary, fontWeight: 'bold', alignSelf: 'flex-end', marginBottom: 20 }}>Change Password</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.UpperThreeLinks}>
            <View style={styles.DashboardButton}>
              <TouchableOpacity style={styles.InnerDashboardButton} onPress={() => navigation.navigate('Payment History')}>
                <Image
                  style={styles.Phicon}
                  source={require("../assets/icons/new/icons8-cash-in-hand-70.png")}
                />
              </TouchableOpacity>
              <Text style={{ fontSize: RFValue(13), alignSelf: 'center', marginTop: 5, color: "white", fontWeight: '900' }}>Payment History</Text>
            </View>
            <View style={styles.DashboardButton}>
              <TouchableOpacity style={styles.InnerDashboardButton} onPress={() => navigation.navigate('Request History')} >
                <Image
                  style={styles.Phicon}
                  source={require("../assets/icons/new/icons8-bank-70.png")}
                />
              </TouchableOpacity>
              <Text style={{ fontSize: RFValue(13), alignSelf: "center", marginTop: 5, color: "white", fontWeight: '900' }}>Request</Text>
            </View>
            <View style={styles.DashboardButton}>
              <TouchableOpacity style={styles.InnerDashboardButton} onPress={() => navigation.navigate('Available Files')}>
                <Image
                  style={styles.Phicon}
                  source={require("../assets/icons/new/icons8-documents-70.png")}
                />
              </TouchableOpacity>
              <Text style={{ fontSize: RFValue(13), alignSelf: "center", marginTop: 5, color: "white", fontWeight: '900' }}>
                Available Files
              </Text>
            </View>
          </View>
          <View style={styles.LowerThreeLinks}>
            <View style={styles.DashboardButton}>
              <TouchableOpacity style={styles.InnerDashboardButton} onPress={() => navigation.navigate('Issued Files')}>
                <Image
                  style={styles.Phicon}
                  source={require("../assets/icons/new/icons8-add-file-70.png")}
                />
              </TouchableOpacity>
              <Text style={{ fontSize: RFValue(13), alignSelf: "center", marginTop: 5, color: "white", fontWeight: '900' }}>
                Issued Files
              </Text>
            </View>
            <View style={styles.DashboardButton}>
              <TouchableOpacity style={styles.InnerDashboardButton} onPress={() => navigation.navigate('Authorized Person')}>
                <Image
                  style={styles.Phicon1}
                  source={require("../assets/icons/new/icons8-lock-male-user-70.png")}
                />
              </TouchableOpacity>
              <Text style={{ fontSize: RFValue(13), alignSelf: 'center', marginTop: 5, color: "white", fontWeight: '900' }}>Authorized Person</Text>
            </View>
            <View style={styles.DashboardButton}>
              <TouchableOpacity style={styles.InnerDashboardButton} onPress={() => navigation.navigate('Maps')}>
                <Image
                  style={styles.Phicon1}
                  source={require("../assets/icons/new/icons8-place-marker-70.png")}
                />
              </TouchableOpacity>
              <Text style={{ fontSize: RFValue(13), alignSelf: "center", marginTop: 5, color: "white", fontWeight: '900' }}>Map</Text>
            </View>
          </View>

        </View>
      </View>

    
      <View style={styles.cardContainer}>
              
              <View style={styles.cardInnerContainer}
              >
                <View style={{ alignItems : "center" }}>
                  <Text style={{color:Colors.primary,fontWeight:'bold'}}>Total</Text>
                  <Text style={{color:Colors.primary,fontWeight:'bold'}}>Investments</Text>
                  <Text style={{fontSize:14,color:'#242526',fontWeight:'700',alignSelf:'center'}}>{totalInvestments && totalInvestments ? totalInvestments : ""}</Text>
                </View>
                <View>
                  <View style={{flexDirection:'row'}}>
                    <Text style={{color:Colors.primary,fontWeight:'900'}}>Rs.{totalDue && totalDue ? totalDue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""}</Text>
                    <Text>{" / "}</Text>
                    <Text style={{color:Colors.primary,fontWeight:'900'}}>Rs.{total && total ? total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""}</Text>
                  </View>
                  <View style={{flexDirection:'row',alignItems:'center',justifyContent:"center"}}>
                    <Text style={{fontSize:12,color:'#3a3b3c'}}>Due Amount</Text>
                    <Text>{" / "}</Text>
                    <Text style={{fontSize:12,color:'#242526',fontWeight:'600'}}>Total Amount</Text>
                  </View>
                </View>
              </View>
        </View>
      <View style={{}}>
        <View style={{ width: '99%', justifyContent: "space-between", flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          <Text style={styles.PortFolioText}>Portfolio Summary</Text>
        </View>
        {errors && (<>
          <ReloadButton onPress={loadInvestments} />
        </>)}



        {dashInfo.map(item => (
                    <PortfolioSummaryCard
                    key={item.investment_id}
                    onPress={() => navigation.navigate('Portfolio', item.investment_id)}
                    investment_name={item.investment_name}
                    sector_name={item.sector_name}
                    due_amount={item.due_amount && item.due_amount ? item.due_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""}
                    total_deal_amount={item.total_deal_amount && item.total_deal_amount ? item.total_deal_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""}
                    />
        ))}

        {/* tHIS WILL CONDUCT AN ERROR */}
        {/* <FlatList
          data={dashInfo}
          keyExtractor={(stock) => stock.id}
          // style={{ borderColor:'red',borderWidth:1 }}
          // horizontal={true}
          renderItem={({ item, index }) => {
            return (
             
            )
          }}
        /> */}

        <TouchableOpacity
          onPress={() => navigation.navigate('AllSummary', forwardInfo)}
          style={styles.viewAllButton}
        >
          <Text style={{ color: Colors.primary, alignSelf: 'center', fontSize: RFValue(15), fontWeight: 'bold', }}>View All</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  Dashboard: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: 'row',
    width: '95%',
    alignSelf: 'center',
    marginTop: 10,
    justifyContent: 'space-between',
    padding: 5
  },
  DashboardUpper: {
    flex: 0.80,
    maxWidth:700,
   paddingBottom : 20,
    backgroundColor: Colors.primary,
  },
  DashboardImagesContainer: {
    width: "100%",
    height: 60,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  DashboardLogo: {
    backgroundColor: "#ccc",
    height: 50,
    width: 50,
    marginTop: 5,
    marginLeft: 30,
  },
  DashboardProfile: {
    backgroundColor: "#ccc",
    height: 50,
    width: 50,
    marginTop: 5,
    marginRight: 30,
  },
  TextPortionDashboard: {
    // marginLeft: 30,
  },
  ProfileName: {
    fontSize: RFValue(24),
    color: "white",
    marginLeft: 30,
  },
  ProfileDetail: {
    fontSize: RFValue(18),
    fontWeight: "300",
    color: "white",
    marginLeft: 30,
  },
  PortFolio: {
    backgroundColor: "#fff",
    width: '100%',
    height: 300,
    flex: 0.5,
    // position: "relative",
    marginTop: 20,
    // marginLeft: 30,
    alignSelf: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
    marginBottom: 5
  },
  PortFolioText: {
    paddingTop: 10,
    paddingLeft: 10,
    color: colors.primary,
    fontWeight: "bold",
    fontSize: RFValue(17)
  },
  portfolioData: {
    flexDirection: 'row',
    width: '100%',
    // alignSelf:'center',
    justifyContent: 'space-between',

    alignItems: 'center',
    padding: 5,
    // marginVertical:5
  },
  portfolioData2: {
    
  },
  portfolioData1: {
    flexDirection: 'row',
    // width: '95%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    marginTop: 5,
    // elevation: 5,
    // shadowOpacity: 0.26,
    // shadowRadius: 6,
    // shadowColor: 'black',
    // shadowOffset: {
    //   width: 0, height: 2
    // },
    // shadowRadius: 6,
    // backgroundColor: 'white'
  },
  DashboardLower: {
    width: "100%",
    height: "100%",
    position: "absolute",
    marginTop: 350,
    // flex:0.6
  },
  DashboardLowerText: {
    fontWeight: "900",
    fontSize: RFValue(22),
    // padding: 20,
    marginLeft: 20,
    marginTop: 5,
    color: "white"
  },
  UpperThreeLinks: {
    width: "100%",
    height: 70,
    marginTop: 10,
    marginBottom: 30,
    justifyContent: "space-around",
    flexDirection: "row",
  },
  LowerThreeLinks: {
    width: "100%",
    height: 70,
    justifyContent: "space-around",
    flexDirection: "row",
    marginTop: 7,
    marginBottom: 35
  },
  DashboardButton: {
    width: '30%',
    // height: 90,
    // backgroundColor: "#fff",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 5,
    // borderRadius: 7,
    // alignItems:'center'
  },
  InnerDashboardButton: {
    width: '100%',
    height: '100%',
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    // shadowColor: Colors.primary,
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 5,
    borderRadius: 7,
    alignItems: 'center',
    // padding:5
  },
  Phicon: {
    // height: 50,
    width: '80%',
    alignSelf: 'center',
    resizeMode: "contain",
    // marginLeft: 20,
    // marginTop: 20,
    // shadowColor: "white",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 9,
  },
  Phicon1: {
    // height: 50,
    width: 90,
    alignSelf: 'center',
    resizeMode: 'contain',
    // shadowColor: "white",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 9,
    // marginLeft: 20,
    // marginTop: 20,
  },
  scrollContent: {
    marginTop: -150
  },
  viewAllButton:{
    // borderColor:'blue',
    // borderWidth:1,
    // width:'30%',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  cardContainer:{
    marginVertical:10,
    // borderColor:'red',
    // borderWidth:1,
    width:'95%',
    alignSelf:'center',
    flexDirection:'row',
    alignItems:'center',
    padding: 10,
    paddingLeft:1,
    paddingRight: 10,
    borderRadius:10,
    elevation: 5,
    shadowOpacity: 0.26,
    shadowRadius: 6,
    shadowColor: 'black',
    shadowOffset: {
      width: 0, height: 2
    },
    flexWrap : "wrap",
    shadowRadius: 6,
    backgroundColor: 'white',
  },
  cardInnerContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    // borderWidth:1,
    // borderColor:'purple',
    flex:1,
    marginLeft:10
    }
});

