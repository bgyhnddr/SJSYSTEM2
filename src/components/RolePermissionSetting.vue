<template>
    <div v-if="checkPermission()">
        <button @click="addRolePermission" class="btn btn-default">添加角色權限</button>
        <div style="position:relative">
            <spinner size="md" text="loading..."></spinner>
            <vue-strap-table :err-msg.sync="errMsg" :data.sync="data" :get-data-event="getData" :columns.sync="columns"></vue-strap-table>
        </div>
        <div :class="{'in':showRolePermissionModel}" class="modal fade" :style="{zIndex:(showRolePermissionModel?undefined:-1)}" style="display:block;overflow-y:auto;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">
                            添加角色權限
                        </h4>
                    </div>
                    <div class="modal-body">
                        <label>{{permission_name}}</label>
                        <button type="button" class="btn btn-default" @click="showPermissionModel=true">選擇權限</button>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" @click="showRolePermissionModel=false">关闭</button>
                        <button :disabled="submitting" type="button" class="btn btn-success" @click="submitRolePermission">確認</button>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div :class="{'in':showPermissionModel}" class="modal fade" :style="{zIndex:(showPermissionModel?undefined:-1)}" style="display:block;overflow-y:auto;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">
                            選擇權限
                        </h4>
                    </div>
                    <div class="modal-body">
                        <permission-setting :selectable="selectable"></permission-setting>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" @click="showPermissionModel=false">关闭</button>
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
import PermissionSetting from './PermissionSetting'
import checkPermission from '../extend/check-permission'

export default {
    props: {
        role: {
            type: String,
            require: true
        }
    },
    watch: {
        'role': function(val) {
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
        PermissionSetting
    },
    data() {
        return {
            selectable: true,
            submitting: false,
            getData: "getData",
            permission_code: "",
            permission_name: "",
            id: "",
            showRolePermissionModel: false,
            showPermissionModel: false,
            data: {},
            serverMsg: "",
            columns: [{
                "header": "角色",
                "bind": "role_name"
            }, {
                "header": "權限",
                "bind": "permission_name"
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
        addRolePermission() {
            this.id = ""
            this.permission_code = ""
            this.permission_name = ""
            this.showRolePermissionModel = true
        },
        submitRolePermission() {
            var that = this
            that.submitting = true
            RBAC.submitRolePermission({
                id: that.id,
                permission_code: that.permission_code,
                role_code: that.role
            }).then(function(result) {
                that.submitting = false
                that.$broadcast("refreshData")
                that.showRolePermissionModel = false
                that.serverMsg = ""
                that.id = ""
                that.permission_code = ""
                that.permission_name = ""
            }).catch(function(err) {
                that.submitting = false
                that.serverMsg = err
            })
        },
        editRolePermission(row) {
            this.id = row.id
            this.permission_code = row.permission_code
            this.permission_name = row.permission_name
            this.showRolePermissionModel = true
        },
        deleteRolePermission(row) {
            if (window.confirm("是否確認刪除：" + row.permission_name + "?")) {
                var that = this
                RBAC.deleteRolePermission({
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
            this.editRolePermission(row)
        },
        "delete": function(row) {
            this.deleteRolePermission(row)
        },
        "getData": function(pageNum, countPerPage, filterKey, append) {
            let that = this
            that.$broadcast('show::spinner')
            RBAC.getRolePermissions(that.role, pageNum, countPerPage, filterKey).then(function(result) {
                that.$broadcast('hide::spinner')
                var list = result.list.map((o) => {
                    if (o.permission) {
                        o.permission_name = o.permission.name
                    }
                    if (o.role) {
                        o.role_name = o.role.name
                    }
                    return o
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
            this.permission_code = row.code
            this.permission_name = row.name
            this.showPermissionModel = false
        }
    },
    ready() {
        this.$broadcast("refreshData")
    }
}
</script>
