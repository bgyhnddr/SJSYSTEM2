<template>
	<div v-if="checkPermission()">
		<button @click="addProjectManager" class="btn btn-default">添加工程負責人</button>
		<div style="position:relative">
			<spinner size="md" text="loading..."></spinner>
			<vue-strap-table :err-msg.sync="errMsg" :data.sync="data" :get-data-event="getData" :columns.sync="columns"></vue-strap-table>
		</div>
		<div :class="{'in':showProjectManagerModel}" class="modal fade" :style="{zIndex:(showProjectManagerModel?undefined:-1)}"
			style="display:block;overflow-y:auto;">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h4 class="modal-title">
							工程負責人
						</h4>
					</div>
					<div class="modal-body">
						<label>{{account}}</label>
						<button type="button" class="btn btn-default" @click="showUserModel=true">選擇用戶</button>
					</div>
					<div class="modal-footer">
						<label>{{serverMsg}}<label>
                        <button type="button" class="btn btn-default" @click="showProjectManagerModel=false">关闭</button>
                        <button :disabled="submitting" type="button" class="btn btn-success" @click="submitProjectManager">確認</button>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div :class="{'in':showUserModel}" class="modal fade" :style="{zIndex:(showUserModel?undefined:-1)}" style="display:block;overflow-y:auto;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">
                            選擇用户
                        </h4>
                    </div>
                    <div class="modal-body">
                        <user-setting :selectable="selectable"></user-setting>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" @click="showUserModel=false">关闭</button>
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
        alert,
        input as bsInput
    } from 'vue-strap'
    import datasource from '../api/datasource'
    import UserSetting from './UserSetting'
    import checkPermission from '../extend/check-permission'

    export default {
        props: {
            selectable: {
                type: Boolean,
                default: false
            },
            selectEvent: {
                type: String,
                default: "select"
            },
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
            alert,
            bsInput,
            UserSetting
        },
        data() {
            var columns = [{
                "header": "账号",
                "bind": "user_account"
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
                account: "",
                id: "",
                showProjectManagerModel: false,
                showUserModel: false,
                data: {},
                serverMsg: "",
                columns: columns,
                errMsg: ""
            }
        },
        methods: {
            checkPermission,
            addProjectManager() {
                this.id = ""
                this.account = ""
                this.showProjectManagerModel = true
            },
            submitProjectManager() {
                var that = this
                that.submitting = true
                datasource.submitProjectManager({
                    id: that.id,
                    user_account: that.account
                }).then(function(result) {
                    that.submitting = false
                    that.$broadcast("refreshData")
                    that.showProjectManagerModel = false
                    that.serverMsg = ""
                    that.id = ""
                    that.account = ""
                }).catch(function(err) {
                    that.submitting = false
                    that.serverMsg = err
                })
            },
            editProjectManager(row) {
                this.id = row.id
                this.account = row.user_account
                this.showProjectManagerModel = true
            },
            deleteProjectManager(row) {
                if (window.confirm("是否確認刪除：" + row.user_account + "?")) {
                    var that = this
                    datasource.deleteUserRole({
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
                this.editProjectManager(row)
            },
            "delete": function(row) {
                this.deleteProjectManager(row)
            },
            "getData": function(pageNum, countPerPage, filterKey, append) {
                let that = this
                that.$broadcast('show::spinner')
                datasource.getProjectManagers(pageNum, countPerPage, filterKey).then(function(result) {
                    that.$broadcast('hide::spinner')
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
                this.account = row.account
                this.showUserModel = false
            }
        },
        ready() {
            this.$broadcast("refreshData")
        }
    }
</script>