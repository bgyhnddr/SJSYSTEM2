<template>
	<div v-if="checkPermission()">
		<div class="panel panel-default">
			<div class="panel-heading">報價方案</div>
			<div class="panel-body">
				<vue-strap-table :has-filter="false" :err-msg.sync="errMsg" :data.sync="data" :get-data-event="getData" :columns.sync="columns"></vue-strap-table>
			</div>
		</div>
		<modal :show.sync="showViewModel" effect="fade" width="400">
			<div slot="modal-header" class="modal-header">
				<h4 class="modal-title">
					報價單
				</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<quotation-view :quotation.sync="viewQuotation"></quotation-view>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button type="button" class="btn btn-default" @click="showViewModel=false">关闭</button>
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
    import checkPermission from '../extend/check-permission'
    import view_quotation from '../api/view_quotation'
    import create_quotation from '../api/create_quotation'
    import QuotationView from './QuotationView'

    export default {
        components: {
            QuotationView,
            VueStrapTable,
            modal
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
                "bind": "no"
            }, {
                "header": "報價日期",
                "bind": "quotation_date"
            }, {
                "header": "操作",
                "type": "action",
                "items": [{
                    eventName: "change",
                    tag: "button",
                    class: "btn-xs",
                    text: "更換報價",
                    filter(row) {
                        return that.allowEdit && row.no != that.quotation.no
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
                viewQuotation: {},
                showViewModel: false
            }
        },
        computed: {
            allowEdit() {
                if (this.quotation.project) {
                    if (this.quotation.project.project_state.state == "quotation_save") {
                        if (!this.quotation.project.project_state.manager_approve && !this.quotation.project.project_state.boss_approve) {
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
                var that = this
                view_quotation.getQuotationHistory({
                    id: id
                }).then((result) => {
                    that.data = {
                        end: true,
                        list: result
                    }
                }).catch((err) => {
                    window.alert(err)
                })
            }
        },
        watch: {
            'quotation': function(val) {
                if (this.quotation.project) {
                    this.getQuotationHistory(this.quotation.project.id)
                }
            }
        },
        events: {
            'change': function(row) {
                var that = this
                if (!that.quotation.project.project_state.manager_approve && !that.quotation.project.project_state.boss_approve) {
                    create_quotation.editQuotation({
                        no: row.no
                    }).then(function() {
                        that.$dispatch("refreshProject")
                        that.editing = false
                    }).catch((err) => {
                        that.editing = false
                    })
                } else {
                    edit_quotation.editQuotation({
                        no: row.no
                    }).then(function() {
                        that.$dispatch("refreshProject")
                        that.editing = false
                    }).catch((err) => {
                        that.editing = false
                    })
                }
            },
            'view': function(row) {
                var that = this
                view_quotation.getQuotation({
                    no: row.no
                }).then((result) => {
                    that.viewQuotation = result
                    that.showViewModel = true
                })
            }
        },
        ready() {
            if (this.quotation.project) {
                this.getQuotationHistory(this.quotation.project.id)
            }
        }
    }
</script>