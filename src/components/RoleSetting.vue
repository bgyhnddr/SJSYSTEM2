<template>
	<div>
		<div v-if="checkPermission(['boss'])">
			<button @click="addRole" class="btn btn-default">添加角色</button>
			<div style="position:relative">
				<vue-strap-table :err-msg.sync="errMsg" :data.sync="data" :get-data-event="getData" :columns.sync="columns"></vue-strap-table>
			</div>
			<modal :show.sync="showRoleModel" effect="fade" width="400">
				<div slot="modal-header" class="modal-header">
					<h4 class="modal-title">
						角色
					</h4>
				</div>
				<div slot="modal-body" class="modal-body">
					<alert :type="alertType">
						{{alertText}}
					</alert>
					<bs-input v-if="!edit" :value.sync="submitData.code" label="編碼"></bs-input>
					<bs-input v-else :value.sync="submitData.code" label="編碼" readonly></bs-input>
					<bs-input :value.sync="submitData.name" label="名稱" required></bs-input>
				</div>
				<div slot="modal-footer" class="modal-footer">
					<button type="button" class="btn btn-default" @click="showRoleModel=false">关闭</button>
					<button :disabled="submitting" type="button" class="btn btn-success" @click="submitRole">確認</button>
				</div>
			</modal>
			<modal width="100%" :show.sync="showRolePermissionModel" effect="fade">
				<div slot="modal-header" class="modal-header">
					<h4 class="modal-title">
						角色權限
					</h4>
				</div>
				<div slot="modal-body" class="modal-body">
					<role-permission-setting :role="role"></role-permission-setting>
				</div>
				<div slot="modal-footer" class="modal-footer">
					<button type="button" class="btn btn-default" @click="showRolePermissionModel=false">关闭</button>
				</div>
			</modal>
		</div>
	</div>
</template>
<script>
    import VueStrapTable from './extend/vue-strap-table'
    import {
        modal,
        alert,
        input as bsInput
    } from 'vue-strap'
    import RBAC from '../api/RBAC'
    import RolePermissionSetting from './RolePermissionSetting'
    import checkPermission from '../extend/check-permission'

    export default {
        props: {
            selectable: {
                type: Boolean,
                default: false
            },
            selectEvent: {
                type: String,
                default: 'select'
            }
        },
        components: {
            VueStrapTable,
            modal,
            alert,
            bsInput,
            RolePermissionSetting
        },
        data() {
            let columns = [{
                "header": "編碼",
                "bind": "code"
            }, {
                "header": "名稱",
                "bind": "name"
            }, {
                "header": "操作",
                "type": "action",
                "items": [{
                    eventName: "editRolePermission",
                    tag: "button",
                    class: "btn-xs",
                    text: "編輯權限"
                }, {
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
            }]
            if (this.selectable) {
                columns.unshift({
                    "header": "",
                    "type": "action",
                    "items": [{
                        eventName: this.selectEvent,
                        tag: "button",
                        class: "btn-xs",
                        text: "選擇"
                    }]
                })
            }
            return {
                submitting: false,
                getData: "getData",
                submitData: {
                    code: "",
                    name: ""
                },
                edit: false,
                showRoleModel: false,
                showRolePermissionModel: false,
                data: {},
                role: "",
                serverMsg: "",
                columns: columns,
                errMsg: ""
            }
        },
        computed: {
            alertType() {
                return this.valid() ? "success" : "warning"
            },
            alertText() {
                if (this.serverMsg) {
                    return this.serverMsg;
                }
                let returnText = "請輸入";
                if (!this.valid()) {
                    returnText = "請輸入"
                }
                return returnText
            }
        },
        methods: {
            checkPermission,
            valid() {
                return this.submitData.code && this.submitData.name
            },
            addRole() {
                for (var i in this.submitData) {
                    this.submitData[i] = ""
                }
                this.edit = false
                this.showRoleModel = true
            },
            submitRole() {
                if (this.valid()) {
                    var that = this
                    that.submitting = true
                    RBAC.submitRole(that.submitData).then(function(result) {
                        that.submitting = false
                        that.$broadcast("refreshData")
                        that.showRoleModel = false
                        that.serverMsg = ""
                    }).catch(function(err) {
                        that.submitting = false
                        that.serverMsg = err
                    })
                }
            },
            editRole(code, name) {
                this.submitData.code = code
                this.submitData.name = name
                this.edit = true
                this.showRoleModel = true
            },
            deleteRole(code) {
                if (window.confirm("是否確認刪除：" + code + "?")) {
                    var that = this
                    RBAC.deleteRole({
                        code: code
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
                this.editRole(row.code, row.name)
            },
            "delete": function(row) {
                this.deleteRole(row.code)
            },
            "getData": function(pageNum, countPerPage, filterKey, append) {
                let that = this
                RBAC.getRoles(pageNum, countPerPage, filterKey).then(function(result) {
                    if (append) {
                        that.data.end = result.end
                        that.data.list = that.data.list.concat(result.list)
                    } else {
                        that.data = result
                    }
                }).catch(function(err) {
                    that.errMsg = err
                })
            },
            'editRolePermission': function(row) {
                this.showRolePermissionModel = true
                this.role = row.code
            }
        },
        ready() {
            this.$broadcast("refreshData")
        }
    }
</script>
