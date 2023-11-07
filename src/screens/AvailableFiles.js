import React, {useEffect, useState,useContext} from 'react'
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    Image, 
    FlatList, 
    ActivityIndicator,
    RefreshControl,
    ScrollView
} from 'react-native'

import Colors from '../constants/Colors'
import ReloadButton from '../components/Button/ReloadButton'
import Header from '../components/Header'

import AuthContext from '../auth/context';
import useAuth from '../auth/useAuth';

import { RFValue } from "react-native-responsive-fontsize";

import Icon from 'react-native-vector-icons/FontAwesome5'

import requestApi from '../api/investor'

export default function AvailableFiles({navigation}) {
    const {user, setUser} = useContext(AuthContext);

    const [fileData, SetFileData] = useState([])
    const [loading, SetLoading] = useState(false)
    const [errors, setErrors] =useState(false)

    useEffect(() => {
        loadAvailableFiles()
    }, [])

    const loadAvailableFiles = async () => {
        SetLoading(true)
        SetFileData([]);
        const response = await requestApi.getInvestments();
        SetLoading(false)
        if (response.ok && response.data ){
            SetFileData(response.data)
            // console.log("availableFiles", response.data)
            setErrors(false)
        }
        else{
            console.log("error in getting data")
            return setErrors(true)
        }
    }

    // useEffect(() => {
    //     setTimeout(() => {
    //         useAuth().logOut();
    //         setUser(null);
    //     }, 300000);
    // }, []);

    return (
       
        <View style={styles.screen}>
            <Header
                name="Available Files"
                onPress={() => navigation.navigate('Dashboard')}
            />
            <View style={{borderBottomWidth:0.5,borderColor:"grey"}}/>
            {errors && ( <>
                <Text style={styles.errorText}>Couldn't retrive Files</Text>
                <ReloadButton onPress={loadAvailableFiles}/>
            </>)}
            
            
                <FlatList
                    data={fileData}
                    keyExtractor={(stock) => stock.id}
                    renderItem={({item, index}) => {
                    return (
                            <TouchableOpacity style={{marginVertical:10}} onPress={()=>navigation.navigate('AvailableFilesDetails', item)}>
                                <View style={styles.cardContainer}>
                                    <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:10,flex:1}}>
                                        <View style={{flexDirection:'column',alignItems:'center'}}>
                                            <Text style={{fontWeight:'bold',fontSize:RFValue(12)}}>Investment Name</Text>
                                            <Text style={{fontSize:RFValue(11)}}>{item.investment_name}</Text>
                                        </View>
                                        <View style={{flexDirection:'column',alignItems:'center'}}>
                                            <Text style={{fontWeight:'bold',fontSize:RFValue(12)}}>Open Files</Text>
                                            <Text style={{fontSize:RFValue(11)}}>{item.no_of_open_files}</Text>
                                        </View>
                                        <View style={{flexDirection:'column',alignItems:'center'}}>
                                            <Text style={{fontWeight:'bold',fontSize:RFValue(12)}}>Sector</Text>
                                            <Text style={{fontSize:RFValue(11)}}>{item.sector_name}</Text>
                                        </View>
                                        <View style={{flexDirection:'column',alignItems:"center"}}>
                                            <Text style={{fontWeight:'bold',fontSize:RFValue(12)}}>Amount</Text>
                                            <Text style={{fontSize:RFValue(11)}}>{item.total_deal_amount && item.total_deal_amount?item.total_deal_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):""}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                    )
                    }}
                    refreshControl= {<RefreshControl refreshing={loading} onRefresh={loadAvailableFiles} />}
                /> 
            
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
        fontSize:RFValue(22)
    },
    headerIcon: {
        marginRight:10
    },
    errorText: {
        fontSize: RFValue(25),
        color: 'white',
        alignSelf:'center',
        marginTop:20
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
        backgroundColor: 'white'
    },
    tableCell1: {
        borderWidth:0.5,
        borderColor: 'black',
        padding:5,
        flex:1.5,
        textAlign:'center',
        alignItems:'center',
        backgroundColor: 'white'
    },
    tableText: {
        color:'black',
        fontWeight:'bold',
        fontSize: RFValue(14)
    },
    tableHText: {
        color:Colors.primary,
        fontWeight:'bold',
        fontSize: RFValue(14)
    },
    detailsContainer: {
        width:'90%',
        alignSelf:'center',
        // flexDirection:'row'
        // borderColor:'red',
        // borderWidth:1,
        borderRadius:5,
        overflow:'hidden',
        marginVertical:15
    },
    cardContainer: {
        backgroundColor:'white',
        padding:10,
        width:'90%',
        alignSelf:'center',
        borderRadius:16,
        marginTop:5,
        elevation:5,
        shadowOpacity:0.26,
        shadowRadius:6,
        shadowColor:'black',
        shadowOffset:{
            width:0, height:2
        },
        shadowRadius:6,
        flex:0.5
    }
})
