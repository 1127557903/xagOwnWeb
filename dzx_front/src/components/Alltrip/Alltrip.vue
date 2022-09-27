<template>
    <div class="myTrip">
        <van-nav-bar left-arrow @click-left="$router.go(-1)">
        </van-nav-bar>
        <div class="card" v-for="item in mytrips" @click="changeTrip(item)" :key="item.id">
            <div class="title">{{item.name}}
                <span>（{{item.days}}日）</span>
            </div>
            <div class="topimg">
                <div class="img-box" >
                    <img :src="config.HTTP + item.imgs[0]" alt="" >
                </div>
            </div>
            <van-steps direction="vertical" :active="item.trip.length+1">
                <van-step v-for="one in item.trip" :key="one.id">
                    <h3>{{one.address}}</h3>
                </van-step>
            </van-steps>         
            <div class="bottom">
                <div class="left">
                    <!-- <van-button plain @click="updateC(item.id)" type="info" size="mini" v-if="item.recommend !== 1">上传推荐</van-button>
                    <van-button plain @click="cancelC(item.id)" type="danger" size="mini" v-else >取消推荐</van-button>
                    <van-button plain @click="changeTrip(item)" type="info" size="mini">修改</van-button> -->
                </div>
                <div class="right">{{item.creat_time | timeChange}}</div>
            </div>
        </div>

        <div style="padding: 10px;" v-if="isNeedMore">
            <van-button type="primary" @click="getMore" size="large">加载更多</van-button>
        </div>

        <van-dialog v-model="show" title="设置推荐信息" show-cancel-button @confirm="sureSet()" :before-close='beforeClose' >
            <van-uploader v-model="fileList" :deletable="true" multiple />
            <van-field v-model="setDetail.name" label="标题" />
            <van-field v-model="setDetail.days" type="digit" label="游玩天数" />
            <van-field name="checkboxGroup" label="复选框组">
                <template #input>
                    <van-checkbox-group v-model="setDetail.checkboxGroup" direction="horizontal">
                    <van-checkbox name="雪山" shape="square">雪山</van-checkbox>
                    <van-checkbox name="高地" shape="square">高地</van-checkbox>
                    </van-checkbox-group>
                </template>
            </van-field>
        </van-dialog>
    </div>
</template>
<script>
import { Dialog, Toast } from 'vant';
import {config} from "@/config/api"
import moment from 'moment'
import { timeChange } from "@/config/timefilter";
export default {
    name: 'Mytrip',
    data(){
        return {
            mytrips:[],
            show: false,
            setDetail:{
                name: '',
                days: '',
                checkboxGroup: []
            },
            // 显示id
            showId: '',
            fileList: [],
            page: 1,
            limit: 5,
            config,
            isNeedMore: false
        }
    },
    methods:{
        getMore(){
            this.page++
            this.getData()
        },
        getData(){
            const page = this.page
            const limit = this.limit
            let data = {
                page,
                limit
            }
            this.$http.post('/trip/selectall',data).then(res =>{
                if(!res || res.code !== '200') {
                    Dialog.alert({
                        title: '错误',
                        message: res.msg,
                        }).then(() => {
                    // on close
                    });
                    return
                }
                let list = res.data.map(item => {
                    return {...item,imgs:JSON.parse(item.imgs)}
                })
                if(this.page == 1){
                    this.mytrips = [...list]
                } else {
                    this.mytrips = [...this.mytrips,...list]
                }
                if(this.mytrips.length < res.count){
                     this.isNeedMore = true
                } else {
                    this.isNeedMore = false
                }
            })
        },
        // 修改路线
        changeTrip(value){
            this.$router.push({name: 'trip', params:value})
        },
        // 弹窗关闭前函数
        beforeClose(action,done){
            if(action == 'confirm'){
                done(false)
            } else {
                done()
            }
        },
        // 设置上传页面
        updateC(id){
            this.show = true
            this.showId = id
        },
        // 取消设为推荐
        cancelC(id) {
            console.log(id)
            const data = {
                id,
                recommend: 0
            }
            this.$http.post('/trip/cancelRecommend',data).then(res =>{
                if(res && res.code == '200') {
                    Toast('取消成功')
                    this.getData()
                }
            })
        },
        // 输入筛选
        handleCheck(){
            let { name,days,checkboxGroup } = this.setDetail
            if (!name) {
                Toast('请输入标题')
                return false
            }
            if (!days) {
                Toast('请输入推荐')
                return false
            }
            if (!checkboxGroup || checkboxGroup.length == 0) {
                Toast('请选择景区类型')
                return false
            }
            return true
        },
        // 确定设置为推荐
        sureSet(){
            if(!this.handleCheck()) {
                return
            }
            let { name,days,checkboxGroup } = this.setDetail
            let param = new FormData(); // 创建form对象
            this.fileList.forEach(item => {
                param.append("file[]", item.file); // 通过append向form对象添加数据
            })
            param.append("id",this.showId)
            param.append("recommend",1)
            param.append("name",name)
            param.append("days",days)
            param.append("checkboxGroup",checkboxGroup)
            this.$http.file('/trip/setRecommend',param).then(res =>{
                if(res && res.code == '200') {
                    Toast('设置成功')
                    this.show = false
                    this.getData()
                }
            })
        }
    },
    created(){
        this.getData()
    },
    filters: {
        timeChange(value) {
        return timeChange(value);
        },
    },
}
</script>
<style scoped lang="less" >
.myTrip{
    background: #fff;
    .card{
        padding: 10px;
        margin: 10px;
        background: #fff;
        border-radius: 5px;
        box-shadow: 4px 4px 8px;
        .title{
            font-size: 18px;
            font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-weight: 600;
            span{
                font-size: 12px;
            }
        }
        .topimg{
            .img-box{
                padding: 0 10px;
                height: 150px;
            }
            img{
                width: 100%;
                height: 150px;
                object-fit: cover;
            }
        }
        .bottom{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .right{
                font-size: 12px;
            }
        }
    }
}
</style>