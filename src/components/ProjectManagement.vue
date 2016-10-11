<template>
    <div v-if="checkPermission()">
        <navbar type="default">
            <li v-if="checkPermission()">
                <a v-link="{ path: '/index/ProjectManagement/Project' }">新建報價單</a>
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