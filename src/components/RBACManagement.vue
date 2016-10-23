<template>
    <div v-if="checkPermission()">
        <navbar type="default">
            <a slot="brand" class="navbar-brand">權限管理</a>
            <li v-if="checkPermission()">
                <a v-link="{ path: '/index/RBACManagement/User' }">用戶</a>
            </li>
            <li v-if="checkPermission()">
                <a v-link="{ path: '/index/RBACManagement/Role' }">角色</a>
            </li>
            <li v-if="checkPermission()">
                <a v-link="{ path: '/index/RBACManagement/Permission' }">權限</a>
            </li>
        </navbar>
        <router-view></router-view>
    </div>
</template>

<script>
    import {
        navbar
    } from 'vue-strap'
    import checkPermission from '../extend/check-permission'

    export default {
        components: {
            navbar
        },
        methods: {
            checkPermission
        }
    }
</script>