<template>
    <link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css">
    <navbar type="default">
        <!-- Brand as slot -->
        <a slot="brand" href="/" title="Home" class="navbar-brand">
        <img style="width: 200px;" src='../assets/img/logo.png'>
        </a>
        <!-- For right positioning use slot -->
        <li>
            <a v-link="{ path: '/index/table' }">工程管理</a>
        </li>
        <li>
            <a v-link="{ path: '/index/DataManagement' }">數據管理</a>
        </li>
        <li>
            <a href="link">報表</a>
        </li>
        <li>
            <a v-link="{ path: '/index/RBACManagement' }">权限管理</a>
        </li>
        <li>
            <a href="link">設定</a>
        </li>
        <dropdown slot="right" v-if="getUser.name" :text="getUser.name">
            <li><a @click="submitLogout">登出</a></li>
        </dropdown>
        <li v-if="!getUser.name" slot="right">
            <a @click="showLoginModal">登录</a>
        </li>
    </navbar>
    <login-modal></login-modal>
</template>

<script>
import { dropdown,navbar }  from 'vue-strap'
import { getUser } from '../vuex/getters'
import { showLoginModal,logout } from '../vuex/actions'
import LoginModal from './LoginModal'
import authAPI from '../api/auth'

export default { 
    vuex: {
        getters: {
            getUser
        },
        actions:{
            showLoginModal,
            logout
        }
    },
    components:{
        navbar,
        dropdown,
        LoginModal
    },
    methods:{
        submitLogout(){
            var vm = this;
            authAPI.logout().then(function(){
                vm.logout()
            });
        }
    } 
}
</script>