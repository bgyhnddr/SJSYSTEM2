<template>
    <template v-if="checkPermission()">
        <tabset>
            <tab v-if="checkPermission()" header="用戶">
                <user-setting></user-setting>
            </tab>
            <tab v-if="checkPermission()" header="角色">
                <role-setting></role-setting>
            </tab>
            <tab v-if="checkPermission()" header="角色配置">
                ...
            </tab>
            <tab v-if="checkPermission()" header="權限">
                ...
            </tab>
            <tab v-if="checkPermission()" header="權限配置">
                ...
            </tab>
        </tabset>
    </template>
</template>

<script>
import {tab,tabset} from 'vue-strap'
import UserSetting from './UserSetting'
import RoleSetting from './RoleSetting'
import checkPermission from '../extend/check-permission'

export default {
    components: {
        tabset,
        tab,
        UserSetting,
        RoleSetting
    },
    methods:{
        checkPermission
    }
}
</script>