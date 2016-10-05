<template>
    <link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css">
    <navbar type="default">
        <!-- Brand as slot -->
        <a slot="brand" href="/" title="Home" class="navbar-brand">
            <img style="width: 200px;" src='../assets/img/logo.png'>
        </a>
        <!-- For right positioning use slot -->
        <li v-if="checkPermission()">
            <a v-link="{ path: '/index/table' }">工程管理</a>
        </li>
        <li v-if="checkPermission()">
            <a v-link="{ path: '/index/DataManagement' }">數據管理</a>
        </li>
        <li v-if="checkPermission()">
            <a href="link">報表</a>
        </li>
        <li v-if="checkPermission()">
            <a v-link="{ path: '/index/RBACManagement' }">权限管理</a>
        </li>
        <li v-if="checkPermission()">
            <a href="link">設定</a>
        </li>
        <dropdown slot="right" v-if="state.userInfo.name" :text="state.userInfo.name">
            <li><a @click="submitLogout">登出</a></li>
        </dropdown>
        <li v-else slot="right">
            <a @click="showModal">登录</a>
        </li>
    </navbar>
    <login-modal></login-modal>
</template>

<script>
    import {
        dropdown,
        navbar
    } from 'vue-strap'
    import LoginModal from './LoginModal'
    import authAPI from '../api/auth'
    import checkPermission from '../extend/check-permission'

    export default {
        data() {
            return {
                state: window.state
            }
        },
        components: {
            navbar,
            dropdown,
            LoginModal
        },
        methods: {
            showModal() {
                this.state.showLoginModal = true
            },
            checkPermission,
            submitLogout() {
                var vm = this;
                authAPI.logout().then(function() {
                    window.actions.logout()
                });
            }
        }
    }
</script>