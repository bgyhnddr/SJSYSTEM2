<template>
	<div>
		<div v-if="checkPermission()">
			<button @click="addStaff" class="btn btn-default">添加開工員工</button>
			<div style="position:relative">
				<vue-strap-table :err-msg.sync="errMsg" :data.sync="data" :get-data-event="getData" :columns.sync="columns"></vue-strap-table>
			</div>
			<modal :show.sync="showStaffModel" effect="fade" width="400">
				<div slot="modal-header" class="modal-header">
					<h4 class="modal-title">
						開工員工
					</h4>
				</div>
				<div slot="modal-body" class="modal-body">
					<alert :type="alertType">
						{{alertText}}
					</alert>
					<bs-input :value.sync="submitData.name" label="名稱"></bs-input>
				</div>
				<div slot="modal-footer" class="modal-footer">
					<button type="button" class="btn btn-default" @click="showStaffModel=false">关闭</button>
					<button :disabled="submitting" type="button" class="btn btn-success" @click="submitStaff">確認</button>
				</div>
			</modal>
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
            spinner,
            modal,
            alert,
            bsInput
        },
        data() {
            let columns = [{
                "header": "名稱",
                "bind": "name"
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
                submitData: {
                    id: "",
                    name: ""
                },
                showStaffModel: false,
                data: {},
                serverMsg: "",
                columns: columns,
                errMsg: ""
            }
        },
        computed: {
            alertType() {
                return this.submitData.name ? "success" : "warning"
            },
            alertText() {
                if (this.serverMsg) {
                    return this.serverMsg;
                }
                let returnText = "請輸入";
                if (!this.submitData.name) {
                    returnText = "請輸入"
                }
                return returnText
            }
        },
        methods: {
            checkPermission,
            addStaff() {
                for (var i in this.submitData) {
                    this.submitData[i] = ""
                }
                this.showStaffModel = true
            },
            submitStaff() {
                if (this.submitData.name) {
                    var that = this
                    that.submitting = true
                    datasource.submitStaff(that.submitData).then(function(result) {
                        that.submitting = false
                        that.$broadcast("refreshData")
                        that.showStaffModel = false
                        that.serverMsg = ""
                    }).catch(function(err) {
                        that.submitting = false
                        that.serverMsg = err
                    })
                }
            },
            editStaff(row) {
                this.submitData.id = row.id
                this.submitData.name = row.name
                this.showStaffModel = true
            },
            deleteStaff(row) {
                if (window.confirm("是否確認刪除：" + row.name + "?")) {
                    var that = this
                    datasource.deleteStaff({
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
                this.editStaff(row)
            },
            "delete": function(row) {
                this.deleteStaff(row)
            },
            "getData": function(pageNum, countPerPage, filterKey, append) {
                let that = this
                datasource.getStaffs(pageNum, countPerPage, filterKey).then(function(result) {
                    if (append) {
                        that.data.end = result.end
                        that.data.list = that.data.list.concat(result.list)
                    } else {
                        that.data = result
                    }
                }).catch(function(err) {
                    that.errMsg = err
                })
            }
        },
        ready() {
            this.$broadcast("refreshData")
        }
    }
</script>
