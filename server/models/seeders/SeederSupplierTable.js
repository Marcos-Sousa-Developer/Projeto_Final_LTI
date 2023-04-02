let pool = require('../../config/dbConfigLocal')

const fake_supplier_data = require('../factories/FAKE_SUPPLIER_DATA.json')

const statement = "INSERT INTO suppliers (name, email, nif, mobile_number, address, status) VALUES ? "

let values = []

fake_supplier_data.forEach(row => {

    values.push([row.name, row.email, row.nif, row.mobile_number, row.address, row.status])     
});

pool.query(statement, [values], function(error, result){

    if (error) {
        throw error + '\n' + 'Not possible insert data into table suppliers'
    }

    console.log("Insert suppliers completed");
    
    process.exit();
});