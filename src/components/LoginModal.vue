<template>
    <spinner class="login_loading_zindex" size="md" text="loading..."></spinner>
    <modal class="login_zindex" backdrop="false" :show.sync="state.showLoginModal" effect="fade" width="400">
        <div slot="modal-header" class="modal-header">
            <h4 class="modal-title">
                用户登录
            </h4>
        </div>
        <div slot="modal-body" class="modal-body">
            <alert :type="alertType">
                {{alertText}}
            </alert>
            <form-group :valid.sync="valid.all">
                <form-group :valid.sync="valid.account">
                    <bs-input :value.sync="loginInfo.account" label="账号" required></bs-input>
                </form-group>
                <form-group :valid.sync="valid.password">
                    <bs-input :value.sync="loginInfo.password" label="密码" type="password" required></bs-input>
                </form-group>
            </form-group>
        </div>
        <div slot="modal-footer" class="modal-footer">
            <button type="button" class="btn btn-success" @click="submitLogin">登录</button>
        </div>
    </modal>
</template>

<script>
import { modal,formGroup,alert,spinner,input as bsInput }  from 'vue-strap'
import authAPI from '../api/auth'

export default {
    data(){
        return {
            state:window.state,
            valid:{},
            serverMsg:"",
            loginInfo:{
                account:"",
                password:""
            }
        }
    },
    components:{
        modal,
        formGroup,
        bsInput,
        alert,
        spinner
    },
    computed: { 
        alertType(){
            return this.valid.all?"success":"warning"
        },
        alertText(){
            if(this.serverMsg)
            {
                return this.serverMsg;
            }
            let returnText = "请登录";
            if(!this.valid.account && !this.valid.password)
            {
                returnText= "请填写账号密码"
            }
            else if(!this.valid.account)
            {
                returnText= "请填写正确的账号"
            }
            else if(!this.valid.password)
            {
                returnText="请填写正确的密码"
            }
            return returnText
        }
    },
    methods:{
        submitLogin(){
            var that = this
            if(that.valid.all)
            {
                that.$broadcast('show::spinner')
                authAPI.login(that.loginInfo).then(function(result){
                    that.state.userInfo = result
                    that.state.showLoginModal = false
                    that.$broadcast('hide::spinner')
                },function(err){
                    that.serverMsg=err
                    that.$broadcast('hide::spinner')
                })
            }
        }
    }
}
</script>
<style>
    .login_zindex {
        z-index: 10000000 !important;
    }
    .login_loading_zindex{
        z-index: 10000001 !important;
    }
</style>