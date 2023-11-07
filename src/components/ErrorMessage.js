import React from 'react'
import { StyleSheet, Text } from 'react-native'
// import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
// import AppText from './Text/AppText'

export default function ErrorMessage({error, visible}) {
    if (!visible || !error) return null;
    return (
        <Text style={styles.error}>*{error}</Text>
    )
}

const styles = StyleSheet.create({
    error: {
        color: 'red',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 5,
        // fontFamily: 'italic'
    }
})
