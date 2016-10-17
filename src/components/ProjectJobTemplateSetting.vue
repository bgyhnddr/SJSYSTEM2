<template>
    <div v-if="checkPermission()">
        <ol class="breadcrumb">
            <li><a v-link="{ path: '/index/DataManagement/ProjectType' }">工程類別</a></li>
            <li><a v-link="{ path: '/index/DataManagement/ProjectType/'+$route.params.type }">{{$route.params.type}}</a></li>
            <li class="active">{{$route.params.item}}:工作內容模板</li>
        </ol>
        <div>
            <button @click="addJobTemplate" class="btn btn-default">添加工作內容</button>
            <div style="position:relative">
                <spinner size="md" text="loading..."></spinner>
                <vue-strap-table :has-filter="hasFilter" :err-msg.sync="errMsg" :data.sync="data" :get-data-event="getData" :columns.sync="columns"></vue-strap-table>
            </div>
            <modal :show.sync="showJobTemplateModel" effect="fade" width="400">
                <div slot="modal-header" class="modal-header">
                    <h4 class="modal-title">
                        工作內容
                    </h4>
                </div>
                <div slot="modal-body" class="modal-body">
                    <alert :type="alertType">
                        {{alertText}}
                    </alert>
                    <bs-input :value.sync="submitData.content" label="內容"></bs-input>
                </div>
                <div slot="modal-footer" class="modal-footer">
                    <button type="button" class="btn btn-default" @click="showJobTemplateModel=false">关闭</button>
                    <button :disabled="submitting" type="button" class="btn btn-success" @click="submitJobTemplate">確認</button>
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
                "header": "序號",
                "type": "index"
            }, {
                "header": "名稱",
                "bind": "content"
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
                    content: ""
                },
                showJobTemplateModel: false,
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
            addJobTemplate() {
                for (var i in this.submitData) {
                    this.submitData[i] = ""
                }
                this.showJobTemplateModel = true
            },
            submitJobTemplate() {
                if (this.valid()) {
                    var that = this
                    that.submitting = true
                    datasource.submitJobTemplate({
                        id: that.submitData.id,
                        content: that.submitData.content,
                        project_item_name: that.$route.params.item
                    }).then(function(result) {
                        that.submitting = false
                        that.$broadcast("refreshData")
                        that.showJobTemplateModel = false
                        that.serverMsg = ""
                    }).catch(function(err) {
                        that.submitting = false
                        that.serverMsg = err
                    })
                }
            },
            editJobTemplate(row) {
                this.submitData.id = row.id
                this.submitData.content = row.content
                this.showJobTemplateModel = true
            },
            deleteJobTemplate(row) {
                if (window.confirm("是否確認刪除：" + row.content + "?")) {
                    var that = this
                    datasource.deleteJobTemplate({
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
                datasource.upJobTemplate({
                    id: row.id
                }).then(function(result) {
                    that.$broadcast("refreshData")
                }).catch(function(err) {
                    window.alert(err)
                })
            },
            down(row) {
                var that = this
                datasource.downJobTemplate({
                    id: row.id
                }).then(function(result) {
                    that.$broadcast("refreshData")
                }).catch(function(err) {
                    window.alert(err)
                })
            }
        },
        events: {
            "edit": function(row) {
                this.editJobTemplate(row)
            },
            "delete": function(row) {
                this.deleteJobTemplate(row)
            },
            "getData": function(pageNum, countPerPage, filterKey, append) {
                let that = this
                that.$broadcast('show::spinner')
                datasource.getJobTemplates(that.$route.params.item, filterKey).then(function(result) {
                    that.$broadcast('hide::spinner')
                    that.data = result
                }).catch(function(err) {
                    that.errMsg = err
                    that.$broadcast('hide::spinner')
                })
            },
            "up": function(row) {
                this.up(row)
            },
            "down": function(row) {
                this.down(row)
            }
        },
        ready() {
            this.$broadcast("refreshData")
        }
    }
</script>