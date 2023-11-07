import React, { useState, useEffect, useContext } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { StyleSheet, ActivityIndicator, View, Text, TextInput, Button, Image, TouchableOpacity } from 'react-native';

import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Colors from '../constants/Colors';
import { RFValue } from "react-native-responsive-fontsize";
import Icon from 'react-native-vector-icons/FontAwesome5'

export default function ResetPassword(props) {
    const navigation = useNavigation();
    const [state, setState] = useState({
        isLoading: false,
        emailId: '',
        email:'',
        newPassword: '',
        oldPassword: '',
        confirmPassword: '',
        phone:'',
        errors: {
            error_email: '',
            error_old_pass: '',
            error_new_pass: '',
            error_confirm_pass: ''
        }
    });
    const [cnic,setcnic] = useState("");
    const [username,setUsername] = useState("")
    const [regModel, setRegModel] = useState(false);

    const { isLoading, oldPassword, emailId, newPassword, confirmPassword, errors,phone } = state;

    const updateTextInput = (value, field) => {
        setState({ ...state, [field]: value.trim() });
    }

    useEffect(() => {
        // setuserid();
        // getData();
    }, []);

    
    const save = () => {
      
           
        setState({ ...state, isLoading: true });

        let flag = 1
        let err = { ...state, errors };
        // let err = { ...errors }

        /*   if (emailId == '') {
               err.error_email = translate('error_email')
               flag = 0
           } else {
               err.error_email = ''
           }
   */

        if (oldPassword == '') {
            err.error_old_pass = 'Please add your OTP'
            flag = 0
        }

        if (newPassword == '') {
            err.error_new_pass = 'Please enter new password'
            flag = 0
        } else {
            err.error_new_pass = ''
        }

        if (confirmPassword == '') {
            err.error_confirm_pass = 'Please enter confirm password'
            flag = 0
        } else if (newPassword != confirmPassword) {
            err.error_confirm_pass = 'Please enter same password'
            flag = 0
        }
        else {
            err.error_confirm_pass = ''
        }

        if (flag == 0) {
            setState({ ...state, errors: err, isLoading: false })
            return
        }
        err.error_email = ''
        err.error_new_pass = ''
        err.error_confirm_pass = '',
        err.error_old_pass = '',
        resetPasswordHandler()
        return;
        }
               

 const  resetPasswordHandler = () =>{
    let err = { ...state, errors };
    err.error_new_pass = ''
    err.error_confirm_pass = '',
    err.error_old_pass = '',
    fetch(`http://23.101.22.149:8074/rpc/reset_password?db=LEParis_Prod&token=${oldPassword}&name=${props.route.params.username}&login=${props.route.params.login}&password=${newPassword}&confirm_password=${confirmPassword}`, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
        }),
       })
        .then((response) => response.json())
        .then((response) => {
            console.log("response",response)
             if(response.error){
                Alert.alert("Error",response.error)
             }
            else{
          Alert.alert("Success","Your password has been successfully updated now!")
          props.navigation.navigate("LoginScreen")
        //   logout()
             }
        })
        .catch((error) => {
          console.log("error",error)
        });
    }

  
    

    return (
        <View style={styles.main_container}>
            <KeyboardAwareScrollView  >
                <>
                <View style={styles.header}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.headerIcon}>
                        <Icon
                        name="chevron-left"
                        color='white'
                        size={25}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Reset Password</Text>
                    </View>
                    <Image
                    source={require('../assets/images/icons8-user-100.png')}
                    style={{width:30,height:40,alignSelf:'flex-end'}}
                    resizeMode="contain"
                    />
                </View>
                <View style={{borderBottomWidth:0.5,borderColor:"grey"}}/>

                    <View style={styles.container}>
                        <View>
                            <Text style={[global_styles.labelStyleAcount, global_styles.lato_medium]}>Enter OTP Number</Text>
                            <TextInput
                                style={[global_styles.textInput, global_styles.lato_regular]}
                                // secureTextEntry={true}
                                placeholder={"Enter OTP Number"}
                                value={oldPassword}
                                onChangeText={(text) => updateTextInput(text, 'oldPassword')}
                            />
                            <Text style={[styles.error_label, global_styles.lato_regular]}>{errors.error_old_pass}</Text>
                        </View>
                        <View>
                            <Text style={[global_styles.labelStyleAcount, global_styles.lato_medium]}>New Password</Text>
                            <TextInput
                                style={[global_styles.textInput, global_styles.lato_regular]}
                                secureTextEntry={true}
                                 placeholder={"New Password"}
                                value={newPassword}
                                onChangeText={(text) => updateTextInput(text, 'newPassword')}
                            />
                            <Text style={[styles.error_label, global_styles.lato_regular]}>{errors.error_new_pass}</Text>
                        </View>
                        <View>
                            <Text style={[global_styles.labelStyleAcount, global_styles.lato_medium]}>Confirm Password</Text>
                            <TextInput
                                style={[global_styles.textInput, global_styles.lato_regular]}
                                secureTextEntry={true}
                                placeholder={"Confirm Password"}
                                value={confirmPassword}
                                onChangeText={(text) => updateTextInput(text, 'confirmPassword')}
                            />
                            <Text style={[styles.error_label, global_styles.lato_medium]}>{errors.error_confirm_pass}</Text>
                        </View>
                        <View style={global_styles.button_container}>
                            {/* <TouchableOpacity onPress={cancel}>
                                <View style={global_styles.button_style_white_wrapper}>
                                    <Text style={global_styles.button_style_white_text}>{"Cancel"}</Text>
                                </View>
                            </TouchableOpacity> */}
                            <View style={{ marginStart: 16 }} />
                            <TouchableOpacity onPress={save}>
                                <View style={global_styles.bottom_style_orange_wrapper}>
                                    <Text style={[global_styles.bottom_style_orange_text, global_styles.lato_medium]}>{"Save"}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {isLoading ?
                        <View style={[global_styles.activityIndicatorView]}>
                            <ActivityIndicator size="large" style={{ padding: 60 }} />
                        </View> : <></>}
                </>
            </KeyboardAwareScrollView>
       
        </View >
    );

}

