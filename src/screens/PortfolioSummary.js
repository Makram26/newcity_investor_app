import React, { useEffect, useState, useContext } from 'react'
import {
    StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ActivityIndicator,
    RefreshControl, Alert, ScrollView, TextInput
} from 'react-native'

import Colors from '../constants/Colors'
import ReloadButton from '../components/Button/ReloadButton'
import FilesCard from '../components/Card/FilesCard'
import { MaskedTextInput } from "react-native-mask-text";
import { Picker } from '@react-native-picker/picker';
import AuthContext from '../auth/context';
import useAuth from '../auth/useAuth';
import Modal from "react-native-modal";
import CheckBox from '@react-native-community/checkbox';
import { RFValue } from "react-native-responsive-fontsize";

import Icon from 'react-native-vector-icons/FontAwesome5'
import Header from '../components/Header'

import requestApi from '../api/investor'
const member_regux = /^[a-zA-Z\s]*$/
const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const mobileRex = /^((0))(3)([0-9]{9})$/
export default function PortfolioSummary({ route, navigation }) {
    const [fileData, SetFileData] = useState([])
    const [investID, SetInvestID] = useState(null)
    const [loading, SetLoading] = useState(false)
    const [errors, setErrors] = useState(false)
    const [refreshing, setRefreshing] = useState(false);

    const { user, setUser } = useContext(AuthContext);

    const [loadingw, setLoading] = useState(false)
    const [showModel, setModel] = useState(false)
    const [searchInfo, setSearchInfo] = useState([])
    const [select, setSelected] = useState([])
    const [sendRequest, setSendRequest] = useState(false)

    const [showOTPModel, setOTPModel] = useState(false);
    const [otpID, setOtpID] = useState('')
    const [otp, setOtp] = useState('')

    const [memberDetail, setMemberDetail] = useState({
        member_name: null,
        member_type: [{ "id": "person", "value": "Individual" }, { "id": "company", "value": "Company" }, { "id": "aop", "value": "Joint Owner" }],
        cnic: null,
        mobile: null,
        email: null,
        gender: [{ "id": "male", "value": "Male" }, { "id": "female", "value": "Female" }],
        selectedGender: "male",
        selectMember_type: "person",
        father_name: null
    })


    const order = route.params;
    // console.log("order",order)


    useEffect(() => {
        loadPortfolioSummary()
    }, [])

    const loadPortfolioSummary = async () => {
        let tempArray = []
        SetLoading(true)
        SetFileData([]);
        const response = await requestApi.searchSummary(order);
        SetLoading(false)
        if (response.ok && response.data && response.data.result) {
            SetFileData(response.data.result)
            // console.log("portfolio",response.data.result)
            SetInvestID(response.data.result[0].investment_id)
            setErrors(false)

            response.data.result.map((item, index) => {
                item.inventory_data.map((item) => {
                    tempArray.push({
                        checked: false,
                        investor_file_id: item.investor_file_id,
                        plot_no: item.plot_no,
                        product: item.product,
                        state: item.state,
                        size: item.size
                    })
                })

            })

            setSearchInfo(tempArray)
        }
        else {
            // console.log("error in getting data")
            return setErrors(true)
        }
    }

    // useEffect(() => {
    //     setTimeout(() => {
    //       useAuth().logOut();
    //       setUser(null);
    //     }, 300000);
    // }, []);

    var params = []
    for (var i = 0; i < select.length; i++) {
        var item = select[i];
        params.push({ "check": item.checked, "investor_file_id": item.investor_file_id })

    }

    const postRequest = async () => {
        setSendRequest(true)
        if (memberDetail.email && memberDetail.mobile && memberDetail.cnic && memberDetail.member_name && emailRex.test(memberDetail.email) && member_regux.test(memberDetail.member_name) && member_regux.test(memberDetail.father_name) && memberDetail.cnic.trim().length == 15 && memberDetail.mobile.trim().length == 12) {
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
            // console.log(investID,params)
            const response = await requestApi.postInvestment(investID, params, member_data)
            // console.log("postRequestResponse",response)
            // console.log("postRequestResponse",response.data.result)
            var requestResponse = JSON.parse(response.data.result)
            // console.log("requestResponse",requestResponse)
            // console.log("requestResponseOTP",requestResponse.is_otp)
            // console.log("requestResponseOTPID",requestResponse.request_id)
            setLoading(false);
            if (response && requestResponse.is_otp == true) {
                // console.log(response)
                // // console.log("Posted Successfully")
                // Alert.alert("Congratulations","Your Request has been generated successfully")
                // navigation.navigate('Dashboard')
                // console.log("otp is true")
                setOtpID(requestResponse.request_id)
                setOTPModel(true)
            } else if (response && requestResponse.request == "Fails") {
                Alert.alert(requestResponse.message)
            }
        }

        // }
    }

    const handleSendOTP = async () => {
        setLoading(true);
        const response = await requestApi.postOTP(otp, otpID)
        // console.log("handleSendOTPResponse",response.data.result)
        // var handleSendOTPrequestResponse = JSON.parse(response.data.result)
        // console.log("handleSendOTP",handleSendOTPrequestResponse)
        // console.log("requestResponseOTP",handleSendOTPrequestResponse.request)
        setLoading(false);
        if (response && response.data && response.data.result) {
            // console.log("handleSendOTPResponse",response.data.result)
            var handleSendOTPrequestResponse = JSON.parse(response.data.result)
            // console.log("handleSendOTP",handleSendOTPrequestResponse)
            // console.log("requestResponseOTP",handleSendOTPrequestResponse.request)
            if (handleSendOTPrequestResponse.request == "Success") {
                Alert.alert("Congratulations", "Your Request has been Generated Successfully")
                navigation.navigate('Dashboard')
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
            Alert.alert("Attention", "OTP Entered is incorrect")
            // navigation.navigate('Available Files')
            // setOTPModel(false)
            // }
        }
        // if (response.ok && handleSendOTPrequestResponse.request == "Success") {
        //     Alert.alert("Congratulations","Your Request has been Generated Successfully")
        //     navigation.navigate('Dashboard')
        //     setOTPModel(false)
        // } else {
        //     console.log("Error in posting data")
        // }
    }

    const hiddenModal = () => {
        setSendRequest(false)
        setMemberDetail({
            ...memberDetail, member_name: null,
            member_type: [{ "id": "person", "value": "Individual" }, { "id": "company", "value": "Company" }, { "id": "aop", "value": "Joint Owner" }],
            cnic: null,
            mobile: null,
            email: null,
            gender: [{ "id": "male", "value": "Male" }, { "id": "female", "value": "Female" }],
            selectedGender: "male",
            selectMember_type: "person",
            father_name: null
        })
        setModel(false)
    }

    const handleOTPModelClose = () => {
        setOtp('')
        setOTPModel(false)
    }

    // console.log("searchInfo", searchInfo)

    const onChangeValue = (value, index) => {

        const newData = [...searchInfo];
        newData[index].checked = value
        let filterArray = newData.filter(item => {
            return item.checked == true
        })
        // console.log("filterArray",filterArray)
        setSelected(filterArray)
        setSearchInfo(newData);
    }

    const OnchangePickerSeletedHandler = (value, index) => {
        setMemberDetail({ ...memberDetail, selectedGender: value })
    }

    const OnchangePickerMemberdHandler = (value, index) => {
        // console.log("val",value)
        setMemberDetail({ ...memberDetail, selectMember_type: value })
    }

    const upDateTextInput = (field, val) => {
        setMemberDetail({ ...memberDetail, [field]: val });
    }

    return (
        <View style={styles.screen}>
            <Header
                onPress={() => navigation.goBack()}
                name="Summary Details"
            />
            <View style={{ borderBottomWidth: 0.5, borderColor: "grey" }} />

            {errors && (<>
                <Text style={styles.errorText}>Couldn't retrive Files</Text>
                <ReloadButton onPress={loadPortfolioSummary} />
            </>)}
            <FlatList
                data={fileData}
                keyExtractor={(stock) => stock.id}
                renderItem={({ item }) => {
                    return (
                        <View>
                            <View style={{ width: '95%', alignSelf: 'center', marginTop: 10 }}>
                                <Text style={{ fontSize: RFValue(17), fontWeight: 'bold', color: 'white' }}>{item.investment_no}</Text>
                            </View>
                            <View style={styles.cardContainer}>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between", marginTop: 10, flex: 1, alignItems: "center" }}>
                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>Option</Text>
                                        <Text>{item.options}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>Booking</Text>
                                        <Text>{item.reservation_type}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>Category</Text>
                                        <Text>{item.category_id}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between", marginTop: 10, flex: 1, alignItems: "center", width: '90%', alignSelf: 'center' }}>
                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>Phase</Text>
                                        <Text>{item.phase}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>Sector</Text>
                                        <Text>{item.sector}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>Units</Text>
                                        <Text>{item.no_of_units}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between", marginTop: 10, flex: 1, alignItems: "center", }}>
                                    <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: 10 }}>
                                        <Text style={{ fontWeight: 'bold' }}>Due Amount</Text>
                                        <Text>{item.due_amount && item.due_amount ? item.due_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: 20 }}>
                                        <Text style={{ fontWeight: 'bold' }}>Paid Amount</Text>
                                        <Text>{item.paid_amount && item.paid_amount ? item.paid_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: 'bold', }}>Total Amount</Text>
                                        <Text>{item.total_amount && item.total_amount ? item.total_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""}</Text>
                                    </View>
                                </View>
                                {/* <Text style={{fontSize:RFValue(20),color:'#FF9E2D',alignSelf:'center',marginTop:10,flex:1}}>PKR</Text> */}
                            </View>
                            <View style={styles.detailsContainer}>
                                <View style={styles.tableHead}>
                                    <View style={styles.tableHCell1}><Text style={styles.tableHText}>Plot #</Text></View>
                                    <View style={styles.tableHCell}><Text style={styles.tableHText}>Product</Text></View>
                                    <View style={styles.tableHCell}><Text style={styles.tableHText}>Size</Text></View>
                                    <View style={styles.tableHCell1}><Text style={styles.tableHText}>File Status</Text></View>
                                    <View style={styles.tableHCell}><Text style={styles.tableHText}>Check</Text></View>
                                </View>
                                {searchInfo.map((item, index) =>
                                    <View style={styles.tableHead1}>
                                        <View style={styles.tableCell1}><Text style={styles.tableText}>{item.plot_no}</Text></View>
                                        <View style={styles.tableCell}><Text style={styles.tableText}>{item.product}</Text></View>
                                        <View style={styles.tableCell}><Text style={styles.tableText}>{item.size}</Text></View>
                                        <View style={styles.tableCell1}>
                                            {
                                                (item.state == "Available") ?
                                                    <Text style={{
                                                        color: 'green',
                                                        fontWeight: 'bold',
                                                        fontSize: RFValue(13)
                                                    }}>{item.state}</Text>
                                                    :
                                                (item.state == "Issued") ?
                                                    <Text style={{
                                                        color: 'red',
                                                        fontWeight: 'bold',
                                                        fontSize: RFValue(13)
                                                    }}>{item.state}</Text>
                                                    :
                                                (item.state == "In Process") ?
                                                    <Text style={{
                                                        color: '#f2b59a',
                                                        fontWeight: 'bold',
                                                        fontSize: RFValue(12)
                                                    }}>{item.state}</Text>
                                                    :
                                                <Text style={styles.tableText}></Text>
                                            }

                                        </View>
                                        <View style={styles.tableCell}>
                                            {
                                                (item.state == "Available") ?

                                                    <CheckBox
                                                        disabled={false}
                                                        value={item.checked}
                                                        tintColors={{ true: '#433F5A', false: '#433F5A' }}
                                                        onValueChange={(newValue) => onChangeValue(newValue, index)}
                                                    /> : null
                                            }
                                        </View>
                                    </View>

                                )}
                            </View>
                        </View>
                    )
                }}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={loadPortfolioSummary} />}
            />
            {
                (params.length > 0) ?
                    <TouchableOpacity style={styles.searchButton} onPress={() => setModel(true)}>
                        {loadingw ?
                            <ActivityIndicator size="large" color="white" /> :
                            <Text style={styles.buttonText}>CREATE REQUEST</Text>}
                    </TouchableOpacity>
                    : null
            }

            <Modal isVisible={showModel} style={{ backgroundColor: "white" }}>
                <View style={{ flex: 1, backgroundColor: "white" }}>
                    <ScrollView>
                        <View style={{ paddingRight: 10, paddingLeft: 10, }} >
                            <Text style={{ color: "#003163", marginTop: 10 }}>Member Name</Text>
                            <View style={{ paddingLeft: 10, paddingRight: 10 }} style={{ borderWidth: 0.5, borderColor: "grey", padding: 2, marginTop: 10 }}>

                                <TextInput
                                    placeholder={"Member Name"}

                                    value={memberDetail.member_name}
                                    style={{ padding: Platform.OS === 'ios' ? 10 : 10, width: "100%" }}
                                    onChangeText={(val) => upDateTextInput("member_name", val)}
                                />
                            </View>
                            <Text style={{ marginTop: 5, color: "red" }}>{!memberDetail.member_name && sendRequest ? "Please Enter Member Name" : ""}</Text>
                            <Text style={{ color: "red" }}>{memberDetail.member_name && sendRequest && !member_regux.test(memberDetail.member_name) ? "Memeber Name Should be Alphabet" : ""}</Text>
                            <Text style={{ color: "#003163", marginTop: 5 }}>Father Name</Text>
                            <View style={{ paddingLeft: 10, paddingRight: 10 }} style={{ borderWidth: 0.5, borderColor: "grey", padding: 2, marginTop: 20 }}>
                                <TextInput
                                    placeholder={"Father Name"}
                                    value={memberDetail.father_name}
                                    style={{ padding: Platform.OS === 'ios' ? 10 : 10, width: "100%" }}
                                    onChangeText={(val) => upDateTextInput("father_name", val)}
                                />
                            </View>
                            <Text style={{ marginTop: 5, color: "red" }}>{!memberDetail.father_name && sendRequest ? "Please Enter Father Name" : ""}</Text>
                            <Text style={{ color: "red" }}>{memberDetail.father_name && sendRequest && !member_regux.test(memberDetail.father_name) ? "Father Name Should be Alphabet" : ""}</Text>
                            <Text style={{ color: "#003163", marginTop: 5 }}>Mobile Number</Text>
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
                            <Text style={{ marginTop: 5, color: "red" }}>{!memberDetail.mobile && sendRequest ? "Please Enter Mobile Number" : ""}</Text>
                            <Text style={{ marginTop: 5, color: "red" }}>{memberDetail.mobile && memberDetail.mobile.trim().length < 12 ? "please Enter Valid Number" : ""}</Text>

                            <Text style={{ color: "#003163", marginTop: 5 }}>Email</Text>
                            <View style={{ paddingLeft: 10, paddingRight: 10 }} style={{ borderWidth: 0.5, borderColor: "grey", padding: 2, marginTop: 20 }}>
                                <TextInput

                                    placeholder={"Email"}
                                    value={memberDetail.email}
                                    style={{ padding: Platform.OS === 'ios' ? 10 : 10 }}
                                    onChangeText={(val) => upDateTextInput("email", val)}
                                />
                            </View>
                            <Text style={{ marginTop: 5, color: "red" }}>{!memberDetail.email && sendRequest ? "Please Enter Email" : ""}</Text>
                            <Text style={{ color: "red" }}>{memberDetail.email && sendRequest && !emailRex.test(memberDetail.email) ? "Please Enter Valid Email" : ""}</Text>
                            <Text style={{ color: "#003163", marginTop: 5 }}>CNIC</Text>
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
                            <Text style={{ marginTop: 5, color: "red" }}>{!memberDetail.cnic && sendRequest ? "Please Enter CNIC" : ""}</Text>
                            <Text style={{ marginTop: 5, color: "red" }}>{memberDetail.cnic && memberDetail.cnic.trim().length < 15 ? "please Enter Valid CNIC" : ""}</Text>
                            <Text style={{ color: "#003163", marginTop: 5 }}>Gender</Text>
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
                            <Text style={{ color: "#003163", marginTop: 5 }}>Member Type</Text>

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
                                    {loading ?
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
                        alignSelf: 'center',
                        fontSize: 20,
                        fontWeight: '900',
                        color: Colors.primary,
                        marginTop: 15
                    }}
                    >
                        Pleaser Enter OTP
                    </Text>
                    <View style={{ width: '90%', alignSelf: 'center', marginVertical: '25%', borderColor: '#ccc', borderWidth: 1, borderRadius: 6 }}>
                        <TextInput
                            value={otp}
                            onChangeText={(text) => setOtp(text)}
                            maxLength={5}
                            keyboardType="number-pad"
                            textAlign="center"
                        />
                    </View>
                    <Text style={{ marginTop: 15, color: "red", alignSelf: 'center' }}>{otp && otp.trim().length < 5 ? "Please Enter Valid OTP" : ""}</Text>
                    <View style={styles.otpButtonContainer}>
                        <TouchableOpacity
                            style={{
                                width: '45%',
                                alignSelf: 'center',
                                padding: 10,
                                borderColor: Colors.secondary,
                                borderWidth: 1,
                                borderRadius: 5,
                                backgroundColor: 'white'
                            }}
                            onPress={() => handleOTPModelClose()}
                        >
                            <Text style={{
                                alignSelf: 'center',
                                color: Colors.primary,
                                fontWeight: '900'
                            }}>Send OTP</Text>
                        </TouchableOpacity>
                        {
                            (otp.length == 5) ?
                                <TouchableOpacity
                                    onPress={() => handleSendOTP()}
                                    style={{
                                        // borderWidth:1,
                                        // borderColor:'green',
                                        width: '45%',
                                        alignSelf: 'center',
                                        padding: 10,
                                        backgroundColor: Colors.secondary,
                                        borderRadius: 5
                                    }}
                                >
                                    {loading ?
                                        <ActivityIndicator size="large" color="white" /> :
                                        <Text style={{
                                            alignSelf: 'center',
                                            color: 'white',
                                            fontWeight: '900'
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
        flex: 1,
        backgroundColor: Colors.primary
    },
    text: {
        color: Colors.primary,
        color: 'white',
        fontWeight: '900',
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
    errorText: {
        fontSize: RFValue(25),
        color: 'white',
        alignSelf: 'center',
    },
    emptyText: {
        fontSize: RFValue(25),
        color: 'white',
        alignSelf: 'center',
        marginVertical: 100
    },
    cardContainer: {
        backgroundColor: 'white',
        padding: 10,
        width: '95%',
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
    tableHead: {
        // borderColor:'black',
        // borderWidth:1,
        // marginTop:50,
        // padding:2,
        // width:'95%',
        // alignSelf:'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: Colors.primary,
    },
    tableHead1: {
        // borderColor:'black',
        // borderWidth:1,
        // marginTop:50,
        // padding:2,
        // width:'95%',
        // alignSelf:'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        // alignItems:'center',
        // flex:1
    },
    tableCell: {
        borderWidth: 0.5,
        borderColor: 'black',
        padding: 5,
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    tableCell1: {
        borderWidth: 0.5,
        borderColor: 'black',
        padding: 5,
        flex: 1.5,
        textAlign: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    tableHCell: {
        borderWidth: 0.5,
        borderColor: 'black',
        padding: 5,
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        backgroundColor: "white"
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
    tableText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: RFValue(12),
    },
    tableHText: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: RFValue(12)
    },
    detailsContainer: {
        width: '95%',
        alignSelf: 'center',
        // flexDirection:'row'
        // borderColor:'red',
        // borderWidth:1,
        borderRadius: 5,
        overflow: 'hidden',
        marginVertical: 15
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
    otpButtonContainer: {
        width: '95%',
        alignSelf: 'center',
        // borderWidth:1,
        // borderColor:'red',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15
    }
})
