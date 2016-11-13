<template>
	<div>
		<div v-if="checkPermission(['boss'])">
			<div style="position:relative">
				<vue-strap-table :err-msg.sync="errMsg" :data.sync="data" :get-data-event="getData" :columns="columns"></vue-strap-table>
			</div>
			<modal :show.sync="showUserModel" effect="fade" width="400">
				<div slot="modal-header" class="modal-header">
					<h4 class="modal-title">
						用戶
					</h4>
				</div>
				<div slot="modal-body" class="modal-body">
					<alert :type="alertType">
						{{alertText}}
					</alert>
					<bs-input :value.sync="account" label="账号"></bs-input>
				</div>
				<div slot="modal-footer" class="modal-footer">
					<button type="button" class="btn btn-default" @click="showUserModel=false">关闭</button>
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
    import view_quotation from '../api/view_quotation'
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
            bsInput
        },
        data() {
            let columns = [{
                "header": "賬號",
                "bind": "account"
            }, {
                "header": "密碼",
                "bind": "password"
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
                showUserModel: false,
                data: {},
                serverMsg: "",
                user: "",
                columns: columns,
                errMsg: ""
            }
        },
        computed: {
            alertType() {
                return this.account ? "success" : "warning"
            },
            alertText() {
                if (this.serverMsg) {
                    return this.serverMsg;
                }
                let returnText = "请输入创建账户";
                if (!this.account) {
                    returnText = "请输入创建账户"
                }
                return returnText
            }
        },
        methods: {
            checkPermission
        },
        events: {
            "getData": function(pageNum, countPerPage, filterKey, append) {
                let that = this
                view_quotation.getUsers(pageNum, countPerPage, filterKey).then(function(result) {
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
