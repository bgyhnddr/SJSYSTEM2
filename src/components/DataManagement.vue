<template>
    <div v-if="checkPermission()">
        <navbar type="default">
            <li v-if="checkPermission()">
                <a v-link="{ path: '/index/DataManagement/ProjectType' }">工程類型管理</a>
            </li>
            <li v-if="checkPermission()">
                <a v-link="{ path: '/index/DataManagement/ProjectManager' }">工程負責人</a>
            </li>
            <li v-if="checkPermission()">
                <a v-link="{ path: '/index/DataManagement/Building' }">盤</a>
            </li>
            <li v-if="checkPermission()">
                <a v-link="{ path: '/index/DataManagement/PropertyManagementCo' }">物業公司</a>
            </li>
            <li v-if="checkPermission()">
                <a v-link="{ path: '/index/DataManagement/Staff' }">開工員工</a>
            </li>
            <li v-if="checkPermission()">
                <a v-link="{ path: '/index/DataManagement/OutSourceContractor' }">外判資料</a>
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