import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Image,
  Platform,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  View,
  Alert,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';


import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { RFValue } from "react-native-responsive-fontsize";
import Icon from 'react-native-vector-icons/FontAwesome5'
import AuthContext from '../auth/context';
import Colors from '../constants/Colors';

const win = Dimensions.get('window');
//Initialisation of constants 
export default function ForgotpasswordScreen(props) {
  const [key, setKey] = useState(false);
  const [state, setState] = useState({
    cnic: '',
    phone: '',
    email:'',
    isModal: false,
    errors: {
      error_email: '',
      error_global: '',
      message_global: '',
    }
  })

  const [isLoading, setIsLoading] = useState(false);
  const { email, isModal, phone,cnic ,errors } = state;

  // const [ArequestPasswordReset] = useMutation(appRequestPasswordReset);  //Graph QL API calls.

  const updateTextInput = (value, field) => {

   if(field == "cnic"){
    var formatted = value.replace(/^(\d{5})(\d{7})(\d{1}).*/, '$1-$2-$3');
    setState({ ...state, [field]: formatted.trim()});
   }
    else{
    setState({ ...state, [field]: value.trim() });
    }
  }

  const formValidation = () =>{
    const emailRx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     if(!emailRx.test(state.cnic) && state.cnic!=null)
       Alert.alert("Error","Please enter the valid email")
     else if (state.cnic==null &&  state.phone != null)
     Alert.alert("Error","Please Enter Email")
      if (state.cnic !=null &&  state.phone == null)
     Alert.alert("Error","Please Enter Password")
     else if(state.cnic ==null &&  state.phone == null)
     Alert.alert("Error","Please Enter Email & Password")
     if(emailRx.test(state.cnic) && state.phone!=null) 
     forgetPassword()
    } 

  const  forgetPassword = () =>{
    setIsLoading(true)
      console.log(`http://23.101.22.149:8074/rpc/forget_password?db=Prod_Bk_18_Sep_2021&login=${state.cnic}&mobile=${state.phone}`)
       fetch(`http://23.101.22.149:8074/rpc/forget_password?db=Prod_Bk_18_Sep_2021&login=${state.cnic}&mobile=${state.phone}`, {
     method: 'GET',
     headers: new Headers({
         'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
     }),
    })
     .then((response) => response.json())
     .then((response) => {
      setIsLoading(false)
       if(response.login){
        props.navigation.navigate("resetpassword",{username:response.name,login:response.login})
       }
       else{
         Alert.alert("Attention!","Please Enter Valid Credentials")
       }
     })
     .catch((error) => {
       console.log(error)
      setIsLoading(false)
      Alert.alert("Error","Please Check your internet connection..")
     
         console.error(error);
     });
 }

  return (
    <>
     
      <View style={styles.main_container}>
        <KeyboardAwareScrollView>
          <View>
          <View style={styles.header}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <TouchableOpacity onPress={() => props.navigation.navigate('LoginScreen')} style={styles.headerIcon}>
                <Icon
                  name="chevron-left"
                  color='white'
                  size={25}
                />
              </TouchableOpacity>
              <Text style={styles.headerText}>Forget Password</Text>
            </View>
            <Image
              source={require('../assets/images/icons8-user-100.png')}
              style={{width:30,height:40,alignSelf:'flex-end'}}
              resizeMode="contain"
            />
          </View>
          <View style={{borderBottomWidth:0.5,borderColor:"grey"}}/>

          <View style={styles.wrapper}>
            
            <Text style={[global_styles.labelStyle, global_styles.lato_medium]}>{"E-mail"}</Text>
            <View style={global_styles.inputWrap_username}>
              <TextInput
                style={[global_styles.textInput, global_styles.lato_regular]}
                placeholder={"E-mail"}
                // keyboardType="number-pad"
                value={cnic}
                onChangeText={(text) => updateTextInput(text, 'cnic')}
              />
            </View>

            <Text style={[global_styles.labelStyle, global_styles.lato_medium]}>{"Phone Number"}</Text>
            <View style={global_styles.inputWrap_username}>
              <TextInput
                style={[global_styles.textInput, global_styles.lato_regular]}
              
                value={phone}
                keyboardType="phone-pad"
                placeholder={"+923xxxxxxxxxx"}
                onChangeText={(text) => updateTextInput(text, 'phone')}
              />
            </View>            

            <View style={[styles.error_message_wrapper, global_styles.lato_regular]}>
              <Text style={styles.error_message_text}>{errors.error_email}</Text>
            </View>
            <View style={styles.button_container}>
              <TouchableOpacity style={[{ alignSelf: "center" }, global_styles.bottom_style_orange_wrapper]} onPress={() => { 
                // props.route.params.previousRoute=="login"?
              // forgetPassword()
              formValidation()
              // sendResetPasswordRequest() 
              }} >
                <Text style={global_styles.bottom_style_orange_text}>SEND</Text>
              </TouchableOpacity>
              <Text></Text>
              {/* <TouchableOpacity style={[{ alignSelf: "center" }, global_styles.bottom_style_gray_wrapper]} onPress={() => { fun_switch() }} >
                <Text style={[global_styles.bottom_style_gray_text, global_styles.lato_medium]}>CANCEL</Text>
              </TouchableOpacity> */}
            </View>
          </View>
          </View>
        </KeyboardAwareScrollView>
        {isLoading==true?
           <ActivityIndicator 
           size="large" color="#fbb33c" style={{position: 'absolute',
           left: 0,
           right: 0,
           top: 0,
           bottom: 0,
           backgroundColor:"transparent",
           alignItems: 'center',
           justifyContent: 'center'}} />
           :null}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: Colors.primary,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
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
  button_container: {
    justifyContent: 'center',
    marginTop: 35
  },
  cancel_container: {
    width: 140,
    backgroundColor: '#dedbdb',
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    alignSelf: "center",
    borderColor: '#dedbdb'
  },
  save_container: {
    width: 140,
    backgroundColor: '#db9360',
    padding: 8,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: "center",
    alignSelf: "center",
    borderColor: '#db9360'
  },
  save_text: {
    color: '#FFFFFF'
  },
  labelStyleContent: {
    fontSize: 11,
    color: '#000000',
    letterSpacing: 1,
    marginBottom: 20,
  },
  labelStyle: {
    marginTop: 4,
    fontSize: 12,
    color: '#000000',
    letterSpacing: 1,
    marginVertical: 4,
    marginTop: 8,
    opacity: 0.6
  },
  textInput_password_secure: {
    color: "#2dafd3",
    paddingTop: 2,
    paddingLeft: 5
  },
  error_msg: {
    color: "red",
    fontSize: 16,
  },
  icon_input: {
    width: 17,
    height: 20,
    marginVertical: 5
  },
  container: {
    flex: 1
  },
  screen_change_text: {
    color: "#f59b42",
    fontSize: 16,
    marginRight: 15,
    textDecorationLine: "underline",
    marginTop: 10
  },
  forgot_link: {
    flexDirection: 'row',
    marginVertical: 0,
    alignSelf: "flex-end",
    marginTop: 2
  },
  forgot_link_text: {
    color: "#2dafd3",
    fontSize: 13,
    marginTop: 5,
  },
  error_message_wrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 0,
    paddingVertical: 0,
  },
  error_message_text: {
    color: "#f59b42",
    fontSize: 12,
    justifyContent: "flex-end",
  },
  headContainer: {
    marginVertical: 0,
    marginBottom: (Platform.OS === "ios")?45:15,   
    flex: 1,  
    alignItems: "center",
    marginTop:(Platform.OS === "ios")?70:40,
  },
  logo: {
    width: 250,
    height: 60,
  },
  login_heading: {
    flex: 1,
    alignItems: "center",
    marginTop: 0,
    marginBottom: 25,
  },
  login_heading_text: {
    fontSize: 19,
    color: "#393e5c",
    textAlign: "center",
  },
  login_sub_heading: { // Defined but not used please remove this.
    flex: 1,
    alignItems: "center",
    marginTop: 30,
  },
  login_sub_heading_text: { // Defined but not used please remove this.
    fontSize: 18,
    textAlign: "center",
    color: "#fff",
  },
  modal: {
    flex: 1,
  },
  wrapper: {
    borderRadius: 15,
    marginVertical: 30,
    minHeight: 160,
    // alignContent: "flex-start",
    width:'90%',
    alignSelf:'center'
  },
  inputWrap: { // Defined but not used please remove this.
    flexDirection: "row",
    marginBottom: 0,
    borderRadius: 7,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: "#fff",
    width: "100%",
  },
  inputWrap_username: { // Defined but not used please remove this.
    flexDirection: "row",
    marginBottom: 0,
    borderRadius: 5,
  },
  inputWrapLast: {
    marginBottom: 0,
  },
  WrapBorder: { // Defined but not used please remove this.
    flexDirection: "row",
  },
  input_cotainer: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 48,
    color: "#d4d4d4",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#FFF",
    borderRadius: 10
  },
  input: {
    flex: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#d4d4d4",
    backgroundColor: "#fff",
    borderRadius: 10
  },
  loginButton: {
    alignItems: "center",
    flexDirection: "row",
  },
  button: {
    color: "#FFF",
    backgroundColor: "#d4d4d4",
    fontSize: 20,
    flex: 2,
    justifyContent: "center",
    textAlign: "center",
    paddingVertical: 8,
    fontWeight: "bold",
    borderRadius: 5
  },

})

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
      justifyContent: "center",
      alignItems: "flex-end",
      flexDirection: 'row',
      marginTop: 15,
      marginBottom:10,
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
    bottom_style_orange_wrapper:{
      backgroundColor:Colors.secondary, 
      borderRadius:5,
      width:'100%',
      alignSelf:'center',
      padding:10,
      marginTop:30,
      alignItems:'center'
    },
    bottom_style_orange_text: {
      color:'white',
      fontSize: RFValue(20),
      fontWeight:'900'
    },
    labelStyle: {
      color:"white",
      marginTop:10
    }
    
  });

  

  

 
 
  

