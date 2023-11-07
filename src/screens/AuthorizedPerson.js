import React, {useState, useEffect, useContext} from 'react'
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    Image, 
    Keyboard,
    RefreshControl,
    FlatList, 
    ActivityIndicator, 
    TextInput, 
    Alert, 
    KeyboardAvoidingView 
} from 'react-native'

import Colors from '../constants/Colors'
import Icon from 'react-native-vector-icons/FontAwesome5'

import ReloadButton from '../components/Button/ReloadButton'
import Header from '../components/Header'

import { RFValue } from "react-native-responsive-fontsize";

import requestApi from '../api/investor'

import AuthContext from '../auth/context';
import useAuth from '../auth/useAuth';
import {validateName} from '../services/validations'

import { MaskedTextInput } from "react-native-mask-text"
import Modal from "react-native-modal";
import {Picker} from '@react-native-picker/picker';
import { ScrollView } from 'react-native-gesture-handler'

const NAME_REGEX = /^[a-zA-Z\s]*$/

export default function AuthorizedPerson({navigation}) {
    const [fileData, SetFileData] = useState([])
    const [loading, SetLoading] = useState(false)
    const [errors, setErrors] =useState(false)
    const [showModel, setModel] = useState(false);
    const [showEditModel, setEditModel] = useState(false);

    const [mobile, setMobile] = useState('')
    const [street, setStreet] = useState('')
    const [city, setCity] = useState('')
    const [province, setProvince] = useState('')
    const [country, setCountry] = useState('')

    const [requestName, setRequestName] = useState('')
    const [requestMobile, setRequestMobile] = useState('')
    const [requestCnic, setRequestCnic] = useState('')
    const [requestStreet, setRequestStreet] = useState('')
    const [requestCity, setRequestCity] = useState('')
    const [requestProvince, setRequestProvince] = useState('')
    const [requestCountry, setRequestCountry] = useState('')

    const {user, setUser} = useContext(AuthContext);


    useEffect(() => {
        loadAuthorizedPerson()
    }, [])

    const loadAuthorizedPerson = async () => {
        SetLoading(true)
        SetFileData([]);
        const response = await requestApi.getAuthorizedPerson();
        SetLoading(false)
        if (response.ok && response.data){
            console.log(response)
            SetFileData(response.data[0])
            console.log("profile", response.data[0])
            // if (fileData && fileData.length> 0){
            //     setName(fileData.name)
            //     setMobile(fileData.mobile)
            //     setCnic(fileData.cnic)
            // }
            setErrors(false)
        }
        else{
            console.log("error in getting data")
            return setErrors(true)
        }
    }

    const handleEditModal = () => {
        setEditModel(false)
        setMobile("")
        setStreet('')
        setCity("")
        setProvince('')
        setCountry("")
    }

    const handleRequestModal = () =>  {
        setModel(false)
        setRequestCnic("")
        setRequestMobile('')
        setRequestName("")
        setRequestCity("")
        setRequestStreet('')
        setRequestProvince("")
        setRequestCountry("")
    }

    // useEffect(() => {
    //     setTimeout(() => {
    //         useAuth().logOut();
    //         setUser(null);
    //     }, 300000);
    // }, []);

    const handleRequestPress = async () => {
        const response = await requestApi.postNewUser(requestName, requestCnic,requestMobile,requestStreet, requestCity,requestProvince, requestCountry)
        console.log("response",response)
        if(response &&response.data&& response.data.error&& response.data.error.data && response.data.error.data.message){
            Alert.alert(response.data.error.data.message)
            // setEditModel(false)
            setModel(false)
            setRequestCnic("")
            setRequestMobile('')
            setRequestName("")
            setRequestCity("")
            setRequestStreet('')
            setRequestProvince("")
            setRequestCountry("")
        }
        else if(response && response.data && response.data.result){
            Alert.alert("Request Created Succesfully")
            setModel(false)
            setRequestCnic("")
            setRequestMobile('')
            setRequestName("")
            setRequestCity("")
            setRequestStreet('')
            setRequestProvince("")
            setRequestCountry("")
        }
    }

    const handleEditUser = async () => {
        const response = await requestApi.postEditUser(mobile, street,city,province,country)
        console.log(response)
        if(response &&response.data&& response.data.error&& response.data.error.data && response.data.error.data.message){
            Alert.alert(response.data.error.data.message)
            // setEditModel(false)
            setEditModel(false)
            setMobile("")
            setStreet('')
            setCity("")
            setProvince('')
            setCountry("")
        }
            
        else if(response && response.data && response.data.result){
            setEditModel(false)
            Alert.alert("Request Successfully Created")
            setMobile("")
            setStreet('')
            setCity("")
            setProvince('')
            setCountry("")
        }
        
        // else{
        //     Alert.alert("Sorry","Request cannot be generated ")
        // }
    }

    return (
        <View style={styles.screen}>
            <Header
                name="Authorized Person"
                onPress={() => navigation.navigate('Dashboard')}
            />
            
            <View style={{borderBottomWidth:0.5,borderColor:"grey"}}/>

            <TouchableOpacity style={styles.buttonContainer} onPress={() => setModel(true)}>
                <Text style={{color:Colors.primary,alignSelf:'center',fontWeight:'bold',fontSize:16}}>ADD</Text>
                
            </TouchableOpacity>

            {errors && (<>
                <Text style={styles.errorText}>Couldn't retrive Authorized Person</Text>
                <ReloadButton onPress={loadAuthorizedPerson} />
            </>)}

            
            <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={loadAuthorizedPerson} />}>
            <View style={styles.profileContainer}>
                <Image
                    source={require("../assets/icons/authorized.png")}
                    style={{ width: 70, height: 90,alignSelf:'center',marginTop:-50}}
                    resizeMode="contain"
                />
                <View style={{flexDirection:'row',width:'40%',alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{color:Colors.primary,alignSelf:'center',
                        fontSize:18,fontWeight:'bold'}}>{fileData && fileData.name?fileData.name.charAt(0).toUpperCase() + fileData.name.slice(1).toLowerCase():""}
                    </Text>
                    <TouchableOpacity style={{marginLeft:5,alignItems:'center'}} onPress={() => setEditModel(true)}>
                        <Icon
                            name="pencil-alt"
                            color={Colors.primary}
                            size={17}
                        />

                    </TouchableOpacity>
                </View>
                <View style={{
                    width:'80%',
                    alignSelf:'center',
                    // borderWidth:1,
                    // borderColor:'green',
                    marginVertical:10
                }}>
                    
                    <View style={{
                        flexDirection:'row',
                        justifyContent:'space-between'
                    }}>
                        <View style={{flexDirection:'row',flex:1,marginRight:10,justifyContent:'space-between'}}>
                        <Text>CNIC:</Text>
                        <Text>{fileData && fileData.cnic?fileData.cnic:""}</Text>
                        </View>
                        {/* <TouchableOpacity>
                            <Icon
                                name="pencil-alt"
                                color={Colors.primary}
                            />
                        </TouchableOpacity> */}
                    </View>
                    <View style={{
                        flexDirection:'row',
                        justifyContent:'space-between'
                    }}>
                        <View style={{flexDirection:'row',flex:1,marginRight:10,justifyContent:'space-between'}}>
                            <Text>Mobile Phone:</Text>
                            <Text>{fileData && fileData.mobile?fileData.mobile:""}</Text>
                            
                        </View>
                        {/* <TouchableOpacity  onPress={() => setEditModel(true)}>
                            <Icon
                                name="pencil-alt"
                                color={Colors.primary}
                            />
                        </TouchableOpacity> */}
                    </View>
                    <View style={{
                        flexDirection:'row',
                        justifyContent:'space-between',
                        marginTop:10
                    }}>
                        <View style={{flexDirection:'row',flex:1,marginRight:10,justifyContent:'space-between'}}>
                            <Text>Street:</Text>
                            <Text>{fileData && fileData.street?fileData.street.charAt(0).toUpperCase() + fileData.street.slice(1).toLowerCase():""}</Text>
                        </View>
                    </View>
                    <View style={{
                        flexDirection:'row',
                        justifyContent:'space-between',
                    }}>
                        <View style={{flexDirection:'row',flex:1,justifyContent:'space-between',marginRight:10}}>
                            <Text>City:</Text>
                            <Text>{fileData && fileData.city?fileData.city.charAt(0).toUpperCase() + fileData.city.slice(1).toLowerCase():""}</Text>
                        </View>
                        {/* <View style={{flexDirection:'row',width:'50%',justifyContent:'space-between'}}>
                            <Text>Province:</Text>
                            <Text>{fileData && fileData.state?fileData.state:""}</Text>
                        </View> */}
                    </View>
                    <View style={{
                        flexDirection:'row',
                        justifyContent:'space-between'
                    }}>
                        <View style={{flexDirection:'row',flex:1,marginRight:10,justifyContent:'space-between'}}>
                            <Text>Province:</Text>
                            <Text>{fileData && fileData.state?fileData.state.charAt(0).toUpperCase() + fileData.state.slice(1).toLowerCase():""}</Text>
                        </View>
                    </View>
                    <View style={{
                        flexDirection:'row',
                        justifyContent:'space-between'
                    }}>
                        <View style={{flexDirection:'row',flex:1,marginRight:10,justifyContent:'space-between'}}>
                            <Text>Country:</Text>
                            <Text>{fileData && fileData.country?fileData.country.charAt(0).toUpperCase() + fileData.country.slice(1).toLowerCase():""}</Text>
                        </View>
                    </View>
                </View>
            </View>
            </ScrollView>

            {/* CREATE USER REQUEST Modal */}
            <Modal isVisible={showModel} style={{ backgroundColor: "white"}}>
                <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
                    <View style={styles.imageContainer}>
                        <Icon
                            name="user-circle"
                            size={45}
                            color={Colors.primary}
                            style={{
                                alignSelf:'center'
                            }}
                        />
                        
                    </View>
                    <Text style={styles.modalTitle}>Create New Authorized Request</Text>
                    <View style={styles.inputContainer}>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',}}>
                            <Text style={{color:"#003163",marginTop:10}}>Name:</Text>
                            <View style={{ borderWidth: 0.5, borderColor: "grey", height:40, marginVertical: 10, borderRadius:7, width:'80%' }}>
                                <TextInput
                                    value={requestName}
                                    onChangeText={(text)=>setRequestName(text)}
                                    keyboardType="default"
                                    // onFocus={()=>validateWorkPhone1(workFirst)}
                                />
                                <Text style={{color: "red",marginTop: 5 }}>{requestName &&!NAME_REGEX.test(requestName)?"Name Should be Alphabet":""}</Text>
                            </View>
                            
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5}}>
                            <Text style={{color:"#003163",marginTop:10}}>Mobile:</Text>
                            <View style={{ borderWidth: 0.5, borderColor: "grey", height:40, marginVertical: 10, borderRadius:7, width:'80%' }}>
                                <MaskedTextInput
                                    placeholder="03xx-xxxxxxx"
                                    type="custom"
                                    mask="0399-9999999"
                                    value={requestMobile}
                                    onChangeText={(text)=>setRequestMobile(text)}
                                    keyboardType="phone-pad"
                                    // onFocus={()=>validateRequestName(requestName)}
                                    // onFocus={()=>validateName(requestName)}
                                    // style={{ marginLeft: 7, justifyContent: "space-around", width: "78%" }} 
                                />
                                <Text style={{ marginTop: 5, color: "red" }}>{requestMobile && requestMobile.trim().length<12?"Please Enter Valid Number":""}</Text>
                            </View>
                            
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5}}>
                            <Text style={{color:"#003163",marginTop:10}}>CNIC:</Text>
                            <View style={{ borderWidth: 0.5, borderColor: "grey", height:40, marginVertical: 10, borderRadius:7, width:'80%' }}>
                                <MaskedTextInput
                                    // placeholder="CNIC"
                                    type="custom"
                                    mask="99999-9999999-9"
                                    value={requestCnic}
                                    onChangeText={(text)=>setRequestCnic(text)}
                                    keyboardType="number-pad"
                                    // style={{ marginLeft: 7, justifyContent: "space-around", width: "78%" }} 
                                />
                                <Text style={{ marginTop: 5, color: "red" }}>{requestCnic && requestCnic.trim().length<15?"Please Enter Valid CNIC":""}</Text>
                            </View>
                            
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5}}>
                            <Text style={{color:"#003163",marginTop:10}}>Street:</Text>
                            <View style={{ borderWidth: 0.5, borderColor: "grey", height:40, marginTop: 10, borderRadius:7, width:'80%', }}>
                                <TextInput
                                    value={requestStreet}
                                    onChangeText={(text)=>setRequestStreet(text)}
                                    placeholder="[OPTIONAL]"
                                    // style={{height:50}}
                                />
                            </View>
                        </View>
                        {/* <Text style={{color:"#003163",marginTop:10}}>Address:</Text> */}
                        
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5}}>
                            <Text style={{color:"#003163",marginTop:10}}>City:</Text>
                            <View style={{ borderWidth: 0.5, borderColor: "grey", height:40, marginTop: 10, borderRadius:7, width:'80%'}}>
                                <TextInput
                                    value={requestCity}
                                    onChangeText={(text)=>setRequestCity(text)}
                                    placeholder="[OPTIONAL]"
                                />
                            </View>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5}}>
                            <Text style={{color:"#003163",marginTop:10}}>Province:</Text>
                            <View style={{ borderWidth: 0.5, borderColor: "grey", height:40, marginTop: 10, borderRadius:7, width:'80%'}}>
                                <TextInput
                                    value={requestProvince}
                                    onChangeText={(text)=>setRequestProvince(text)}
                                    placeholder="[OPTIONAL]"
                                />
                            </View>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5}}>
                            <Text style={{color:"#003163",marginTop:10}}>Country:</Text>
                            <View style={{ borderWidth: 0.5, borderColor: "grey", height:40, marginTop: 10, borderRadius:7, width:'80%' }}>
                                <TextInput
                                    value={requestCountry}
                                    onChangeText={(text)=>setRequestCountry(text)}
                                    placeholder="[OPTIONAL]"
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.modalButtonContainer1}>
                        <TouchableOpacity onPress={() => handleRequestModal()} style={styles.modalCloseButton}>
                            <Text style={{
                                alignSelf:'center',
                                color: Colors.primary,
                                fontWeight:'bold'
                            }}>Close</Text>
                        </TouchableOpacity>
                        {
                            requestName != "" && requestCnic != "" && requestMobile != "" &&NAME_REGEX.test(requestName) && requestMobile.trim().length==12 && requestCnic.trim().length===15 && requestMobile.trim().length==12 ?
                                <TouchableOpacity style={styles.modalOpenButton} onPress={()=>handleRequestPress()}>
                                    <Text style={{
                                        alignSelf:'center',
                                        color:'white',
                                        fontWeight:'bold'
                                    }}>Send Request</Text>
                                </TouchableOpacity>
                            :
                            null
                        }
                        
                    </View>
                </ScrollView>
            </Modal>

            {/* EDIT USER Modal */}
            <Modal isVisible={showEditModel} style={{ backgroundColor: "white" }}>
                <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
                    <View style={styles.imageContainer}>
                        <Icon
                            name="user-circle"
                            size={45}
                            color={Colors.primary}
                            style={{
                                alignSelf:'center'
                            }}
                        />
                        
                    </View>
                    <Text style={styles.modalTitle}>Edit {fileData && fileData.name?fileData.name.charAt(0).toUpperCase() + fileData.name.slice(1).toLowerCase():"User"}</Text>
                    <View style={styles.inputContainer}>
                        {/* <Text style={{color:"#003163",marginTop:10}}>Name:</Text>
                        <View style={{ borderWidth: 0.5, borderColor: "grey", padding: 2, marginTop: 10, borderRadius:20 }}>
                            <TextInput/>
                        </View> */}
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                            <Text style={{color:"#003163",marginTop:10}}>Mobile:</Text>
                            <View style={{ borderWidth: 0.5, borderColor: "grey", height:40, marginTop: 10, borderRadius:7,width:'80%' }}>
                                <MaskedTextInput
                                    placeholder="03xx-xxxxxxx"
                                    type="custom"
                                    mask="0399-9999999"
                                    value={mobile}
                                    onChangeText={(text)=>setMobile(text)}
                                    keyboardType="phone-pad"
                                    // style={{ marginLeft: 7, justifyContent: "space-around", width: "78%" }} 
                                />
                                <Text style={{ marginTop: 5, color: "red" }}>{mobile && mobile.trim().length<12?"Please Enter Valid Number":""}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:10}}>
                            <Text style={{color:"#003163",marginTop:10}}>Street:</Text>
                            <View style={{ borderWidth: 0.5, borderColor: "grey", height:40, marginTop: 10, borderRadius:7, width:'80%', }}>
                                <TextInput
                                    value={street}
                                    onChangeText={(text)=>setStreet(text)}
                                    
                                    // style={{height:50}}
                                />
                            </View>
                        </View>
                        {/* <Text style={{color:"#003163",marginTop:10}}>Address:</Text> */}
                        
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:10}}>
                            <Text style={{color:"#003163",marginTop:10}}>City:</Text>
                            <View style={{ borderWidth: 0.5, borderColor: "grey", height:40, marginTop: 10, borderRadius:7, width:'80%'}}>
                                <TextInput
                                    value={city}
                                    onChangeText={(text)=>setCity(text)}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:10}}>
                            <Text style={{color:"#003163",marginTop:10}}>Province:</Text>
                            <View style={{ borderWidth: 0.5, borderColor: "grey", height:40, marginTop: 10, borderRadius:7, width:'80%'}}>
                                <TextInput
                                value={province}
                                onChangeText={(text)=>setProvince(text)}
                                />
                            </View>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:10}}>
                            <Text style={{color:"#003163",marginTop:10}}>Country:</Text>
                            <View style={{ borderWidth: 0.5, borderColor: "grey", height:40, marginTop: 10, borderRadius:7, width:'80%' }}>
                                <TextInput
                                value={country}
                                onChangeText={(text)=>setCountry(text)}/>
                            </View>
                        </View>
                        {/* <Text style={{color:"#003163",marginTop:10}}>CNIC:</Text>
                        <View style={{ borderWidth: 0.5, borderColor: "grey", padding: 2, marginTop: 10, borderRadius:20 }}>
                            <TextInput/>
                        </View> */}
                    </View>
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity onPress={()=>handleEditModal()} style={styles.modalCloseButton}>
                            <Text style={{
                                alignSelf:'center',
                                color: Colors.primary,
                                fontWeight:'bold'
                            }}>Close</Text>
                        </TouchableOpacity>
                        {
                            mobile!= "" && mobile.trim().length==12 ? 
                                <TouchableOpacity style={styles.modalOpenButton} onPress={()=>handleEditUser()}>
                                    <Text style={{
                                        alignSelf:'center',
                                        color:'white',
                                        fontWeight:'bold'
                                    }}>Change</Text>
                                </TouchableOpacity>
                            :null
                        }
                        
                    </View>
                </ScrollView>
            </Modal>
            {/* <RefreshControl refreshing={loading} onRefresh={loadAuthorizedPerson} /> */}
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
        fontSize:25
    },
    headerIcon: {
        marginRight:10
    },
    profileContainer:{
        width:'90%',
        alignSelf:'center',
        // borderColor:"red",
        // borderWidth:1,
        marginTop:40,
        backgroundColor:'white',
        borderRadius:20/2,
        elevation: 5,
        shadowOpacity: 0.26,
        shadowRadius: 6,
        shadowColor: 'black',
        shadowOffset: {
        width: 0, height: 2
        },
        shadowRadius: 6,
        backgroundColor: 'white'
    },
    imageCont:{
        width:'20%',
        alignSelf:'center',
        // borderColor:'red',
        // borderWidth:1,
        alignItems:'center'
    },
    detailCont: {      
        width:'80%',
        marginLeft:10
        // alignSelf:'flex-start',
        // flex:1
    },
    buttonContainer:{
        width:'30%',
        alignSelf:'flex-end',
        borderColor:'white',
        borderWidth:1,
        marginTop:15,
        marginRight:'5%',
        padding:5,
        backgroundColor:'white',
        borderRadius:20/3
        // flexDirection:'row'
        // pa
    },
    buttonIcon:{
        alignSelf:'flex-end'
    },
    inputContainer:{
        width:'95%',
        alignSelf:'center',
        // borderColor:'purple',
        // borderWidth:1,
        marginTop:20
    },
    modalTitle:{
        color:Colors.primary,
        fontWeight:'bold',
        fontSize:20,
        alignSelf:'center',
        marginTop:15
    },
    modalButtonContainer:{
        width:'95%',
        alignSelf:'center',
        // borderWidth:1,
        // borderColor:'red',
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:'15%'
    },
    modalButtonContainer1:{
        width:'95%',
        alignSelf:'center',
        // borderWidth:1,
        // borderColor:'red',
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:25
    },
    modalCloseButton:{
        width:'45%',
        borderWidth:2,
        borderColor:Colors.primary,
        padding:5,
        borderRadius:4,
        alignItems:'center'
    },
    modalOpenButton:{
        width:'45%',
        // borderWidth:1,
        // borderColor:'red',
        padding:5,
        backgroundColor: Colors.primary,
        borderRadius:4,
        alignItems:'center'
    },
    imageContainer:{
        // borderColor:'red',
        // borderWidth:1,
        marginTop:20,
        width:'20%',
        alignSelf:'center',
        borderRadius:50,
        padding:5,
        // backgroundColor:Colors.primary
    },
    errorText: {
        fontSize: RFValue(25),
        color: 'white',
        alignSelf: 'center',
    },
})
