<template>
	<div>
		<div v-if="checkPermission(['workhour_and_outsource'])">
			<button @click="addOutSourceContractor" class="btn btn-default">添加外判資料</button>
			<div style="position:relative">
				<vue-strap-table :err-msg.sync="errMsg" :data.sync="data" :get-data-event="getData" :columns.sync="columns"></vue-strap-table>
			</div>
			<modal :show.sync="showOutSourceContractorModel" effect="fade" width="400">
				<div slot="modal-header" class="modal-header">
					<h4 class="modal-title">
						外判資料
					</h4>
				</div>
				<div slot="modal-body" class="modal-body">
					<alert :type="alertType">{{alertText}}</alert>
					<bs-input v-show="false" :value.sync="submitData.id"></bs-input>
					<bs-input :value.sync="submitData.code" label="判頭編號"></bs-input>
					<bs-input :value.sync="submitData.company" label="判頭公司名"></bs-input>
					<bs-input :value.sync="submitData.address" label="地址"></bs-input>
					<bs-input :value.sync="submitData.address_en" label="地址（英文）"></bs-input>
					<bs-input :value.sync="submitData.bill_address" label="賬單地址"></bs-input>
					<bs-input :value.sync="submitData.bill_address_en" label="賬單地址（英文）"></bs-input>
					<bs-input :value.sync="submitData.attn" label="聯繫人"></bs-input>
					<bs-input :value.sync="submitData.attn_en" label="聯繫人（英文）"></bs-input>
					<bs-input :value.sync="submitData.tel" label="電話"></bs-input>
					<bs-input :value.sync="submitData.fax" label="傳真"></bs-input>
					<bs-input :value.sync="submitData.email" label="電郵"></bs-input>
					<bs-input :value.sync="submitData.comments" type="textarea" label="備註"></bs-input>
				</div>
				<div slot="modal-footer" class="modal-footer">
					<button type="button" class="btn btn-default" @click="showOutSourceContractorModel=false">关闭</button>
					<button :disabled="submitting" type="button" class="btn btn-success" @click="submitOutSourceContractor">確認</button>
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
            modal,
            alert,
            bsInput
        },
        data() {
            let columns = [{
                "header": "判頭編號",
                "bind": "code"
            }, {
                "header": "判頭公司名",
                "bind": "company"
            }, {
                "header": "地址",
                "bind": "address"
            }, {
                "header": "地址（英文）",
                "bind": "address_en"
            }, {
                "header": "賬單地址",
                "bind": "bill_address"
            }, {
                "header": "賬單地址（英文）",
                "bind": "bill_address_en"
            }, {
                "header": "聯繫人",
                "bind": "attn"
            }, {
                "header": "聯繫人（英文）",
                "bind": "attn_en"
            }, {
                "header": "電話",
                "bind": "tel"
            }, {
                "header": "傳真",
                "bind": "fax"
            }, {
                "header": "電郵",
                "bind": "email"
            }, {
                "header": "備註",
                "bind": "comments"
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
                    code: "",
                    company: "",
                    address: "",
                    address_en: "",
                    bill_address: "",
                    bill_address_en: "",
                    attn: "",
                    attn_en: "",
                    tel: "",
                    fax: "",
                    email: "",
                    comments: ""
                },
                showOutSourceContractorModel: false,
                data: {},
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
                return this.submitData.code
            },
            addOutSourceContractor() {
                for (var i in this.submitData) {
                    this.submitData[i] = ""
                }
                this.showOutSourceContractorModel = true
            },
            submitOutSourceContractor() {
                if (this.valid()) {
                    var that = this
                    that.submitting = true
                    datasource.submitOutSourceContractor(that.submitData).then(function(result) {
                        that.submitting = false
                        that.$broadcast("refreshData")
                        that.showOutSourceContractorModel = false
                        that.serverMsg = ""
                    }).catch(function(err) {
                        that.submitting = false
                        that.serverMsg = err
                    })
                }
            },
            editOutSourceContractor(row) {
                for (var i in this.submitData) {
                    this.submitData[i] = row[i]
                }
                this.showOutSourceContractorModel = true
            },
            deleteOutSourceContractor(row) {
                if (window.confirm("是否確認刪除：" + row.code + "?")) {
                    var that = this
                    datasource.deleteOutSourceContractor({
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
                this.editOutSourceContractor(row)
            },
            "delete": function(row) {
                this.deleteOutSourceContractor(row)
            },
            "getData": function(pageNum, countPerPage, filterKey, append) {
                let that = this
                datasource.getOutSourceContractors(pageNum, countPerPage, filterKey).then(function(result) {
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
