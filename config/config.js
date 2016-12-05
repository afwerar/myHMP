/**
 * Created by afwerar on 2016/11/27.
 */
module.exports={
    ports:{
        serialport:['COM1','COM3'],
        socketport:[7000],
        webport: 3000
    },
    mysql:{
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'afwerar19920203',
        database: 'myHMP'
    },
    sessionoptions:{
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'afwerar19920203',
        database: 'myHMP',
        checkExpirationInterval: 900000,
        expiration: 86400000,
        createDatabaseTable: true,
        connectionLimit: 1,
        schema: {
            tableName: 'sessions',
            columnNames: {
                session_id: 'session_id',
                expires: 'expires',
                data: 'data'
            }
        }
    }
}