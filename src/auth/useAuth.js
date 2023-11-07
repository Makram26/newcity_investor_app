import authStorage from './storage';

export default useAuth = () => {
  const logIn = (sessionId, userID, partnerID, userName) => {
    authStorage.storeSession(sessionId, userID,partnerID, userName);
  };

  const logOut = () => {
    authStorage.deleteSession();
  };

  return {logOut, logIn};
};
