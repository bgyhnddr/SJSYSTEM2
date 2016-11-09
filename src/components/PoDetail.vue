<template>
	<div>
		<div class="panel panel-default">
			<div class="panel-heading">PO明細</div>
			<div class="panel-body">
				<div class="col-sm-12">
					報價單號碼
				</div>
				<typeahead class="col-sm-2" :value.sync="submitQuotationNo" :data="quotations" placeholder="請輸入">
				</typeahead>
				<button @click="addQuotation" v-if="submitQuotationNo" class="btn btn-default">添加報價單</button>
				<div class="col-sm-12">
					<div v-for="item in PODetail" class="panel panel-default">
						<div class="panel-heading">報價單：{{item.quotation.no}}</div>
						<div class="panel-body">
							<button @click="addDetail(item)" class="btn btn-default">加入記錄</button>
							<div v-for="d in item.po_quotation_details">
								{{d.content}}<button @click="deleteDetail(d.id)" class="btn btn-default">刪除記錄</button>
							</div>
						</div>
						<div class="panel-footer">
							<span>剩餘預算：{{item.left}}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<modal :show.sync="showDetail" effect="fade">
			<div slot="modal-header" class="modal-header">
				<h4 class="modal-title">
					PO記錄
				</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<div class="form-group">
					<label class="control-label">收款人</label>
					<typeahead :value.sync="submitData.po_payee_name" :data="payees" placeholder="輸入關鍵字">
					</typeahead>
				</div>
				<bs-input :value.sync="submitData.content" label="内容" type="textarea"></bs-input>
				<bs-input :value.sync="submitData.price" label="單價" type="number"></bs-input>
				<bs-input :value.sync="submitData.count" label="數量" type="number"></bs-input>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<span class="pull-left">總價：{{submitData.price*submitData.count}}</span>
				<button type="button" class="btn btn-default" @click="showDetail=false">關閉</button>
				<button v-if="vaildDetail()" type="button" class="btn btn-success" @click="submitDetail">確認</button>
			</div>
		</modal>
	</div>
</template>
<script>
    import {
        modal,
        input as bsInput,
        typeahead
    } from 'vue-strap'
    import view_po from '../api/view_po'
    import create_po from '../api/create_po'
    export default {
        components: {
            bsInput,
            typeahead,
            modal
        },
        props: {
            detail: {
                type: Array
            },
            po: {
                type: Object,
                default: {
                    id: "",
                    no: "",
                    date: undefined,
                    prepared_by: undefined,
                    comments: undefined,
                    state: ""
                }
            }
        },
        data() {
            return {
                quotations: [],
                payees: [],
                submitQuotationNo: "",
                PODetail: [],
                submitData: {
                    id: "",
                    po_quotation_id: "",
                    po_payee_name: "",
                    content: "",
                    price: 0,
                    count: 0
                },
                showDetail: false
            }
        },
        methods: {
            vaildDetail() {
                return this.submitData.po_quotation_id &&
                    this.submitData.po_payee_name &&
                    this.submitData.content &&
                    this.submitData.price &&
                    this.submitData.count
            },
            addQuotation() {
                var that = this
                window.alert("add")
                create_po.addQuotation({
                    po_id: that.po.id,
                    quotation_no: that.submitQuotationNo
                }).then(() => {
                    that.getPODetail(that.po.id)
                }).catch((err) => {
                    window.alert(err)
                })
            },
            getQuotations() {
                var that = this
                view_po.getQuotations().then((result) => {
                    that.quotations = result
                }).catch((err) => {
                    window.alert(err)
                })
            },
            getPayees() {
                var that = this
                view_po.getPayees().then((result) => {
                    that.payees = result
                }).catch((err) => {
                    window.alert(err)
                })
            },
            getPODetail(id) {
                var that = this
                view_po.getPODetail({
                    po_id: id
                }).then((result) => {
                    console.log(result)
                    that.PODetail = result
                }).catch((err) => {
                    window.alert(err)
                })
            },
            addDetail(row) {
                this.submitData = {
                    id: "",
                    po_quotation_id: row.id,
                    po_payee_name: "",
                    content: "",
                    price: 0,
                    count: 0
                }
                this.showDetail = true
            },
            submitDetail() {
                var that = this
                create_po.submitPODetail({
                    id: that.submitData.id,
                    po_quotation_id: that.submitData.po_quotation_id,
                    po_payee_name: that.submitData.po_payee_name,
                    content: that.submitData.content,
                    price: that.submitData.price,
                    count: that.submitData.count
                }).then((result) => {
                    that.getPODetail(that.po.id)
                    that.getPayees()
                    that.showDetail = false
                }).catch((err) => {
                    window.alert(err)
                })
            },
            deleteDetail(id) {
                if (confirm("是否確定刪除記錄？")) {
                    var that = this
                    create_po.deletePODetail({
                        id: id
                    }).then((result) => {
                        that.getPODetail(that.po.id)
                        that.getPayees()
                    }).catch((err) => {
                        window.alert(err)
                    })
                }
            }
        },
        watch: {
            'po': function(val) {
                if (val.id) {
                    this.getPODetail(val.id)
                }
            }
        },
        ready() {
            this.getQuotations()
            this.getPayees()

            if (this.po.id) {
                this.getPODetail(this.po.id)
            }
        }
    }
</script>