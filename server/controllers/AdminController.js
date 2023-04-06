let dbConnection = require('./DatabaseController')

/**
 * Async fucntion to get all users and await from database response
 * @param {*} req //request from client
 * @param {*} res //response from server
 * @returns result data
 */
const getAllorSomeAdmins = async function (req, res) { 

    let statement = "SELECT * FROM admins";  
    
    if(Object.keys(req.query).length !== 0) { 

        let params = {} 

        for(let i = 0 ; i < Object.keys(req.query).length; i++) {
            let key = Object.keys(req.query)[i];
            let value = Object.values(req.query)[i]

            if(value != "" && (key != "created_at_init" && key != "created_at_final")){ 
                params[key] = value
            }

        }

        statement += " WHERE (created_at BETWEEN '" + req.query.created_at_init + "' AND '" + req.query.created_at_final + "')"

        for(let i = 0 ; i < Object.keys(params).length; i++) { 

            let key = Object.keys(params)[i];
            let value = Object.values(params)[i]
            let nextKey = Object.keys(params)[i+1];

            if(i == 0){
                statement += " AND ";
            }

            statement += key;
            statement += `='`;
            statement += value; 
            statement += `'` ;

            if(nextKey != undefined){
                statement += ` AND ` ;
            }
        }
    }

    let result = await dbConnection(statement) 
    
    if (result.includes("error")) {
        return res.status(500).json("Not possible to get all admins");
    } else if (result.length < 1) {
        return res.send("There is no admin in the database");
    }
    
    return res.send(result) 
} 

module.exports = {getAllorSomeAdmins}