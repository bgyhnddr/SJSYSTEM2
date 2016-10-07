<template>
    <div v-if="checkPermission()">
        <button @click="addPropertyManagementCo" class="btn btn-default">添加物業公司</button>
        <div style="position:relative">
            <spinner size="md" text="loading..."></spinner>
            <vue-strap-table :err-msg.sync="errMsg" :data.sync="data" :get-data-event="getData" :columns.sync="columns"></vue-strap-table>
        </div>
        <modal :show.sync="showPropertyManagementCoModel" effect="fade" width="400">
            <div slot="modal-header" class="modal-header">
                <h4 class="modal-title">
                添加物業公司
                </h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <alert :type="alertType">
                    {{alertText}}
                </alert>
                <form-group :valid.sync="valid.all">
                    <bs-input :value.sync="submitData.code" label="代號" required></bs-input>
                    <bs-input :value.sync="submitData.name" label="名稱" required></bs-input>
                    <bs-input :value.sync="submitData.name_en" label="英文名" required></bs-input>
                </form-group>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="showPropertyManagementCoModel=false">关闭</button>
                <button :disabled="submitting" type="button" class="btn btn-success" @click="submitPropertyManagementCo">確認</button>
            </div>
        </modal>
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
        formGroup,
        alert,
        bsInput
    },
    data() {
        let columns = [{
            "header": "代號",
            "bind": "code"
        }, {
            "header": "名稱",
            "bind": "name"
        }, {
            "header": "英文名",
            "bind": "name_en"
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
            valid: {},
            submitData: {
                id: "",
                code: "",
                name: "",
                name_en: ""
            },
            showPropertyManagementCoModel: false,
            data: {},
            serverMsg: "",
            columns: columns,
            errMsg: ""
        }
    },
    computed: {
        alertType() {
            return this.valid.all ? "success" : "warning"
        },
        alertText() {
            if (this.serverMsg) {
                return this.serverMsg;
            }
            let returnText = "請輸入";
            if (!this.valid.all) {
                returnText = "請輸入"
            }
            return returnText
        }
    },
    methods: {
        checkPermission,
        addPropertyManagementCo() {
            this.submitData = {}
            this.showPropertyManagementCoModel = true
        },
        submitPropertyManagementCo() {
            if (this.valid.all) {
                var that = this
                that.submitting = true
                datasource.submitPropertyManagementCo(that.submitData).then(function(result) {
                    that.submitting = false
                    that.$broadcast("refreshData")
                    that.showPropertyManagementCoModel = false
                    that.serverMsg = ""
                    that.submitData = {}
                }).catch(function(err) {
                    that.submitting = false
                    that.serverMsg = err
                })
            }
        },
        editPropertyManagementCo(row) {
            this.submitData.id = row.id
            this.submitData.code = row.code
            this.submitData.name = row.name
            this.submitData.name_en = row.name_en
            this.showPropertyManagementCoModel = true
        },
        deletePropertyManagementCo(row) {
            if (window.confirm("是否確認刪除：" + row.code + "?")) {
                var that = this
                datasource.deletePropertyManagementCo({
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
            this.editPropertyManagementCo(row)
        },
        "delete": function(row) {
            this.deletePropertyManagementCo(row)
        },
        "getData": function(pageNum, countPerPage, filterKey, append) {
            let that = this
            that.$broadcast('show::spinner')
            datasource.getPropertyManagementCos(pageNum, countPerPage, filterKey).then(function(result) {
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
        }
    },
    ready() {
        this.$broadcast("refreshData")
    }
}
</script>
