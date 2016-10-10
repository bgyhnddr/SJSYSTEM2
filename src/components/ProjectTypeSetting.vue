<template>
    <div v-if="checkPermission()">
        <ol class="breadcrumb">
            <li class="active">工程類別</li>
        </ol>
        <div>
            <button @click="addProjectType" class="btn btn-default">添加工程類別</button>
            <div style="position:relative">
                <spinner size="md" text="loading..."></spinner>
                <vue-strap-table :err-msg.sync="errMsg" :data.sync="data" :get-data-event="getData" :columns="columns"></vue-strap-table>
            </div>
            <modal :show.sync="showProjectTypeModel" effect="fade" width="400">
                <div slot="modal-header" class="modal-header">
                    <h4 class="modal-title">
                        工程類別
                    </h4>
                </div>
                <div slot="modal-body" class="modal-body">
                    <alert :type="alertType">
                        {{alertText}}
                    </alert>
                    <bs-input :value.sync="submitData.name" label="名稱"></bs-input>
                </div>
                <div slot="modal-footer" class="modal-footer">
                    <button type="button" class="btn btn-default" @click="showProjectTypeModel=false">关闭</button>
                    <button :disabled="submitting" type="button" class="btn btn-success" @click="submitProjectType">確認</button>
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
                    eventName: "editDetail",
                    tag: "button",
                    class: "btn-xs",
                    text: "编辑工程項目"
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
                    name: ""
                },
                showProjectTypeModel: false,
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
            addProjectType() {
                for (var i in this.submitData) {
                    this.submitData[i] = ""
                }
                this.showProjectTypeModel = true
            },
            submitProjectType() {
                if (this.valid()) {
                    var that = this
                    that.submitting = true
                    console.log(that.submitData.id)
                    datasource.submitProjectType(that.submitData).then(function(result) {
                        that.submitting = false
                        that.$broadcast("refreshData")
                        that.showProjectTypeModel = false
                        that.serverMsg = ""
                        that.submitData = {}
                    }).catch(function(err) {
                        that.submitting = false
                        that.serverMsg = err
                    })
                }
            },
            editProjectType(row) {
                for (var i in this.submitData) {
                    this.submitData[i] = row[i]
                }
                console.log(this.submitData.name)
                this.showProjectTypeModel = true
            },
            deleteProjectType(row) {
                if (window.confirm("是否確認刪除：" + row.name + "及其相關的工程項目與模板?")) {
                    var that = this
                    datasource.deleteProjectType({
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
                this.editProjectType(row)
            },
            "delete": function(row) {
                this.deleteProjectType(row)
            },
            "getData": function(pageNum, countPerPage, filterKey, append) {
                let that = this
                that.$broadcast('show::spinner')
                datasource.getProjectTypes(pageNum, countPerPage, filterKey).then(function(result) {
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
            "editDetail": function(row) {

            }
        },
        ready() {
            this.$broadcast("refreshData")
        }
    }
</script>