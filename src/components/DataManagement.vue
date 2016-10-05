<template>
    <template v-if="checkPermission()">
        <ol class="breadcrumb">
            <li><a v-link="{ path: '/index' }">主頁</a></li>
            <li class="active">數據管理</li>
        </ol>
        <tabset>
            <tab header="工程類型管理">
                ...
            </tab>
            <tab header="工程負責人">
                ...
            </tab>
            <tab header="盤">
                ...
            </tab>
            <tab header="物業公司">
                ...
            </tab>
            <tab header="開工員工">
                ...
            </tab>
            <tab header="外判資料">
                ...
            </tab>
        </tabset>
    </template>
</template>

<script>
    import {
        tab,
        tabset
    } from 'vue-strap'
    import checkPermission from '../extend/check-permission'

    export default {
        components: {
            tabset,
            tab
        },
        methods: {
            checkPermission
        }
    }
</script>