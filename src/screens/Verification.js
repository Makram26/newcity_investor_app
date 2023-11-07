import React, {useState} from "react";
import { Image, StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Dimensions } from "react-native";
// import { TextInput } from "react-native-gesture-handler";
// import { Button } from "react-native-elements/dist/buttons/Button";
import Colors from "../constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";

const window = Dimensions.get('window')

export default function Verification() {
  const [value, setValue] = useState('')

  return (
    <View>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/logo.png')}
          style={{width:"70%",height:"80%",alignSelf:'center'}}
          resizeMode="contain"
        />
      </View>
      <View style={styles.verificationContainer}>
        <Text style={{fontSize:RFValue(25),color:'white',fontWeight:'900',marginTop:15}}>OTP Verification</Text>
        <Text style={{fontSize:RFValue(20),color:'white',fontWeight:'900',marginTop:15}}>Please Enter the OTP you recieved</Text>
        <TextInput
          placeholder="Enter OTP Here..."
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer:{
    width: Dimensions.get('window').width * 1,
    height: Dimensions.get('window').width * 0.55,
    overflow: 'hidden',
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent: 'center',
    // borderColor:'red',
    // borderWidth:1,
    backgroundColor:'#5C577A',
    borderBottomLeftRadius:30,
    borderBottomRightRadius:30,
    marginBottom:20
  },
  verificationContainer:{
    // borderColor:'blue',
    // borderWidth:1,
    width:'95%',
    alignSelf:'center'
  },
  input: {
    width:'100%',
    backgroundColor:'white',
    borderRadius:5,
    marginVertical:20
  },
  buttonContainer:{
    backgroundColor: Colors.secondary,
    marginVertical:25,
    width:'95%',
    alignSelf:'center',
    borderRadius:15,
    padding:10
  },
  buttonText: {
    alignSelf:'center',
    fontWeight:'400',
    color:'white',
    fontSize:RFValue(18)
  }
});
