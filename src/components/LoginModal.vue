<template>
	<div @keyup.enter="submitLogin">
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
				<div class="form-group">
					<label class="control-label">账号</label>
					<input v-el:account v-model="loginInfo.account" class="form-control"  type="text">
                </div>
				<bs-input :value.sync="loginInfo.password" label="密码" type="password"></bs-input>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button type="button" class="btn btn-success" @click="submitLogin">登录</button>
			</div>
		</modal>
	</div>
</template>

<script>
    import {
        modal,
        alert,
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
            alert
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
                    authAPI.login(that.loginInfo).then(function(result) {
                        that.state.userInfo = result
                        that.state.showLoginModal = false
                    }).catch(function(err) {
                        console.log(err)
                        that.serverMsg = err
                    })
                }
            }
        },
        watch: {
            'state.showLoginModal': function(val) {
                this.$els.account.focus()
            }
        },
        ready() {
            this.$els.account.focus()
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
