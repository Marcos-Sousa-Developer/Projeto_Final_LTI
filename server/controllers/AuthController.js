let dbConnection = require('./DatabaseController') 
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const poolData = require('../config/poolCognitoConfig')
const jwt = require('../config/jwtConfig')

//pass our user pool data to identify cognito user pool 
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

/**
 * Verify token from client
 * @param  client_result 
 * @returns boolean (verify integrity)
 */
const verifyTokens = async (client_result) => {
  let isAccessTokenValid =  await jwt.verifyUserAutentecity(client_result.accessToken, client_result.client_id)
  let isIdTokenValid =  await jwt.verifyUserAutentecity(client_result.idToken, client_result.client_id)
  return isAccessTokenValid === isIdTokenValid
}

/**
 * @param {*} result 
 * @description set cookie for user
 * @returns list with uid and expire date
 */
const setCookie = (result,res) => {

  let act = {accessToken: result.getAccessToken().getJwtToken()}

  let idt = {idToken: result.getIdToken().getJwtToken()}

  let rft = {refreshToken: result.getRefreshToken().getJwtToken}

  const accessToken = jwt.generateAccessToken(act)
  const idToken = jwt.generateAccessToken(idt)
  const refreshToken = jwt.generateAccessToken(rft) 

  const username = result.getIdToken().payload['cognito:username']; 

  const uid = jwt.encryptID(username)  

  let dateExpire = new Date(Date.now() + 7200000) //date now and more 30 minutes

  res.cookie("accessToken", accessToken, {
    expires: dateExpire, 
    httpOnly: true})

  res.cookie("idToken", idToken, {
    expires: dateExpire, 
    httpOnly: true})
  
  res.cookie("refreshToken", refreshToken, {
    expires: dateExpire,
    httpOnly: true})
  
  res.cookie("userSession", uid, {
    expires: dateExpire,
    httpOnly: true})

}

/**
 * Handling user sign in
 * @param authenticationData
 * @param userData
 * @param client_result
 * @param response
 * @returns newPromise with succes or fail
 */
const handlerSignIn = (authenticationData, userData,res) => {

  // that represents the authentication details of a user who is attempting to authenticate with Amazon Cognito
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

  //that represents a user in an Amazon Cognito user pool
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  return new Promise((resolve, reject) => {
      
    //that is used to authenticate a user with their password  
    cognitoUser.authenticateUser(authenticationDetails, {

      //if user is succeful authenticated
      onSuccess: (result) => {
        setCookie(result,res)
        resolve(true);
        
      },

      //if user fail to authenticate
      onFailure: (err) => {
        console.log(err)
        reject(false);
      },

      // This callback is invoked when a user's password is expired or requires a reset
      // Here, you can prompt the user to provide a new password and then call cognitoUser.completeNewPasswordChallenge()
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        cognitoUser.completeNewPasswordChallenge(password, [], {
          onSuccess: (result) => {
            setCookie(result,res)
            resolve(true);
          },
          onFailure: (err) => {
            console.log(err)
            reject(false);
          },
        });
      }

    });
  }); 

}

/**
* Sign in user
* @param req //request from client
* @param res //response from server
* @returns: a user data and token
* */
const signIn = async (req, res) => { 

  let email = req.query.email
  let password = req.query.password
  let client_result = req.query.result

    const authenticationData = {
      Username: email,
      Password: password
    };

    const userData = {
      Username: email,
      Pool: userPool
    };
    
    const isValidTokens = await verifyTokens(client_result) 

    if(isValidTokens) {

      let data = await handlerSignIn(authenticationData, userData, res)
      
      return res.send(data) 
    }

    return res.send(false); 
};


const registerUser = async (req,res) => {

  let name = req.query.name
  let password = req.query.verify
  let email = req.query.email
  let user_type = req.query.user_type
  let uid = req.query.uid  

  let tokenFinal = jwt.encryptID(password)

  const statement = "INSERT INTO " +  user_type + "s (uid, verify, name, email) VALUES ?"; 

  let result = await dbConnection(statement, [[uid,tokenFinal, name,email]]);

  if (result === "error") {
    return res.send(null);

  }

  return res.send("Consumer has been created");

}

/**
 * Verify password 
 * @params request from client
 * @return boolean
 */
const verifyPassword = async (req, res) => { 

  try {

    const uid_encrypt = req.cookies.userSession;
    let uid_decrypt = jwt.decryptID(uid_encrypt) 

    const statement = "SELECT * FROM users WHERE uid='"+uid_decrypt+"';"
    let result = await dbConnection(statement) 
    const user_type = result[0].user_type + "s"

    const statement2 = "SELECT * FROM " + user_type + " WHERE uid='"+uid_decrypt+"';"
    let result2 = await dbConnection(statement2) 
    const tokenDecrypt = jwt.decryptID(result2[0].verify)

    return res.send(tokenDecrypt === req.query.token);
  }

  catch {

    return res.send(false);
  }
    



}


/**
 * Verify user type
 * @params request from client
 * @return userType
 */
const getUserType = async (req, res) => { 

  try {
    
    const uid_encrypt = req.cookies.userSession;

    let uid_decrypt = jwt.decryptID(uid_encrypt) 

    const statement = "SELECT * FROM users WHERE uid='"+uid_decrypt+"';"

    let result = await dbConnection(statement) 

    const user_type = result[0].user_type

    const name = result[0].name.split(" ")[0]

    return res.send([user_type,name]);
  }
  catch(error) {
    res.clearCookie('refreshToken', { httpOnly: true, path: '/' });
    res.clearCookie('identification', { httpOnly: true, path: '/' });
    res.clearCookie('idToken', { httpOnly: true, path: '/' });
    res.clearCookie('userSession', { httpOnly: true, path: '/' });
    res.clearCookie('accessToken', { httpOnly: true, path: '/' });
    return res.send(false);
}

}

const logout = async (req, res) => { 

  try {
    res.clearCookie('refreshToken', { httpOnly: true, path: '/' });
    res.clearCookie('identification', { httpOnly: true, path: '/' });
    res.clearCookie('idToken', { httpOnly: true, path: '/' });
    res.clearCookie('userSession', { httpOnly: true, path: '/' });
    res.clearCookie('accessToken', { httpOnly: true, path: '/' });
    res.status(200).send('LogOut');
  }
  catch (error) {
    res.status(500);
  }


}

module.exports = {signIn, registerUser, verifyPassword, getUserType, logout}