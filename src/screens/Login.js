import React, { useState, useEffect, useContext } from 'react'
import {
    StyleSheet, Text, View, Dimensions, Image, TouchableOpacity,
    Alert,
    Keyboard, KeyboardAvoidingView, ActivityIndicator, TextInput,
    Platform
} from 'react-native'

import Colors from '../constants/Colors'

import { Formik } from 'formik'
import * as Yup from 'yup'

import AuthApi from '../api/auth'
import useAuth from '../auth/useAuth';
import AuthContext from '../auth/context';

import Feather from 'react-native-vector-icons/Feather';

import ErrorMessage from '../components/ErrorMessage'
import { useNavigation } from '@react-navigation/native';
import NetInfo from "@react-native-community/netinfo";


const window = Dimensions.get('window')

const validationSchema = Yup.object().shape({
    userName: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required")
})

export default function Login() {
    const { setUser, setUserID } = useContext(AuthContext)
    const [keyShow, setKeyShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isInternetReachable, setIsInternetReachable] = useState(false)
    const [secureTextEntry, setsecureTextEntry] = useState(false)
    const navigation = useNavigation();

    useEffect(() => {
        // Subscribe
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsInternetReachable(state.isInternetReachable);
            // console.log("Connection type", state.type);
            // console.log("Is internet Reachable?", isInternetReachable);
            // if (isInternetReachable == false) {
            //     Alert.alert("Attention", "Please have an Internet Connection")
            // }
        });
        return () => {
            unsubscribe();
        };
    }, [isInternetReachable])


    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', keyboardDidHide)
        return () => {
            Keyboard.addListener('keyboardDidShow', keyboardDidShow).remove();
            Keyboard.addListener('keyboardDidHide', keyboardDidHide).remove();
        }
    }, [])

    const keyboardDidShow = () => {
        setKeyShow(true);
    };

    const keyboardDidHide = () => {
        setKeyShow(false);
    };

    const updateSecureTextEntry = () => {
        setsecureTextEntry(!secureTextEntry);
    }
    const handleSubmit = async ({ userName, password }) => {
        if (isInternetReachable) {
            setLoading(true);
            const response = await AuthApi.login(userName, password)
            const sessionString = response.headers['set-cookie'][0];
            const firstEqual = sessionString.indexOf('=');
            const firstColon = sessionString.indexOf(';');
            const sessionID = sessionString.substring(firstEqual + 1, firstColon)
            setLoading(false);
            if (response && response.data && response.data.error && response.data.error.data && response.data.error.data.message) {
                Alert.alert("Attention", "Invalid Email & Password ")
            }
            else {
                //  return setLoading(false);
                useAuth().logIn(
                    sessionID,
                    response.data.result.uid,
                    response.data.result.partner_id,
                    response.data.result.name,
                )
                setUser(sessionID);
                setUserID(response.data.result.uid)
                // console.log("login Successful")
                // console.log(sessionID)
            }
        } else if (isInternetReachable == false) {
            Alert.alert("Attention", "Please Check Your Internet Connection")
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.screen}
        >
            <View style={styles.imageContainer}>
                {keyShow && (
                    <Image
                        source={require('../assets/images/logo.png')}
                        style={{ width: '50%', height: "60%", alignSelf: 'center' }}
                        resizeMode="contain"
                    />
                )}
                {keyShow == false && (
                    <Image
                        source={require('../assets/images/logo.png')}
                        style={{ width: "70%", height: "80%", alignSelf: 'center' }}
                        resizeMode="contain"
                    />
                )}
            </View>
            <Formik
                initialValues={{ userName: '', password: '' }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
            >
                {({
                    values,
                    handleChange,
                    handleSubmit,
                    errors,
                    setFieldTouched,
                    touched,
                    setFieldValue
                }) => (
                    <>
                        <View style={styles.signupContainer}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Email Address</Text>
                            <TextInput
                                placeholder="Enter Email Address"
                                style={{ borderBottomColor: 'white', paddingTop  : 8, paddingBottom:  5,  borderBottomWidth: 1, color: 'white',  } }
                                placeholderTextColor="white"
                                autoCapitalize="none"
                                autoCorrect={false}
                                onBlur={() => setFieldTouched("userName")}
                                onChangeText={(text) => setFieldValue('userName', text)}
                                value={values['userName']}
                            />
                            <ErrorMessage error={errors.userName} visible={touched.userName} />

                            <Text style={{ marginTop: 10, color: 'white', fontWeight: 'bold', fontSize: 20 }}>Password</Text>

                            <View style={{paddingTop  : 5, paddingBottom:  5,flexDirection:'row',borderBottomColor: 'white', borderBottomWidth: 1, color: 'white'}}>
                                <TextInput
                                    placeholder="Enter Password"
                                    style={{ flex:1,color:'white'}}
                                    placeholderTextColor="white"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    secureTextEntry={secureTextEntry ? false : true}
                                    onBlur={() => setFieldTouched("password")}
                                    // onChangeText={handleChange('password')}
                                    onChangeText={(text) => setFieldValue('password', text)}
                                    value={values['password']}

                                />
                                <TouchableOpacity onPress={updateSecureTextEntry} style={{ justifyContent: "space-evenly" }} >
                                    {
                                    secureTextEntry ?
                                        <Feather name="eye-off" color="white" size={20} />
                                        :
                                        <Feather name="eye" color="white" size={20} />
                                    }
                                </TouchableOpacity> 
                            </View>
                            <ErrorMessage error={errors.password} visible={touched.password} />

                            <TouchableOpacity
                                onPress={() => navigation.navigate('forgetpassword')}
                                style={styles.forgetPass}>
                                <Text style={styles.forgetText}>Forgot Password?</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}

                                onPress={handleSubmit}
                            >
                                {loading ?
                                    <ActivityIndicator size="large" color="white" /> :
                                    <Text style={styles.buttonContainer}>Log In</Text>
                                }

                            </TouchableOpacity>

                        </View>
                    </>
                )}
            </Formik>
            {/* } */}

        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.primary
    },
    imageContainer: {
        width: Dimensions.get('window').width * 1,
        height: Dimensions.get('window').width * 0.55,
        overflow: 'hidden',
        alignSelf: 'center',
        alignItems: 'flex-start',
        justifyContent: 'center',
        flex: 0.37,
        // borderColor:'red',
        // borderWidth:1,
        backgroundColor: '#316394',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
    },
    topText: {
        // borderWidth:1,
        // borderColor:'blue',
        // flexDirection:'row',
        width: '90%',
        // justifyContent:'space-between',
        alignSelf: 'center',
        padding: 10
    },
    topButtonYes: {
        borderBottomColor: '#FF6442',
        borderBottomWidth: 3,
        padding: 5,
        width: '30%',
        alignItems: 'center',
        alignSelf: 'center',
        // borderColor:'green',
        // borderWidth:1
    },
    topButtonNo: {
        // borderBottomColor:'#FF6442',
        // borderBottomWidth:1,
        padding: 5,
        width: '30%',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
    buttonText1: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    signupContainer: {
        flex: 0.57,
        // borderColor:'green',
        // borderWidth:1,
        // backgroundColor: Colo,
        width: '50%',
        alignSelf: 'center',
        marginTop: 10,
    },
    buttonContainer: {
        color: 'white',
        alignSelf: 'center',
        fontWeight: '600'
    },
    placeholderText: {
        // borderColor: 'gold', 
        // borderWidth: 1, 
        marginBottom: 5,
        height: 35,
        backgroundColor: 'white',
        elevation: 5,
        shadowOpacity: 0.26,
        shadowRadius: 6,
        shadowColor: 'black',
        shadowOffset: {
            width: 0, height: 2
        },
        shadowRadius: 6,
    },
    forgetPass: {
        marginTop: 10
    },
    forgetText: {
        color: Colors.secondary
    },
    Imagesection: {
        // height:210
        height: '40%',
        marginTop: -10
    },
    ImageSet: {
        // width: 360,
        height: '90%',
        resizeMode: 'stretch'
    },
    LogoImage: {
        position: "absolute",
        alignSelf: "center",
        marginTop: 100,
    },
    button: {
        backgroundColor: Colors.secondary,
        borderRadius: 25,
        width: '100%',
        alignSelf: 'center',
        padding: 10,
        marginTop: 30
    }
})
