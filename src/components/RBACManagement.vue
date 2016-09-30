<template>
    <ol class="breadcrumb">
        <li><a v-link="{ path: '/index' }">主頁</a></li>
        <li class="active">權限管理</li>
    </ol>
    <tabset>
        <tab header="用戶">
            <user-setting></user-setting>
        </tab>
        <tab header="角色">
            ...
        </tab>
        <tab header="角色配置">
            ...
        </tab>
        <tab header="權限">
            ...
        </tab>
        <tab header="權限配置">
            ...
        </tab>
    </tabset>
</template>

<script>
import {tab,tabset} from 'vue-strap'
import UserSetting from './UserSetting'

export default {
    components: {
        tabset,
        tab,
        UserSetting
    }
}
</script>