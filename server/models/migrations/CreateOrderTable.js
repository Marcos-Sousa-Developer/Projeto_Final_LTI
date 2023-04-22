let pool = require('../config/getLocaldbConfig')

const statement = "CREATE TABLE orders ( " +
                  "id int NOT NULL AUTO_INCREMENT, " +
                  "order_number bigint NOT NULL, " +
                  "order_date DATE NOT NULL, " +
                  "order_status varchar(255) NOT NULL, " +
                  "products_list varchar(255), " +
                  "total float NOT NULL, " +
                  "address varchar(255) NOT NULL, " +
                  "size float NOT NULL, " +
                  "id_supplier_product int, " +
                  "id_consumer int, " +
                  "id_vehicle int, " +
                  "created_at DATE DEFAULT (CURRENT_DATE), " +
                  "UNIQUE (order_number), " +
                  "PRIMARY KEY (id))";

pool.query(statement, function(error, result) {

    if (error) {
        throw error + '\n' + 'Not possible create table orders'
    }

    console.log("Table orders created"); 

    process.exit()
});