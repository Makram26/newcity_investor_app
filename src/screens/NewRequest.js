import React, {useState, useEffect, useContext} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput,FlatList, ScrollView, ActivityIndicator, Alert } from 'react-native'

import { RFValue } from "react-native-responsive-fontsize";
import DropDownPicker from 'react-native-dropdown-picker';
import {Picker} from '@react-native-picker/picker';
import Header from '../components/Header';

import Modal from "react-native-modal";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { MaskedTextInput } from "react-native-mask-text";

import Colors from '../constants/Colors'
import Icon from 'react-native-vector-icons/FontAwesome5'

import DetailsTable from '../components/Card/DetailsTable';
import CheckBox from '@react-native-community/checkbox';

import AuthContext from '../auth/context';
import useAuth from '../auth/useAuth';

import requestApi from '../api/investor'
import { onChange } from 'react-native-reanimated';

const member_regux = /^[a-zA-Z\s]*$/
const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const mobileRex = /^((0))(3)([0-9]{9})$/
export default function NewRequest({navigation}) {
    const [requestInfo, setRequestInfo] = useState([])
    const [searchInfo, setSearchInfo] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const [select,setSelected] = useState([])

    const {user, setUser} = useContext(AuthContext);
    const [investorName, setInvestorName] = useState('')

    const [value, setValue] = useState(null);

    const [tasks, setTasks] = useState([]);
    const [investID, setInvestID] = useState(null);

    const [sector, setSector] = useState([]);

    const [otpID, setOtpID] =useState('')

    const [otp, setOtp] = useState('')

    const [showModel, setModel] = useState(false);
    const [showOTPModel, setOTPModel] = useState(false);

    const [sendRequest,setSendRequest] = useState(false)
    const [memberDetail, setMemberDetail] = useState({
        member_name: null,
        member_type: [{ "id": "person", "value": "Individual" },{ "id": "company", "value": "Company" }, { "id": "aop", "value": "Joint Owner" }],
        cnic: null,
        mobile: null,
        email: null,
        gender: [{ "id": "male", "value": "Male" }, { "id": "female", "value": "Female" }],
        selectedGender: "male",
        selectMember_type: "person",
        father_name: null
    })
    const [errors, setErrors] = useState({
        error_member_name:'',
        error_cnic: '',
        errror_mobile: '',
        error_email: '',
        error_father_name: '',
    })
    
    useEffect(() => {
        (async () => {
            try {
                const response = await requestApi.getInvestments();
                if (response.ok && response.data.length>0){
                    setInvestorName(response.data[0].investor_name)
                    let employeeArray = response.data;
                    // console.log("newRequest", response.data)
                    // let items = [];
                    // employeeArray.forEach((emp) => {
                    //     //alert(emp.name+" - "+emp.id);
                    //     let item = {label: emp.investment_name, value: emp.investment_id};
                    //     items.push(item);
                    // });
                    setRequestInfo(employeeArray)
                    // setTasks(items)

                    // let itemsNew = [];
                    // employeeArray.forEach((emp) => {
                    //     //alert(emp.name+" - "+emp.id);
                    //     let itemNew = {label: emp.sector_name, value: emp.sector_id};
                    //     itemsNew.push(itemNew);
                    // });
                    // setSector(itemsNew)
                }
                else{
                    // console.log("error in getting data")
                }
            }
            catch (error) {
                console.error(error);
            }
        })()
    }, [])

    var params = []
    for (var i=0; i<select.length; i++) {
        var item = select[i];
        params.push({"check": item.checked, "investor_file_id": item.investor_file_id})
    }

    const OnchangePickerSeleteGenderdHandler = (value, index) => {
        setMemberDetail({ ...memberDetail, selectedGender:value })
    }

    const OnchangePickerMemberdHandler = (value, index) => {
        
        setMemberDetail({ ...memberDetail, selectMember_type: value})
    }

    const upDateTextInput = (field, val) => {
        setMemberDetail({ ...memberDetail, [field]: val });
    }
    

    const searchInvest = async () => {
        let tempArray = []
        setSearchInfo([])
        if (value !== "") {
            setSearchLoading(true)
            const response = await requestApi.searchInvestments(value)
            // console.log("typeof ", typeof response.data.result)
            // console.log("resposdsdnse",response.data)
            setSearchLoading(false)
            if(response && response.data && response.data.result.length > 0 && typeof response.data.result == "string"){
               Alert.alert("Attention","No open files found against this investment")
               setSearchInfo([])
            }
            else 
            if (response && response.data && response.data.result.length > 0 && typeof response.data.result == "object") {
                response.data.result.map((item,index)=>{
                    tempArray.push({
                        checked:false,
                        investor_file_id:item.investor_file_id,
                        inventory_id:item.inventory_id,
                        category_id:item.category_id,
                        size_id:item.size_id,
                        unit_category_type_id:item.unit_category_type_id
                    })
                   })
    
                setSearchInfo(tempArray)
            }
            // else if (response.ok && result.error) {
            //     alert(result.error)
            // } 
            else {
                // console.log("Error in getting data")
            }
        }else {
            Alert.alert("PLease Select Investment")
        }
        
    }


    const hiddenModal=()=>{
        setSendRequest(false)
      setMemberDetail({...memberDetail, member_name: null,
        member_type: [{ "id": "person", "value": "Individual" },{ "id": "company", "value": "Company" }, { "id": "aop", "value": "Joint Owner" }],
          cnic: null,
          mobile: null,
          email: null,
          gender: [{ "id": "male", "value": "Male" }, { "id": "female", "value": "Female" }],
          selectedGender: "male",
          selectMember_type: "person",
          father_name: null})
          setModel(false)
         
  }

    const postRequest = async () => {
        // console.log(mobileRex.test(memberDetail.mobile))
        setSendRequest(true)
        if (memberDetail.email && memberDetail.mobile && memberDetail.cnic && memberDetail.member_name && emailRex.test(memberDetail.email) && member_regux.test(memberDetail.member_name) && member_regux.test(memberDetail.father_name) && memberDetail.cnic.trim().length==15 && memberDetail.mobile.trim().length==12) {
            let member_data = {
               member_name: memberDetail.member_name,
               father_name: memberDetail.father_name,
               cnic: memberDetail.cnic,
               mobile: memberDetail.mobile,
               gender: memberDetail.selectedGender,
               member_type: memberDetail.selectMember_type,
               email: memberDetail.email
            }
            setLoading(true);
            //  console.log("member_data",member_data)
            //  console.log("value",value)
            const response = await requestApi.postInvestment(value, params,member_data)
            console.log("postRequestResponse",response.data.result)
            var requestResponse = JSON.parse(response.data.result)
            // console.log("requestResponse",requestResponse)
            // console.log("requestResponseOTP",requestResponse.is_otp)
            // console.log("requestResponseOTPID",requestResponse.request_id)
            setLoading(false);
            if (response && requestResponse.is_otp == true) {
                // console.log("otp is true")
                setOtpID(requestResponse.request_id)
                // Alert.alert("Please Enter the OTP sent to your number")
                setOTPModel(true)
                // navigation.navigate('Request History')
            } else if (response && requestResponse.request == "Fails"){
                Alert.alert(requestResponse.message)
            }
        // }
    
    
    }
    
}

    const handleSendOTP = async () => {
        setLoading(true);
        const response = await requestApi.postOTP(otp, otpID)
        // console.log("handleSendOTPResponse",response.data.result)
        // var handleSendOTPrequestResponse = JSON.parse(response.data.result)
        // console.log("handleSendOTP",handleSendOTPrequestResponse)
        // console.log("requestResponseOTP",handleSendOTPrequestResponse.request)
        setLoading(false);
        if(response && response.data && response.data.result){
            // console.log("handleSendOTPResponse",response.data.result)
            var handleSendOTPrequestResponse = JSON.parse(response.data.result)
            // console.log("handleSendOTP",handleSendOTPrequestResponse)
            // console.log("requestResponseOTP",handleSendOTPrequestResponse.request)
            if(handleSendOTPrequestResponse.request == "Success"){
                Alert.alert("Congratulations","Your Request has been Generated Successfully")
                navigation.navigate('Request History')
                setOTPModel(false)
            }
        }
        else if (response && response.data && response.data.error && response.data.error.code && response.data.error.code == 200) {
            console.log("respoonse",response)
            console.log("handleSendOTPResponse",response.data.error)
            // var handleSendOTPrequestResponse = JSON.parse(response.data.error)
            // console.log("handleSendOTP",handleSendOTPrequestResponse)
            // console.log("requestResponseOTP",handleSendOTPrequestResponse.code)
            // if(handleSendOTPrequestResponse.code == 200){
            Alert.alert("Attention", "OTP Entered is incorrect")
                // navigation.navigate('Available Files')
                // setOTPModel(false)
            // }
        }
    }

    const handleOTPModelClose = () => {
        setOtp('')
        setOTPModel(false)
    }

    const onChangeValue = (value,index) =>{
       
        const newData = [...searchInfo];
        newData[index].checked =value
        let filterArray = newData.filter(item=>{
            return  item.checked == true
        })
        setSelected(filterArray)
        setSearchInfo(newData);
    }

    const OnchangePickerSeletedHandler = (value,index) =>{
        setValue(value)
        setInvestID(requestInfo[index].sector_name)

    }

    // console.log("value",value)


    // useEffect(() => {
    //     setTimeout(() => {
    //         useAuth().logOut();
    //         setUser(null);
    //     }, 300000);
    // }, []);
 
    
    return (
        <View style={styles.screen}>
            {/* <View style={styles.header}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Request History')}>
                    <Icon name="chevron-left" color="white" size={25} />
                </TouchableOpacity>
                <Text style={styles.headerText}>New Request</Text>
                </View>
                <Image
                    source={require('../assets/images/icons8-user-100.png')}
                    style={{width:30,height:40,alignSelf:'flex-end'}}
                    resizeMode="contain"
                />
            </View> */}
            <Header
                name="New Request"
                onPress={() => navigation.navigate('Request History')}
            />
            <View style={{borderBottomWidth:0.5,borderColor:"grey"}}/>

            <Text style={styles.requestText}>
                Request ID/
            </Text>
            <ScrollView nestedScrollEnabled={true} >
            <View style={{
                width:'90%',
                alignSelf:'center',
                marginBottom:10
            }}>
                <Text style={styles.secondText}>Request Type</Text>
            </View>
            <View style={styles.inputText}>
                <TextInput
                    placeholder="Issued"
                    placeholderTextColor="#788190"
                />
                <Icon
                    name="user-plus"
                    color="#788190"
                    style={{marginRight:10}}
                />
            </View>

            <View style={{
                width:'90%',
                alignSelf:'center'
            }}>
                <Text style={styles.secondText}>Investment No</Text>
            </View>
            {/* <View style={styles.inputText}>
                <Text style={styles.dataText}>{requestInfo.investment_name}</Text>
            </View> */}
            <Picker
             
                selectedValue={value}
                onValueChange={(itemValue, itemIndex) =>OnchangePickerSeletedHandler(itemValue,itemIndex)}
                itemStyle={{color:"white"}}
               
                // style={styles.inputText}
            >
                    
                {
                    requestInfo.map((item, index) =>{
                        return(
                            <Picker.Item label={item.investment_name} value={item.investment_id}/>
                        )
                    })
                }
            </Picker>


           

            <View style={{
                width:'90%',
                alignSelf:'center'
            }}>
                <Text style={styles.secondText}>Sector</Text>
            </View>
            <View style={styles.inputText}>
                <Text style={styles.dataText}>{investID}</Text>
            </View>
            
        
            <View style={{
                width:'90%',
                alignSelf:'center'
            }}>
                <Text style={styles.secondText}>Investor Name</Text>
            </View>
            <View style={styles.inputText}>
                <Text style={styles.dataText}>{investorName}</Text>
            </View>
            
            <TouchableOpacity style={styles.searchButton} onPress={searchInvest}>
                {searchLoading?
                    <ActivityIndicator size="large" color="white" />
                    :
                    <Text style={styles.buttonText}>Search</Text>
                }   
            </TouchableOpacity>

            <View style={styles.detailText}>
                <Text style={{fontSize:RFValue(20),color:'white',marginVertical:10,fontWeight:'900',letterSpacing:1}}>
                    Details
                </Text> 
            </View>
            
            
            <View style={styles.detailsContainer}>
            {!loading?
                <View style={styles.tableHead}>
                    <View style={styles.tableCell}><Text style={styles.tableText}>Check</Text></View>
                    <View style={styles.tableCell1}><Text style={styles.tableText}>Plot No</Text></View>
                    <View style={styles.tableCell1}><Text style={styles.tableText}>Category</Text></View>
                    <View style={styles.tableCell}><Text style={styles.tableText}>Size</Text></View>
                    <View style={styles.tableCell}><Text style={styles.tableText}>Product</Text></View>
                </View>:null}
           
                    {searchInfo && searchInfo.length>0 && searchInfo.map((item,index)=>{
                    return (

                        <View style={styles.tableHead}>
                        <View style={styles.tableCell}>
                        <CheckBox
                            disabled={false}
                            value={item.checked}
                            // style={styles.checkBox}
                            tintColors={{true: '#433F5A', false: '#433F5A'}}
                            onValueChange={(newValue) => onChangeValue(newValue,index)}
                        />
                        </View>
                        <View style={styles.tableCell1}><Text  style={styles.tableText}>{item.inventory_id}</Text></View>
                        <View style={styles.tableCell1}><Text  style={styles.tableText}>{item.category_id}</Text></View>
                        <View style={styles.tableCell}><Text  style={styles.tableText}>{item.size_id}</Text></View>
                        <View style={styles.tableCell}><Text  style={styles.tableText}>{item.unit_category_type_id}</Text></View>
                    </View>
                        
                    )
                  })}
            </View>
            </ScrollView>

            {
               (params.length > 0 ) ? 
                <TouchableOpacity style={styles.searchButton} onPress={()=>setModel(true)}>
                    {loading?
                    <ActivityIndicator size="large" color="white" />:
                        <Text style={styles.buttonText}>CREATE REQUEST</Text>}
                </TouchableOpacity>: null
            }
            <Modal isVisible={showModel} style={{ backgroundColor: "white" }}>
                <View style={{ flex: 1, backgroundColor: "white" }}>
                    <ScrollView>
                        <View style={{ paddingRight: 10, paddingLeft: 10, }} >
                        <Text style={{color:"#003163",marginTop:10}}>Member Name</Text>
                            <View style={{ paddingLeft: 10, paddingRight: 10 }} style={{ borderWidth: 0.5, borderColor: "grey", padding: 2, marginTop: 10 }}>
                                 
                                <TextInput
                                    placeholder={"Member Name"}
                                    
                                    value={memberDetail.member_name}
                                    style={{ padding: Platform.OS === 'ios' ? 10 : 10, width: "100%" }}
                                    onChangeText={(val) => upDateTextInput("member_name", val)}
                                />
                            </View>
                            <Text style={{ marginTop: 5, color: "red" }}>{!memberDetail.member_name && sendRequest?"Please Enter Member Name":""}</Text>
                            <Text style={{color: "red" }}>{memberDetail.member_name && sendRequest &&!member_regux.test(memberDetail.member_name)?"Memeber Name Should be Alphabet":""}</Text>
                            <Text style={{color:"#003163",marginTop:5}}>Father Name</Text>
                            <View style={{ paddingLeft: 10, paddingRight: 10 }} style={{ borderWidth: 0.5, borderColor: "grey", padding: 2, marginTop: 20 }}>
                                <TextInput
                                    placeholder={"Father Name"}
                                    value={memberDetail.father_name}
                                    style={{ padding: Platform.OS === 'ios' ? 10 : 10, width: "100%" }}
                                    onChangeText={(val) => upDateTextInput("father_name", val)}
                                />
                            </View>
                            <Text style={{ marginTop: 5, color: "red" }}>{!memberDetail.father_name && sendRequest?"Please Enter Father Name":""}</Text>
                            <Text style={{color: "red" }}>{memberDetail.father_name && sendRequest &&!member_regux.test(memberDetail.father_name)?"Father Name Should be Alphabet":""}</Text>
                            <Text style={{color:"#003163",marginTop:5}}>Mobile Number</Text>
                            <View style={{ paddingLeft: 10, paddingVertical: 20, paddingRight: 10 }} style={{ borderWidth: 0.5, borderColor: "grey", padding: 2, marginTop: 20 }}>

                                <MaskedTextInput
                                    keyboardType="number-pad"
                                    placeholder="Mobile Number"
                                    mask="0399-9999999"
                                    value={memberDetail.mobile}
                                    onChangeText={(val) => upDateTextInput("mobile", val)}
                                    style={{ height: 44, padding: 10, width: "100%", }}

                                />

                            </View>
                            <Text style={{ marginTop: 5, color: "red" }}>{!memberDetail.mobile && sendRequest?"Please Enter Mobile Number":""}</Text>
                            <Text style={{ marginTop: 5, color: "red" }}>{memberDetail.mobile && memberDetail.mobile.trim().length<12?"please Enter Valid Number":""}</Text>

                            <Text style={{color:"#003163",marginTop:5}}>Email</Text>
                            <View style={{ paddingLeft: 10, paddingRight: 10 }} style={{ borderWidth: 0.5, borderColor: "grey", padding: 2, marginTop: 20 }}>
                                <TextInput
                                   
                                    placeholder={"Email"}
                                    value={memberDetail.email}
                                    style={{ padding: Platform.OS === 'ios' ? 10 : 10 }}
                                    onChangeText={(val) => upDateTextInput("email", val)}
                                />
                            </View>
                            <Text style={{ marginTop: 5, color: "red" }}>{!memberDetail.email && sendRequest ? "Please Enter Email":""}</Text>
                            <Text style={{color: "red" }}>{memberDetail.email && sendRequest &&!emailRex.test(memberDetail.email)?"Please Enter Valid Email":""}</Text>
                            <Text style={{color:"#003163",marginTop:5}}>CNIC</Text>
                            <View style={{ paddingLeft: 10, paddingRight: 10 }} style={{ borderWidth: 0.5, borderColor: "grey", padding: 2, marginTop: 20 }}>
                                <MaskedTextInput
                                    keyboardType="number-pad"
                                    placeholder="CNIC"
                                    mask="99999-9999999-9"
                                    value={memberDetail.cnic}
                                    onChangeText={(val) => upDateTextInput("cnic", val)}
                                    style={{ height: 44, padding: 5, width: "100%", }}

                                />
                            </View>
                            <Text style={{ marginTop: 5, color: "red" }}>{!memberDetail.cnic && sendRequest?"Please Enter CNIC":""}</Text>
                            <Text style={{ marginTop: 5, color: "red" }}>{memberDetail.cnic && memberDetail.cnic.trim().length<15?"please Enter Valid CNIC":""}</Text>
                            <Text style={{color:"#003163",marginTop:5}}>Gender</Text>
                            <View style={{ paddingLeft: 10, paddingRight: 10 }} style={{ borderWidth: 0.5, borderColor: "grey", padding: 2, marginTop: 20 }}>
                                <Picker
                                    selectedValue={memberDetail.selectedGender}
                                    onValueChange={(itemValue, itemIndex) => OnchangePickerSeleteGenderdHandler(itemValue, itemIndex)}
                                    itemStyle={{ color: "black" }}
                                    style={{ color: "black" }}
                                >
                                    {
                                        memberDetail.gender.map((item, index) => {
                                            return (
                                                <Picker.Item label={item.value} value={item.id} />
                                            )
                                        })
                                    }
                                </Picker>
                            </View>
                            <Text style={{color:"#003163",marginTop:5}}>Member Type</Text>

                            <View style={{ paddingLeft: 10, paddingRight: 10, marginTop: 10 }} style={{ borderWidth: 0.5, borderColor: "grey", padding: 2, marginTop: 20 }}>
                                <Picker
                                    selectedValue={memberDetail.selectMember_type}
                                    onValueChange={(itemValue, itemIndex) => OnchangePickerMemberdHandler(itemValue, itemIndex)}
                                    itemStyle={{ color: "white" }}
                                    itemStyle={{ color: "black" }}
                                >
                                    {
                                        memberDetail.member_type.map((item, index) => {
                                            return (
                                                <Picker.Item label={item.value} value={item.id} />
                                            )
                                        })
                                    }
                                </Picker>
                            </View>
                            <View style={{ flexDirection: "row", flex: 1, alignItems: "center", marginTop: 20 }}>
                                <TouchableOpacity style={{
                                    backgroundColor: "grey",
                                    flex: 0.5,
                                    alignSelf: 'center',
                                    borderRadius: 10,
                                    padding: 15,
                                    alignItems: "center",
                                    marginVertical: 10
                                }} onPress={() => hiddenModal()}>
                                    {loading ?
                                        <ActivityIndicator size="large" color="white" /> :
                                        <Text style={{ color: "white" }}>CLOSE</Text>}
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    backgroundColor: Colors.secondary,
                                    flex: 0.5,
                                    alignSelf: 'center',
                                    borderRadius: 10,
                                    padding: 15,
                                    marginLeft: 5,
                                    alignItems: "center",
                                    marginVertical: 10
                                }} onPress={() => postRequest()}>
                                    {loading?
                                        <ActivityIndicator size="large" color="white" /> :
                                        <Text style={{ color: "white" }}>CREATE REQUEST</Text>}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>

            </Modal>

            <Modal isVisible={showOTPModel} style={{ backgroundColor: "white" }}>
                <View style={{ flex: 1, backgroundColor: "white" }}>
                    <Text style={{
                        alignSelf:'center',
                        fontSize:20,
                        fontWeight:'900',
                        color:Colors.primary,
                        marginTop:15
                        }}
                    >
                        Pleaser Enter OTP
                    </Text>
                    <View style={{width:'90%',alignSelf:'center',marginVertical:'25%',borderColor:'#ccc',borderWidth:1,borderRadius:6}}>
                        <TextInput
                            value={otp}
                            onChangeText={(text) => setOtp(text)}
                            maxLength={5}
                            keyboardType="number-pad"
                            textAlign="center"
                        />
                    </View>
                    <Text style={{ marginTop: 15, color: "red",alignSelf:'center' }}>{otp && otp.trim().length<5?"Please Enter Valid OTP":""}</Text>
                    <View style={styles.otpButtonContainer}>
                    <TouchableOpacity 
                        style={{
                            width:'45%',
                            alignSelf:'center',
                            padding:10,
                            borderColor:Colors.secondary,
                            borderWidth:1,
                            borderRadius:5,
                            backgroundColor:'white'
                        }}
                        onPress={()=>handleOTPModelClose()}
                    >
                        <Text style={{
                            alignSelf:'center',
                            color:Colors.primary,
                            fontWeight:'900'
                        }}>Cancel</Text>
                    </TouchableOpacity>
                    {
                        (otp.length == 5) ? 
                            <TouchableOpacity 
                                onPress={()=>handleSendOTP()}
                                style={{
                                    // borderWidth:1,
                                    // borderColor:'green',
                                    width:'45%',
                                    alignSelf:'center',
                                    padding:10,
                                    backgroundColor:Colors.secondary,
                                    borderRadius:5
                                }}
                            >
                                {loading?
                                    <ActivityIndicator size="large" color="white" /> :
                                    <Text style={{
                                        alignSelf:'center',
                                        color:'white',
                                        fontWeight:'900'
                                    }}>Send OTP</Text>
                                }
                            </TouchableOpacity>
                        : null
                    }
                    </View>
                    
                </View>
            </Modal>


        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex:1,
        backgroundColor: Colors.primary
    },
    header: {
        // borderWidth:1,
        // borderColor:'red',
        width:'95%',
        alignSelf:'center',
        marginTop:10,
        padding:5,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        elevation:5,
        shadowOpacity:0.26,
        shadowRadius:6,
        shadowColor:'black',
        shadowOffset:{
            width:0, height:2
        },
        shadowRadius:6,
    },
    headerText:{
        fontSize:RFValue(22),
        color:'white',
        fontWeight:'900'
    },
    headerIcon: {
        marginRight:10
    },
    headerImage:{
        width:30,
        height:40,
        alignSelf:'flex-end',
        alignItems:'center',
        alignContent:'flex-end'
    },
    requestText: {
        color: '#FF9E2D',
        fontSize:RFValue(15),
        alignSelf:'flex-end',
        marginRight:15,
        marginTop:15
    },
    inputText: {
        flexDirection:'row',
        // borderColor:'red',
        // borderWidth:1,
        alignItems:'center',
        justifyContent:'space-between',
        padding:5,
        width:'90%',
        alignSelf:'center',
        borderRadius:15,
        backgroundColor:'white'
    },
    searchButton: {
        backgroundColor:Colors.secondary,
        width:'90%',
        alignSelf:'center',
        borderRadius:10,
        padding:10,
        marginVertical:15
    },
    buttonText:{
        color:'white',
        fontSize:RFValue(18),
        alignSelf:'center',
        fontWeight:'bold'
    },
    placeholderText: {
        // borderColor: 'gold', 
        // borderWidth: 1, 
        marginBottom:5,
        height:35,
        backgroundColor:'white',
        width:'90%',
        alignSelf:'center'
        // elevation:5,
        // shadowOpacity:0.26,
        // shadowRadius:6,
        // shadowColor:'black',
        // shadowOffset:{
        //     width:0, height:2
        // },
        // shadowRadius:6,
    },
    secondText:{
        marginTop:20,
        color:'white',
        fontSize:15,
        fontWeight:'bold',
        marginBottom:10
    },
    dataText:{
        // marginTop:20,
        color:'#788190',
        fontSize:15,
        fontWeight:'bold',
        margin:10
        // marginBottom:10
    },
    detailText:{
        width:'90%',
        alignSelf:'center',
        marginVertical:10
    },
    detailsContainer: {
        width:'95%',
        alignSelf:'center',
        // flexDirection:'row'
        // borderColor:'red',
        // borderWidth:1,
        borderRadius:8,
        overflow:'hidden',
        marginBottom:10
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
        fontWeight:'bold',
        fontSize: RFValue(12)
    },
    otpButtonContainer:{
        width:'95%',
        alignSelf:'center',
        // borderWidth:1,
        // borderColor:'red',
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:15
    }
})
