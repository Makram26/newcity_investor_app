import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Alert, FlatList, TextInput, Platform } from 'react-native'

import requestApi from '../api/investor'
import Colors from '../constants/Colors'
import { RFValue } from "react-native-responsive-fontsize";

import AuthContext from '../auth/context';
import useAuth from '../auth/useAuth';
import { MaskedTextInput } from "react-native-mask-text";
import Icon from 'react-native-vector-icons/MaterialIcons'
import Modal from "react-native-modal";
import { Picker } from '@react-native-picker/picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { State } from 'react-native-gesture-handler';

import Header from '../components/Header';

const member_regux = /^[a-zA-Z\s]*$/
const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const mobileRex = /^((0))(3)([0-9]{9})$/
export default function AvailableFilesDetails({ route, navigation }) {

    const order = route.params;

    const [loading, setLoading] = useState(false)
    const [filesDetails, setFilesDetails] = useState([order])
    const [investID, setInvestID] = useState(null)
    const [showModel, setModel] = useState(false);
    const [sendRequest,setSendRequest] = useState(false)
    const [memberDetail, setMemberDetail] = useState({
        member_name: null,
        member_type: [ { "id": "person", "value": "Individual" },{ "id": "company", "value": "Company" }, { "id": "aop", "value": "Joint Owner" }],
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

    const [searchInfo, setSearchInfo] = useState([])
    const [select, setSelected] = useState([])

    const { user, setUser } = useContext(AuthContext);

    const [showOTPModel, setOTPModel] = useState(false);
    const [otpID, setOtpID] =useState('')
    const [otp, setOtp] = useState('')

    useEffect(() => {
        var tempArray = []
        if (filesDetails && filesDetails.length > 0) {
            setInvestID(filesDetails[0].investment_id)
            filesDetails.map((item, index) => {
                order.open_files.map((item) => {
                    tempArray.push({
                        checked: false,
                        investor_file_id: item.investor_file_id,
                        inventory_id: item.inventory_id,
                        unit_category_type_id: item.unit_category_type_id,
                        sector_id: item.sector_id,
                        size:item.size_id
                        // street: item.street
                    })
                })

            })
            setSearchInfo(tempArray)
        }
        else {
            // console.log("error in getting data")
            return setErrors(true)
        }

    }, [])

    var params = []
    for (var i = 0; i < select.length; i++) {
        var item = select[i];
        params.push({ "check": item.checked, "investor_file_id": item.investor_file_id })
    }
    const OnchangePickerSeletedHandler = (value, index) => {
        setMemberDetail({ ...memberDetail, selectedGender:value })
    }

    const OnchangePickerMemberdHandler = (value, index) => {
        
        setMemberDetail({ ...memberDetail, selectMember_type: value})
    }

    const handleOTPModelClose = () => {
        setOtp('')
        setOTPModel(false)
    }

    // const validationForm = ()=>{
    //          if(!memberDetail.member_name){
    //         setErrors({ ...errors,error_member_name: "Please Enter Member Name" })
    //          }
    //           if(!memberDetail.father_name){
    //             setErrors({ ...errors,error_father_name: "Please Enter Father Name" })
    //          }
    //          else if(!memberDetail.email){
    //             setErrors({ ...errors,error_email: "Please Enter Email" }) 
    //          }   
    // }


    const postRequest = async () => {
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
            const response = await requestApi.postInvestment(investID, params, member_data)
            // console.log("postRequestResponse",response)
            // console.log("postRequestResponse",response.data.result)
            var requestResponse = JSON.parse(response.data.result)
            // console.log("requestResponse",requestResponse)
            // console.log("requestResponseOTP",requestResponse.is_otp)
            // console.log("requestResponseOTPID",requestResponse.request_id)
            setLoading(false);
            if (response && requestResponse.is_otp == true) {
                // console.log("otp is true")
                setOtpID(requestResponse.request_id)
                setOTPModel(true)
                // Alert.alert("Congratulations", "Your Request has been generated successfully")
                // navigation.navigate('Available Files')
            }
            else if (response && requestResponse.request == "Fails"){
                Alert.alert(requestResponse.message)
            }
        }
    }

    const upDateTextInput = (field, val) => {
        setMemberDetail({ ...memberDetail, [field]: val });
    }

    const onChangeValue = (value, index) => {
        const newData = [...searchInfo];
        newData[index].checked = value
        let filterArray = newData.filter(item => {
            return item.checked == true
        })
        setSelected(filterArray)
        // console.log("select", select)
        setSearchInfo(newData);
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

    const handleSendOTP = async () => {
        setLoading(true);
        const response = await requestApi.postOTP(otp, otpID)
        // console.log("respoonse",response)
        // console.log("handleSendOTPResponse",response.data)
        // var handleSendOTPrequestResponse = JSON.parse(response.data)
        // console.log("handleSendOTP",handleSendOTPrequestResponse)
        // console.log("requestResponseOTP",handleSendOTPrequestResponse.result.request)
        setLoading(false);
        if(response && response.data && response.data.result){
            // console.log("respoonse",response)
            // console.log("handleSendOTPResponse",response.data.result)
            var handleSendOTPrequestResponse = JSON.parse(response.data.result)
            // console.log("handleSendOTP",handleSendOTPrequestResponse)
            // console.log("requestResponseOTP",handleSendOTPrequestResponse.request)
            if(handleSendOTPrequestResponse.request == "Success"){
                Alert.alert("Congratulations", "Your Request has been generated successfully")
                navigation.navigate('Available Files')
                setOTPModel(false)
            }
        }
        else if (response && response.data && response.data.error && response.data.error.code && response.data.error.code == 200) {
            // console.log("respoonse",response)
            // console.log("handleSendOTPResponse",response.data.error)
            // var handleSendOTPrequestResponse = JSON.parse(response.data.error)
            // console.log("handleSendOTP",handleSendOTPrequestResponse)
            // console.log("requestResponseOTP",handleSendOTPrequestResponse.code)
            // if(handleSendOTPrequestResponse.code == 200){
            // console.log("Incorrect OTP")
            Alert.alert("Attention", "OTP Entered is incorrect")
                // navigation.navigate('Available Files')
                // setOTPModel(false)
            // }
        }
    }

    // useEffect(() => {
    //     setTimeout(() => {
    //         useAuth().logOut();
    //         setUser(null);
    //     }, 300000);
    // }, []);

    return (
        <ScrollView style={{ backgroundColor: Colors.primary }}>
            <View style={styles.screen}>
                <Header
                    name="Available File Details"
                    onPress={() => navigation.goBack()}
                />

                <View style={{ borderBottomWidth: 0.5, borderColor: "grey" }} />
                <View style={styles.detailsContainer}>

                    <View style={styles.tableHead}>
                        <View style={styles.tableHCell1}><Text style={styles.tableHText}>Plot No</Text></View>
                        <View style={styles.tableHCell}><Text style={styles.tableHText}>Product</Text></View>
                        <View style={styles.tableHCell}><Text style={styles.tableHText}>Sector</Text></View>
                        <View style={styles.tableHCell}><Text style={styles.tableHText}>Size</Text></View>
                        <View style={styles.tableHCell}><Text style={styles.tableHText}>Check</Text></View>

                    </View>
                    <ScrollView>
                        {searchInfo.length > 0 && searchInfo.map((item, index) =>
                            <View style={styles.tableHead}>
                                <View style={styles.tableCell1}><Text style={styles.tableText}>{item.inventory_id}</Text></View>
                                <View style={styles.tableCell}><Text style={styles.tableText}>{item.unit_category_type_id}</Text></View>
                                <View style={styles.tableCell}><Text style={styles.tableText}>{item.sector_id}</Text></View>
                                <View style={styles.tableCell}><Text style={styles.tableText}>{item.size}</Text></View>
                                <View style={styles.tableCell}>
                                    <TouchableOpacity style={{ width: 25, height: 25, borderWidth: 1, borderColor: "grey", alignItems: "center", justifyContent: "center" }}
                                        onPress={() => {
                                            onChangeValue(item.checked ? false : true, index)
                                        }}
                                    >
                                        {item.checked == true ?
                                            <AntDesign name="check" style={{ color: "blue" }} /> : null}
                                    </TouchableOpacity>
                                </View>

                            </View>


                        )}

                    </ScrollView>
                </View>
                {
                    (params.length > 0) ?
                        <TouchableOpacity style={styles.searchButton} onPress={() => setModel(true)}>
                            {loading?
                                <ActivityIndicator size="large" color="white" /> :
                                <Text style={styles.buttonText}>CREATE REQUEST</Text>}
                        </TouchableOpacity> : null
                }
                <View style={{ marginVertical: 20 }}></View>
            </View>

            {/* Member Details Form */}
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
                                    onValueChange={(itemValue, itemIndex) => OnchangePickerSeletedHandler(itemValue, itemIndex)}
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

            {/* OTP Modal Form */}
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
                                borderColor:Colors.primary,
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
                            }}>Close</Text>
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


     </ScrollView>
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
        padding: 5,
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
        flex: 0.5,
        marginVertical: 10
    },
    detailsContainer: {
        width: '95%',
        alignSelf: 'center',
        // flexDirection:'row'
        // borderColor:'red',
        // borderWidth:1,
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 15
    },
    tableHead: {
        // borderColor:'black',
        // borderWidth:1,
        // marginTop:50,
        // padding:2,
        // width:'95%',
        // alignSelf:'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    tableCell: {
        borderWidth: 0.5,
        borderColor: 'black',
        padding: 5,
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent:'center'
    },
    tableCell1: {
        borderWidth: 0.5,
        borderColor: 'black',
        padding: 5,
        flex: 1.5,
        textAlign: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent:'center'
    },
    tableText: {
        color: 'black',
        fontWeight: '900',
        fontSize: RFValue(12)
    },
    tableHCell: {
        borderWidth: 0.5,
        borderColor: 'black',
        padding: 5,
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        backgroundColor: "white",
        
    },
    tableHCell1: {
        borderWidth: 0.5,
        borderColor: 'black',
        padding: 5,
        flex: 1.5,
        textAlign: 'center',
        alignItems: 'center',
        backgroundColor: "white"
    },
    tableHText: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: RFValue(14)
    },
    searchButton: {
        backgroundColor: Colors.secondary,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 10,
        padding: 10,
        marginVertical: 15
    },
    buttonText: {
        color: 'white',
        fontSize: RFValue(18),
        alignSelf: 'center',
        fontWeight: 'bold'
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