// Stylesheet to design Dashboard screen
const styles = StyleSheet.create({
    main_container: {
        backgroundColor: Colors.primary,
        flex: 1
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
    container: {
        margin: 22
    },
    labelStyleAcount: {
        marginTop: 4,
        fontSize: 12,
        color: 'white',
        letterSpacing: 1,
        opacity: 0.6
    },
    button_container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 22
    },
    error_label: {
        color: 'red',
        fontSize: 12,
    },
});
const global_styles = StyleSheet.create({
    boldText: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold'
    },
    activityIndicatorView: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      flex: 1,
      zIndex: 1,
    },
    button_style_white_wrapper: {
      paddingHorizontal: 30,
      backgroundColor: '#fff',
      paddingVertical: 12,
      borderRadius: 5,
      borderColor: '#d4d4d4',
      alignItems: "center",
      minWidth: 120,
      textAlign: "center",
      borderWidth: 1,
    },
    button_container: {
    //   justifyContent: "center",
    //   alignItems: "flex-end",
    //   flexDirection: 'row',
      marginTop: 15,
      marginBottom:10,
      width:'95%',
      alignSelf:'center'
    },
    textInput: {
      marginTop: 4,
      borderWidth: 1,
      borderRadius: 4,
      fontSize: 14,
      paddingHorizontal: 12,
      // paddingVertical: inputBoxVerticalPadding,
      borderColor: '#d4d4d4',
      color: 'rgba(0, 0, 0, 0.6)',
      alignItems:"center",
      width: "100%",
      backgroundColor: '#ffffff',
      height: (Platform.OS === "ios") ? 40 : 42,
      flexDirection:"row",
      justifyContent:"space-between",
      flex: 1,
      alignItems: 'stretch',
    },
    labelStyleAcount:{
        color:"white",
        marginTop:10
    },
    bottom_style_orange_wrapper:{
        backgroundColor:Colors.secondary, 
        borderRadius:5,
        width:'100%',
        alignSelf:'center',
        paddingHorizontal: 30,
        paddingVertical: 12,
        marginTop:30,
        alignItems:'center'
    },
    bottom_style_orange_text: {
        color:'white',
        fontSize: RFValue(20),
        fontWeight:'900'
    },
    
  });

  