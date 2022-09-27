const uploadFiles = (url,filesArr,params)=>{
    return new Promise((resolve,reject) => {
        var formData = new FormData()
        filesArr.forEach(item => {
            formData.append('file',item)
        })
        for(let one in params){
            formData.append(one,params[one])
        }
        $.ajax({
            type: 'post',
            data: formData,
            contentType : false,
            processData : false,
            url,
            success: (res) => {
               resolve(res)
            },
            fail:(err) => {
                reject(err)
            }
        })
    })
}