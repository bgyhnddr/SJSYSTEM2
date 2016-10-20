<template>
    <spinner class="login_loading_zindex" size="md" text="loading..."></spinner>
    <modal @keyup.enter="submitLogin" class="login_zindex" backdrop="false" :show.sync="state.showLoginModal" effect="fade" width="400">
        <div slot="modal-header" class="modal-header">
            <h4 class="modal-title">
                用户登录
            </h4>
        </div>
        <div slot="modal-body" class="modal-body">
            <alert :type="alertType">
                {{alertText}}
            </alert>
            <bs-input :value.sync="loginInfo.account" label="账号"></bs-input>
            <bs-input :value.sync="loginInfo.password" label="密码" type="password"></bs-input>
        </div>
        <div slot="modal-footer" class="modal-footer">
            <button type="button" class="btn btn-success" @click="submitLogin">登录</button>
        </div>
    </modal>
</template>

<script>
    import {
        modal,
        alert,
        spinner,
        input as bsInput
    } from 'vue-strap'
    import authAPI from '../api/auth'

    export default {
        data() {
            return {
                state: window.state,
                serverMsg: "",
                loginInfo: {
                    account: "",
                    password: ""
                }
            }
        },
        components: {
            modal,
            bsInput,
            alert,
            spinner
        },
        computed: {
            alertType() {
                return this.valid() ? "success" : "warning"
            },
            alertText() {
                if (this.serverMsg) {
                    return this.serverMsg;
                }
                let returnText = "请登录";
                if (!this.loginInfo.account && !this.loginInfo.password) {
                    returnText = "请填写账号密码"
                } else if (!this.loginInfo.account) {
                    returnText = "请填写正确的账号"
                } else if (!this.loginInfo.password) {
                    returnText = "请填写正确的密码"
                }
                return returnText
            }
        },
        methods: {
            valid() {
                return this.loginInfo.account && this.loginInfo.password
            },
            submitLogin() {
                var that = this
                if (that.valid()) {
                    that.$broadcast('show::spinner')
                    authAPI.login(that.loginInfo).then(function(result) {
                        that.state.userInfo = result
                        that.state.showLoginModal = false
                        that.$broadcast('hide::spinner')
                    }).catch(function(err) {
                        that.serverMsg = err
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
    
    .login_loading_zindex {
        z-index: 10000001 !important;
    }
</style>