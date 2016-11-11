<template>
	<div class="container-fluid">
		<div class="col-sm-12">
			<button v-if="changed||!po.id" @click="submitPO" class="btn btn-primary">保存</button>
			<button v-if="showFinish" @click="finishPO" class="btn btn-primary">提交</button>
		</div>
		<div v-if="po.id" class="col-sm-12">
			<h3>PO No: {{po.no}}</h3>
			<h3>Prepared By: {{po.prepared_by}}</h3>
		</div>
		<div class="col-sm-2">
			<bs-input :readonly="po.state != 'draft'" :value.sync="po.date" label="日期" type="date"></bs-input>
		</div>
		<div class="col-sm-12">
			<po-detail :po.sync="po" :detail.sync="detail" v-if="po.id"></po-detail>
			<h4 v-else>*需要保存草稿后才能添加明細*</h4>
		</div>
		<div class="col-sm-12">
			<bs-input :readonly="po.state != 'draft'" :value.sync="po.comments" label="備注" type="textarea"></bs-input>
		</div>
	</div>
</template>
<script>
    import {
        input as bsInput
    } from 'vue-strap'
    import PoDetail from './PoDetail'
    import view_po from '../api/view_po'
    import create_po from '../api/create_po'

    export default {
        components: {
            bsInput,
            PoDetail
        },
        data() {
            return {
                state: window.state,
                po: {
                    id: "",
                    no: "",
                    date: undefined,
                    prepared_by: undefined,
                    comments: undefined,
                    state: ""
                },
                detail: [],
                changed: false
            }
        },
        watch: {
            'po.date': function(val, valold) {
                if (valold != undefined) {
                    this.changed = true
                }
            },
            'po.prepared_by': function(val, valold) {
                if (valold != undefined) {
                    this.changed = true
                }
            },
            'po.comments': function(val, valold) {
                if (valold != undefined) {
                    this.changed = true
                }
            }
        },
        computed: {
            showFinish() {
                return this.po.state == 'draft' && this.detail.some((d) => {
                    return d.po_quotation_details.length > 0
                })
            }
        },
        methods: {
            submitPO() {
                var that = this
                create_po.submitPO({
                    id: that.po.id,
                    no: that.po.no,
                    date: that.po.date,
                    prepared_by: that.po.prepared_by,
                    comments: that.po.comments
                }).then((result) => {
                    that.po.id = result.id
                    that.po.no = result.no
                    that.changed = false
                    that.$router.go("/index/POManagement/PO/" + result.id)
                }).catch((err) => {
                    window.alert(err)
                })
            },
            getPO(id) {
                var that = this
                view_po.getPO({
                    id: id
                }).then((result) => {
                    that.po = result
                }).catch((err) => {
                    window.alert(err)
                })
            },
            finishPO() {
                var that = this
                if (confirm("是否提交完成PO？")) {
                    create_po.finishPO({
                        id: that.po.id
                    }).then(() => {
                        that.getPO(that.po.id)
                    })
                }
            }
        },
        route: {
            data() {
                if (this.$route.params.id) {
                    this.getPO(this.$route.params.id)
                } else {
                    this.po = {
                        id: "",
                        no: "",
                        date: new Date().Format("yyyy-MM-dd"),
                        prepared_by: this.state.userInfo.name,
                        comments: "",
                        state: ""
                    }
                }
            }
        },
        ready() {
            if (!this.$route.params.id) {
                if (!this.po.prepared_by) {
                    this.po.prepared_by = this.state.userInfo.name
                }
                if (!this.po.date) {
                    this.po.date = new Date().Format("yyyy-MM-dd")
                }
            }
        }
    }
</script>