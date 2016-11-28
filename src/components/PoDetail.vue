<template>
<div>
	<div class="panel panel-default">
		<div class="panel-heading">PO明細</div>
		<div class="panel-body">
			<typeahead v-if="po.state=='draft'" class="col-sm-2" :value.sync="submitQuotationNo" :data="quotations" placeholder="請輸入">
			</typeahead>
			<button v-if="po.state=='draft'" @click="addQuotation" v-if="submitQuotationNo" class="btn btn-default">添加報價單</button>
			<div class="col-sm-12">
				<div v-for="item in detail" class="panel panel-default">
					<div class="panel-heading">報價單：{{item.quotation.no}}</div>
					<div class="panel-body">
						<button v-if="po.state=='draft'" @click="addDetail(item)" class="btn btn-default">加入記錄</button>
						<table class="table table-hover table-condensed">
							<thead>
								<tr>
									<th>序號</th>
									<th>收款人</th>
									<th>内容</th>
									<th>單價</th>
									<th>數量</th>
									<th>金額</th>
									<th>單據上傳</th>
									<th>支票號碼</th>
									<th>支票</th>
									<th v-if="po.state=='draft'">操作</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="d in item.po_quotation_details">
									<td>{{$index+1}}</td>
									<td>{{d.po_payee_name}}</td>
									<td>
										<pre class="no-border">{{d.content}}</pre>
									</td>
									<td>{{d.price}}</td>
									<td>{{d.count}}</td>
									<td>{{d.price*d.count}}</td>
									<td>
										<div v-for="f in d.po_quotation_detail_attachments">
											<vue-strap-upload :readonly="po.state!='draft'" style="display:inline" :readonly="true" :file-id.sync="f.attachment_id"></vue-strap-upload>
											<button v-if="po.state=='draft'" @click="deleteAttachment(f,d.po_quotation_detail_attachments)" class="btn btn-default btn-xs">刪除</button>
										</div>
										<vue-strap-upload v-if="po.state=='draft'" @uploaded="uploadAttachment(d)" :file-id.sync="d.temp_attachment_id"></vue-strap-upload>
									</td>
									<td v-if="showCheck(item)">
										<bs-input style="display: inline-block;" @change="checkNoChange($index,item.po_quotation_details)" :value.sync="d.check_no" label=""></bs-input>
									</td>
									<td v-else>{{d.check_no}}</td>
									<td v-if="showCheck(item)">
										<vue-strap-upload @uploaded="uploadCheck(d)" :file-id.sync="d.attachment_id"></vue-strap-upload>
									</td>
									<td v-else>
										<vue-strap-upload :file-id.sync="d.attachment_id" :readonly="true"></vue-strap-upload>
									</td>
									<td v-if="po.state=='draft'">
										<button @click="editDetail(d)" class="btn btn-default btn-xs">修改記錄</button>
										<button @click="deleteDetail(d.id)" class="btn btn-default btn-xs">刪除記錄</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="panel-footer">
						<span>剩餘預算：{{item.left}}</span>
						<span>核准后剩餘預算：{{item.left_all}}</span>
						<span>工程負責人：{{item.quotation.manager}}</span>
						<button v-if="showManagerConfirm(item)" @click="managerConfirm(item)" class="btn btn-default">確認</button>
						<button v-if="showBossConfirm(item)" @click="bossConfirm(item)" class="btn btn-default">BOSS確認</button>
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
import confirm_po from '../api/confirm_po'
import boss from '../api/boss'
import check from '../api/check'
import VueStrapUpload from './extend/vue-strap-upload'
import checkPermission from '../extend/check-permission'

export default {
	components: {
		bsInput,
		typeahead,
		modal,
		VueStrapUpload
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
			state: window.state,
			quotations: [],
			payees: [],
			submitQuotationNo: "",
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
		checkPermission,
		poApprove(row) {
			var approve = false
			var approveObj = row.po_quotation_approve ? row.po_quotation_approve : {
				manager_approve: false
			}
			return approveObj.manager_approve
		},
		showManagerConfirm(row) {
			return !this.poApprove(row) && row.left >= 0 && row.quotation.manager == this.state.userInfo.name && this.po.state == "done"
		},
		showBossConfirm(row) {
			return !this.poApprove(row) && this.checkPermission(['boss']) && this.po.state == "done"
		},
		showCheck(row) {
			return this.po.state == "done" && this.poApprove(row) && this.checkPermission(['boss', 'check'])
		},
		vaildDetail() {
			return this.submitData.po_quotation_id &&
				this.submitData.po_payee_name &&
				this.submitData.content &&
				this.submitData.price &&
				this.submitData.count
		},
		addQuotation() {
			var that = this
			create_po.addQuotation({
				po_id: that.po.id,
				quotation_no: that.submitQuotationNo
			}).then(() => {
				that.submitQuotationNo = ""
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
				that.detail = result
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
		},
		editDetail(row) {
			this.submitData = {
				id: row.id,
				po_quotation_id: row.po_quotation_id,
				po_payee_name: row.po_payee_name,
				content: row.content,
				price: row.price,
				count: row.count
			}
			this.showDetail = true
		},
		uploadAttachment(row) {
			create_po.uploadPODetailAttachment({
				po_quotation_detail_id: row.id,
				attachment_id: row.temp_attachment_id
			}).then((result) => {
				row.temp_attachment_id = 0
				row.po_quotation_detail_attachments.push(result)
			}).catch((err) => {
				window.alert(err)
			})
		},
		deleteAttachment(f, row) {
			if (confirm("是否刪除附件?")) {
				create_po.deletePODetailAttachment({
					id: f.id
				}).then((result) => {
					row.$remove(f)
				}).catch((err) => {
					window.alert(err)
				})
			}
		},
		uploadCheck(row) {
			check.savePODetailCheck({
				id: row.id,
				attachment_id: row.attachment_id
			}).then((result) => {
				window.alert("支票已保存")
			}).catch((err) => {
				window.alert(err)
				that.getPODetail(that.po.id)
			})
		},
		showCheckNoSave(d) {
			return d.changed
		},
		checkNoChange(index, row) {
			var that = this
			var obj = {}
			for (var i in row[index]) {
				obj[i] = row[index][i]
				obj.changed = true
			}
			console.log(obj.check_no)
			check.savePODetailCheckNo({
				id: obj.id,
				check_no: obj.check_no
			}).then((result) => {
				row.$set(index, obj)
				window.alert("支票號已保存")
			}).catch((err) => {
				window.alert(err)
				that.getPODetail(that.po.id)
			})
		},
		bossConfirm(item) {
			var that = this
			boss.approvePODetail({
				po_quotation_id: item.id
			}).then(() => {
				that.getPODetail(that.po.id)
			}).catch((err) => {
				window.alert(err)
			})
		},
		managerConfirm(item) {
			var that = this
			confirm_po.approvePODetail({
				po_quotation_id: item.id
			}).then(() => {
				that.getPODetail(that.po.id)
			}).catch((err) => {
				window.alert(err)
			})
		}
	},
	computed: {},
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
<style>
pre.no-border {
	box-shadow: none;
	border: none;
	background: transparent !important;
	padding: 0;
}
</style>
