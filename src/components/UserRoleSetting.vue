<template>
    <div v-if="checkPermission()">
        <button @click="addUserRole" class="btn btn-default">添加用戶角色</button>
        <div style="position:relative">
            <spinner size="md" text="loading..."></spinner>
            <vue-strap-table :err-msg.sync="errMsg" :data.sync="data" :get-data-event="getData" :columns.sync="columns"></vue-strap-table>
        </div>
        <div :class="{'in':showUserRoleModel}" class="modal fade" :style="{zIndex:(showUserRoleModel?undefined:-1)}" style="display:block;overflow-y:auto;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">
                            添加用戶角色
                        </h4>
                    </div>
                    <div class="modal-body">
                        <label>{{role_name}}</label>
                        <button type="button" class="btn btn-default" @click="showRoleModel=true">選擇角色</button>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" @click="showUserRoleModel=false">关闭</button>
                        <button :disabled="submitting" type="button" class="btn btn-success" @click="submitUserRole">確認</button>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div :class="{'in':showRoleModel}" class="modal fade" :style="{zIndex:(showRoleModel?undefined:-1)}" style="display:block;overflow-y:auto;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">
                            選擇角色
                        </h4>
                    </div>
                    <div class="modal-body">
                        <role-setting :selectable="selectable"></role-setting>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" @click="showRoleModel=false">关闭</button>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
    </div>
</template>
<script>
import VueStrapTable from './extend/vue-strap-table'
import {
    spinner,
    modal,
    formGroup,
    alert,
    input as bsInput
} from 'vue-strap'
import RBAC from '../api/RBAC'
import RoleSetting from './RoleSetting'
import checkPermission from '../extend/check-permission'

export default {
    props: {
        user: {
            type: String,
            require: true
        }
    },
    watch: {
        'user': function(val) {
            this.$broadcast("refreshData")
        }
    },
    components: {
        VueStrapTable,
        spinner,
        modal,
        formGroup,
        alert,
        bsInput,
        RoleSetting
    },
    data() {
        return {
            selectable: true,
            submitting: false,
            getData: "getData",
            role_code: "",
            role_name: "",
            id: "",
            showUserRoleModel: false,
            showRoleModel: false,
            data: {},
            serverMsg: "",
            columns: [{
                "header": "账号",
                "bind": "user_account"
            }, {
                "header": "角色",
                "bind": "role_name"
            }, {
                "header": "創建日期",
                "bind": "created_at"
            }, {
                "header": "修改時間",
                "bind": "updated_at"
            }, {
                "header": "操作",
                "type": "action",
                "items": [{
                    eventName: "edit",
                    tag: "button",
                    class: "btn-xs",
                    text: "修改"
                }, {
                    eventName: "delete",
                    tag: "button",
                    class: "btn-xs",
                    text: "刪除"
                }]
            }],
            errMsg: ""
        }
    },
    methods: {
        checkPermission,
        addUserRole() {
            this.id = ""
            this.role_code = ""
            this.role_name = ""
            this.showUserRoleModel = true
        },
        submitUserRole() {
            var that = this
            that.submitting = true
            RBAC.submitUserRole({
                id: that.id,
                role_code: that.role_code,
                user_account: that.user
            }).then(function(result) {
                that.submitting = false
                that.$broadcast("refreshData")
                that.showUserRoleModel = false
                that.serverMsg = ""
                that.id = ""
                that.role_code = ""
                that.role_name = ""
            }).catch(function(err) {
                that.submitting = false
                that.serverMsg = err
            })
        },
        editUserRole(row) {
            this.id = row.id
            this.role_code = row.role_code
            this.role_name = row.role_name
            this.showUserRoleModel = true
        },
        deleteUserRole(row) {
            if (window.confirm("是否確認刪除：" + row.role_name + "?")) {
                var that = this
                RBAC.deleteUserRole({
                    id: row.id
                }).then(function(result) {
                    that.$broadcast("refreshData")
                }).catch(function(err) {
                    window.alert(err)
                })
            }
        }
    },
    events: {
        "edit": function(row) {
            this.editUserRole(row)
        },
        "delete": function(row) {
            this.deleteUserRole(row)
        },
        "getData": function(pageNum, countPerPage, filterKey, append) {
            let that = this
            that.$broadcast('show::spinner')
            RBAC.getUserRoles(that.user, pageNum, countPerPage, filterKey).then(function(result) {
                that.$broadcast('hide::spinner')
                var list = result.list.map((o) => {
                    if (o.role) {
                        o.role_name = o.role.name
                        return o
                    } else {
                        return o
                    }
                })

                if (append) {
                    that.data.end = result.end
                    that.data.list = that.data.list.concat(result.list)
                } else {
                    that.data = result
                }
            }).catch(function(err) {
                that.errMsg = err
                that.$broadcast('hide::spinner')
            })
        },
        "select": function(row) {
            console.log(row)
            this.role_code = row.code
            this.role_name = row.name
            this.showRoleModel = false
        }
    },
    ready() {
        this.$broadcast("refreshData")
    }
}
</script>
