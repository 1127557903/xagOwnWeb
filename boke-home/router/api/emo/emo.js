const express = require("express");
const router = express.Router();
const db = require('../../../connect/connect')

router.get('/selectAll',async (req,res)=>{
    let sql = 'select * from emoticon order by type'
    let sql1 = 'select * from code_map where code=?'
    let emo = await db(sql)
    let code = await db(sql1,['emo'])

    res.send({
        code: '200',
        data:{
            emo,
            code
        }
    })
})

module.exports = router