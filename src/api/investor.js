import client from './client'

const getInvestments = () => {
    return client.get(
      '/object/investment/get_investments'
    );
};

const getRequestHistory = () => {
    return client.get(
      '/object/investment/request_history'
    );
};

const getAuthorizedPerson = () => {
    return client.get(
      '/object/investment/get_authorised_person'
    );
};

const getPaymentHistory = () => {
    return client.get(
      '/object/investment/payment_history'
    );
};

const searchInvestments = (investID) => {
    const data = {
        jsonrpc: "2.0",
        params: {
                kwargs:{      
                    investment_id:[investID]
                }
            }    
    }
    // console.log("ChargesData:")
    // console.log(data)
    const response = client.post('/object/investment/search_open_files',data)
    // console.log("getInventory API Response:", response)
    return response
}

const searchSummary = (investID) => {
    const data = {
        jsonrpc: "2.0",
        params: {
                kwargs:{      
                    "investment_id":[investID]
                }
            }    
    }
    // console.log("ChargesData:")
    // console.log(data)
    const response = client.post('/object/investment/investment_details',data)
    // console.log("getInventory API Response:", response)
    return response
}

const postOTP = (otp, requestID) => {
    const data = {
        jsonrpc: "2.0",
        params: {
            args:[],
            kwargs:{                
                otp: otp,
                request_id:requestID
            }
        }    
    }
    const response = client.post('/object/investment/create_investment_request',data)
    console.log("postOTP API Response:", data)
    return response
}

const postInvestment = (investID,openFile,member_data) => {
    const data = {
        jsonrpc: "2.0",
        params: {
                args:[],
                kwargs:{                
                    transaction_type:"open_file",
                    investment_id:investID,
                    member_data:[member_data],
                    open_files: openFile
                }
            }    
    }
    // console.log("ChargesData:")
    // console.log(data)
    const response = client.post('/object/investment/create_investment_request',data)
    console.log("getInventory API Response:", data)
    return response
}

const postNewUser = (name,cnic,mobile,street,city,state,country) => {
    const data = {
        jsonrpc: "2.0",
        params: {
            args:[],
            kwargs:{                
                transaction_type: "authorised_person",
                person_data: [
                    {
                        name: name,
                        cnic: cnic,
                        mobile: mobile,
                        street: street,
                        city: city,
                        state: state,
                        country: country,
                    }
                ]
            }

        }    
    }
    // console.log("ChargesData:")
    // console.log(data)
    const response = client.post('/object/res.partner/create_authorised_person_request',data)
    console.log("post Request API Response:", data)
    return response
}

const postEditUser = (mobile,street,city,state,country) => {
    const data = {
        jsonrpc: "2.0",
        params: {
            args:[],
            kwargs:{            
                transaction_type: "authorised_person",    
                person_data: [
                    {
                        mobile: mobile,
                        street: street,
                        city: city,
                        state: state,
                        country: country,
                        update_existing_person: "yes"
                    }
                ]
            }

        }    
    }
    // console.log("ChargesData:")
    // console.log(data)
    const response = client.post('/object/res.partner/edit_authorised_person',data)
    console.log("edit Request API Response:", data)
    return response
}

export default {
    getInvestments,
    getRequestHistory,
    searchInvestments,
    postInvestment,
    getAuthorizedPerson,
    getPaymentHistory,
    searchSummary,
    postNewUser,
    postEditUser,
    postOTP
}