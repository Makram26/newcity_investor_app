import React from 'react'
import { Alert } from 'react-native'

export const validateName = (text) => {
    console.log(text);
    let reg = /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/i
    if(reg.test(text) == false) {
        // console.log(reg.test(text))
        Alert.alert("Alert!!","Please enter valid Name")
    }
    else {
        console.log(reg.test(text))
    }
}