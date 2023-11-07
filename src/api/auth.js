import client from './client'

const endpointPostLogin = '/web/session/authenticate';

const login = (username, password) => {
    const loginObj = {
      jsonrpc: '2.0',
      params: {
        login: username,
        password: password,
        db: 'PROD_20_11_2020',
        // db: 'TestOn_31-jan-2022'
      },
    };
  
    return client.post(endpointPostLogin, loginObj);
  };
  
export default {
  login,
};