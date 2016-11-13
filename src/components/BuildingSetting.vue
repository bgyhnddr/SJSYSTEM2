<template>
	<div>
		<div v-if="checkPermission(['datasource'])">
			<button @click="addBuilding" class="btn btn-default">添加盤</button>
			<div style="position:relative">
				<vue-strap-table :err-msg.sync="errMsg" :data.sync="data" :get-data-event="getData" :columns.sync="columns"></vue-strap-table>
			</div>
			<modal :show.sync="showBuildingModel" effect="fade" :large="true">
				<div slot="modal-header" class="modal-header">
					<h4 class="modal-title">
						盤
					</h4>
				</div>
				<div slot="modal-body" class="modal-body">
					<alert :type="alertType">{{alertText}}</alert>
					<bs-input v-show="false" :value.sync="submitData.id"></bs-input>
					<bs-input :value.sync="submitData.name" label="名稱"></bs-input>
					<bs-input :value.sync="submitData.name_en" label="名稱(英文)"></bs-input>
					<bs-input :value.sync="submitData.address" label="地址" pattern=""></bs-input>
					<bs-input :value.sync="submitData.address_en" label="地址（英文）" pattern=""></bs-input>
					<bs-input :value.sync="submitData.attn" label="聯繫人" pattern=""></bs-input>
					<bs-input :value.sync="submitData.attn_en" label="聯繫人（英文）" pattern=""></bs-input>
					<bs-input :value.sync="submitData.tel" label="電話" pattern=""></bs-input>
					<bs-input :value.sync="submitData.fax" label="傳真" pattern=""></bs-input>
					<bs-input :value.sync="submitData.mgt_tel" label="管理處電話" pattern=""></bs-input>
					<bs-input :value.sync="submitData.mgt_fax" label="管理處傳真" pattern=""></bs-input>
					<bs-input :value.sync="submitData.email" label="電郵" pattern=""></bs-input>
				</div>
				<div slot="modal-footer" class="modal-footer">
					<button type="button" class="btn btn-default" @click="showBuildingModel=false">关闭</button>
					<button :disabled="submitting" type="button" class="btn btn-success" @click="submitBuilding">確認</button>
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
                "header": "名稱",
                "bind": "name"
            }, {
                "header": "名稱(英文)",
                "bind": "name_en"
            }, {
                "header": "地址",
                "bind": "address"
            }, {
                "header": "地址（英文）",
                "bind": "address_en"
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
                "header": "管理處電話",
                "bind": "mgt_tel"
            }, {
                "header": "管理處傳真",
                "bind": "mgt_fax"
            }, {
                "header": "電郵",
                "bind": "email"
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
                    name: "",
                    name_en: "",
                    address: "",
                    address_en: "",
                    attn: "",
                    attn_en: "",
                    tel: "",
                    fax: "",
                    mgt_tel: "",
                    mgt_fax: "",
                    email: ""
                },
                showBuildingModel: false,
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
                return this.submitData.name
            },
            addBuilding() {
                for (var i in this.submitData) {
                    this.submitData[i] = ""
                }
                this.showBuildingModel = true
            },
            submitBuilding() {
                if (this.valid()) {
                    var that = this
                    that.submitting = true
                    datasource.submitBuilding(that.submitData).then(function(result) {
                        that.submitting = false
                        that.$broadcast("refreshData")
                        that.showBuildingModel = false
                        that.serverMsg = ""
                    }).catch(function(err) {
                        that.submitting = false
                        that.serverMsg = err
                    })
                }
            },
            editBuilding(row) {
                for (var i in this.submitData) {
                    this.submitData[i] = row[i]
                }
                this.showBuildingModel = true
            },
            deleteBuilding(row) {
                if (window.confirm("是否確認刪除：" + row.name + "?")) {
                    var that = this
                    datasource.deleteBuilding({
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
                this.editBuilding(row)
            },
            "delete": function(row) {
                this.deleteBuilding(row)
            },
            "getData": function(pageNum, countPerPage, filterKey, append) {
                let that = this
                datasource.getBuildings(pageNum, countPerPage, filterKey).then(function(result) {
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
