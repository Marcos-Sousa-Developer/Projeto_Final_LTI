const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const poolData = require('../config/poolCognitoConfig')
const jwt = require('../config/jwtConfig')

//pass our user pool data to identify cognito user pool 
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const verifyTokens = async (client_result) => {

  let isAccessTokenValid =  await jwt.verifyUserAutentecity(client_result.accessToken, client_result.client_id)
  let isIdTokenValid =  await jwt.verifyUserAutentecity(client_result.idToken, client_result.client_id)
  return isAccessTokenValid === isIdTokenValid
}

/**
* Sign in user
* @param {*} req //request from client
* @param {*} res //response from server
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
    
    // that represents the authentication details of a user who is attempting to authenticate with Amazon Cognito
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  
    const userData = {
      Username: email,
      Pool: userPool
    };
    
    //that represents a user in an Amazon Cognito user pool
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
    const isValidTokens = await verifyTokens(client_result) 

    console.log(isValidTokens)

    new Promise((resolve, reject) => {
      
      //that is used to authenticate a user with their password  
      cognitoUser.authenticateUser(authenticationDetails, {

        //if user is succeful authenticated
        onSuccess: (result) => {

          if(isValidTokens) {

            let act = {accessToken: result.getAccessToken().getJwtToken()}

            let idt = {idToken: result.getAccessToken().getJwtToken()}

            let rft = {refreshToken: result.getRefreshToken().getJwtToken}

            const accessToken = jwt.generateAccessToken(act)
            const idToken = jwt.generateAccessToken(idt)
            const refreshToken = jwt.generateAccessToken(rft) 

            const uid = jwt.encryptID(client_result.client_id)  

            let dateExpire = new Date(Date.now() + 1800000) //date now and more 30 minutes

            res.cookie("accessToken", accessToken, {
              expires: dateExpire, 
              httpOnly: true})

            res.cookie("idToken", idToken, {
              expires: dateExpire, 
              httpOnly: true})
            
            res.cookie("refreshToken", refreshToken, {
              expires: dateExpire, 
              httpOnly: true})
            
            res.cookie("userSession", uid, {expires: dateExpire})
  
            return res.send({uid: uid,active: true, dateExpire:dateExpire});
          }
          return res.send({active: false});
        },

        //if user fail to authenticate
        onFailure: (err) => {
          reject(err);
        },

        // This callback is invoked when a user's password is expired or requires a reset
        // Here, you can prompt the user to provide a new password and then call cognitoUser.completeNewPasswordChallenge()
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          cognitoUser.completeNewPasswordChallenge(password, [], {
            onSuccess: (result) => {
              resolve(result.getAccessToken().getJwtToken());
            },
            onFailure: (err) => {
              reject(err);
            },
          });
        }

      });
    }); 
};

/**
* Sign up user
* @param {*} req //request from client
* @param {*} res //response from server
* @returns: boolean (is user created)
* */
const signUp = (req, res) => { 

    const attributeList = [];
  
    const dataEmail = {
      Name: 'email',
      Value: email
    };
    
    //AmazonCognitoIdentity.CognitoUserAttribute
    const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
  
    attributeList.push(attributeEmail);
  
    return new Promise((resolve, reject) => {

      //register a new user in an Amazon Cognito user pool.
      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.user);
        }
      });
    });
};

/**
 * @params request from client
 * @return userType
 */
const userType = (req, res) => { 

  console.log(req.cookies)
  
  return res.send("consumer");
}



module.exports = {signIn, signUp,userType}