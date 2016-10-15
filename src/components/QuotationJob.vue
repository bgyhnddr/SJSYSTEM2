<template>
	<div v-if="checkPermission()">
		<button @click="addQuotationJob" class="btn btn-default">添加工作内容</button>
		<div style="position:relative">
			<spinner size="md" text="loading..."></spinner>
			<vue-strap-table :has-filter="hasFilter" :err-msg.sync="errMsg" :data.sync="data" :get-data-event="getData" :columns.sync="columns"></vue-strap-table>
		</div>
		<modal :show.sync="showQuotationJobModel" effect="fade" width="400">
			<div slot="modal-header" class="modal-header">
				<h4 class="modal-title">
					工作内容
				</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<alert :type="alertType">
					{{alertText}}
				</alert>
				<bs-input :value.sync="submitData.content" label="內容"></bs-input>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button type="button" class="btn btn-default" @click="showQuotationJobModel=false">关闭</button>
				<button :disabled="submitting" type="button" class="btn btn-success" @click="submitQuotationJob">確認</button>
			</div>
		</modal>
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
            },
            quotationNo: {
                type: String,
                default: ""
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
                "header": "序號",
                "type": "index"
            }, {
                "header": "内容",
                "bind": "content"
            }, {
                "header": "成本單價",
                "bind": "cost"
            }, {
                "header": "出街單價",
                "bind": "retail"
            }, {
                "header": "數量",
                "bind": "count"
            }, {
                "header": "操作",
                "type": "action",
                "items": [{
                    eventName: "up",
                    tag: "button",
                    class: "btn-xs",
                    text: "上移"
                }, {
                    eventName: "down",
                    tag: "button",
                    class: "btn-xs",
                    text: "下移"
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
                    id: "",
                    content: "",
                    cost: "",
                    retail: "",
                    count: ""
                },
                edit: false,
                showQuotationJobModel: false,
                data: {},
                serverMsg: "",
                columns: columns,
                errMsg: "",
                hasFilter: false
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
                return this.submitData.content
            },
            addQuotationJob() {
                for (var i in this.submitData) {
                    this.submitData[i] = ""
                }
                this.edit = false
                this.showQuotationJob = true
            },
            submitQuotationJob() {
                if (this.valid()) {
                    var that = this
                    that.submitting = true
                    view_quotation.submitQuotationJob({
                        id: that.submitData.id,
                        content: that.submitData.content,
                        cost: that.submitData.cost,
                        retail: that.submitData.retail,
                        count: that.submitData.count,
                        quotation_no: that.quotationNo
                    }).then(function(result) {
                        that.submitting = false
                        that.$broadcast("refreshData")
                        that.showJob = false
                        that.serverMsg = ""
                    }).catch(function(err) {
                        that.submitting = false
                        that.serverMsg = err
                    })
                }
            },
            editQuotationJob(row) {
                this.submitData.id = row.id
                this.submitData.content = row.content
                this.edit = true
                this.showQuotationJobModel = true
            },
            deleteQuotationJob(row) {
                if (window.confirm("是否確認刪除：" + row.content + "?")) {
                    var that = this
                    view_quotation.deleteQuotationQuotationJob({
                        id: row.id
                    }).then(function(result) {
                        that.$broadcast("refreshData")
                    }).catch(function(err) {
                        window.alert(err)
                    })
                }
            },
            up(row) {
                var that = this
                view_quotation.upQuotationJob({
                    index: row.index
                }).then(function(result) {
                    that.$broadcast("refreshData")
                }).catch(function(err) {
                    window.alert(err)
                })
            },
            down(row) {
                var that = this
                view_quotation.downQuotationJob({
                    index: row.index
                }).then(function(result) {
                    that.$broadcast("refreshData")
                }).catch(function(err) {
                    window.alert(err)
                })
            },
            refreshData() {
                let that = this
                that.$broadcast('show::spinner')
                view_quotation.getQuotationJobs({
                    quotationNo: that.quotationNo
                }).then(function(result) {
                    that.$broadcast('hide::spinner')
                    that.data = result
                }).catch(function(err) {
                    that.errMsg = err
                    that.$broadcast('hide::spinner')
                })
            }
        },
        events: {
            "edit": function(row) {
                this.editQuotationJob(row)
            },
            "delete": function(row) {
                this.deleteQuotationJob(row)
            },
            "getData": function(pageNum, countPerPage, filterKey, append) {
                this.refreshData()
            },
            "up": function(row) {
                this.up(row)
            },
            "down": function(row) {
                this.down(row)
            },
            'refreshQuotationJob': function() {
                this.refreshData()
            }
        },
        watch: {
            'quotationNo': function(val, oldVal) {
                if (val) {
                    this.$broadcast("refreshData")
                }
            }
        }
    }
</script>