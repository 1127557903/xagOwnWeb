const http = {
    post: function(url,data={}) {
        return new Promise((reslove,reject)=>{
            let token = sessionStorage.getItem('boke_token')
            $.ajax({
                url: url,
                type: 'post',
                data: data,
                cache: false,
                headers: { 
                    "Authorization":`Bearer ${token}`
                },                
                success: function(res){
                    if (res.code === '200') {
                        reslove(res)
                    } else {
                        reject('请求失败')
                    } 
                },
                error: function(e) {
                    reject(e)
                }
            });
        })
    },
    get: function(url,data={}){
        return new Promise((reslove,reject)=>{
            let token = sessionStorage.getItem('boke_token')
            $.ajax({
                url: url,
                type: 'get',
                data: data,
                cache: false,
                headers: { 
                    "Authorization":`Bearer ${token}`
                },                
                success: function(res){
                    if (res.code === '200') {
                        reslove(res)
                    } else {
                        reject('请求失败')
                    } 
                },
                error: function(e) {
                    reject(e)
                }
            });
        })
    }
}