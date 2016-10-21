<template>
	<div v-if="checkPermission()">
		<vue-strap-table :has-filter="false" :err-msg.sync="errMsg" :data.sync="data" :get-data-event="getData" :columns.sync="columns"></vue-strap-table>
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
    import checkPermission from '../extend/check-permission'
    import view_quotation from '../api/view_quotation'
    import create_quotation from '../api/create_quotation'
    import QuotationView from './QuotationView'

    export default {
        components: {
            QuotationView
        },
        props: {
            quotation: {
                type: Object,
                default: {}
            }
        },
        data() {
            var that = this
            let columns = [{
                "header": "報價單編號",
                "type": "no"
            }, {
                "header": "報價日期",
                "bind": "quoation_date"
            }, {
                "header": "操作",
                "type": "action",
                "items": [{
                    eventName: "change",
                    tag: "button",
                    class: "btn-xs",
                    text: "更換報價",
                    filter(row) {
                        return that.allowEdit && row.no != this.quotaton.no
                    }
                }, {
                    eventName: "view",
                    tag: "button",
                    class: "btn-xs",
                    text: "查看"
                }]
            }]
            return {
                submitting: false,
                getData: "getData",
                data: {},
                columns: columns,
            }
        },
        computed: {
            allowEdit() {
                if (this.quotaton.project) {
                    if (this.quotaton.project.project_state.state == "quotation_save") {
                        if (!this.quotaton.project.project_state.manager_approve && !this.quotaton.project.project_state.boss_approve) {
                            return this.checkPermission(["create_quotation"])
                        } else {
                            return this.checkPermission(["edit_quotation"])
                        }
                    }
                }
                return false
            }
        },
        methods: {
            checkPermission,
            getQuotationHistory(id) {
                view_quotation.getQuotationHistory({
                    id: id
                }).then((result) {
                    return {
                        end: true,
                        list: result
                    }
                }).catch((err) {
                    window.alert(err)
                })
            }
        },
        watch: {
            'quotaton': function(val) {
                if (this.quotaton.project) {
                    this.getQuotationHistory(this.quotaton.project.id)
                }
            }
        },
        events: {
            'change': function(row) {
                var that = this
                if (!that.quotaton.project.project_state.manager_approve && !that.quotaton.project.project_state.boss_approve) {
                    create_quotation.editQuotation({
                        id: that.projectId
                    }).then(function() {
                        that.$dispatch("refreshProject")
                        that.editing = false
                    }).catch((err) => {
                        that.editing = false
                    })
                } else {
                    edit_quotation.editQuotation({
                        id: that.projectId
                    }).then(function() {
                        that.$dispatch("refreshProject")
                        that.editing = false
                    }).catch((err) => {
                        that.editing = false
                    })
                }
            }
        },
        ready() {
            if (this.quotaton.project) {
                this.getQuotationHistory(this.quotaton.project.id)
            }
        }
    }
</script>