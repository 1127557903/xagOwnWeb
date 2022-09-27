const mysql = require('mysql')
const db = require('../config/sql')
var pool = mysql.createPool(db)

function connect(sql,params){
    return new Promise((resolve,reject)=>{
        pool.getConnection((err,conn) => {
            if (err) {
                reject(err)
                return
            }
            conn.query(sql,params,(err,res)=>{
                if(err) {
                    reject(err)
                    return
                }
                conn.release();
                resolve(res)
            })
        })
    })
}
module.exports = connect