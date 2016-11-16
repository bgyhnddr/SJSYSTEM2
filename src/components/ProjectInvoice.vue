<template>
<div>
	<button @click="addInvoice" class="btn btn-default">開具發票</button>
	<table class="table table-hover table-condensed">
		<thead>
			<tr>
				<th>
					賬單號
				</th>
				<th>
					建單日期
				</th>
				<th>
					賬單金額
				</th>
				<th>
					支票
				</th>
				<th>
					支票金額
				</th>
				<th>
					支票號碼
				</th>
				<th>
					上傳支票日期
				</th>
				<th>
					操作
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="row of invoices">
				<td>{{row.no}}</td>
				<td>{{row.create_date}}</td>
				<td>{{row.invoice_money}}</td>
				<td>
					<a target="_blank" href="{{'/service/private/view_quotation/getAttachment?id='+row.attachment_id}}">{{row.attachment?row.attachment.name:""}}</a>
				</td>
				<td>{{row.check_money}}</td>
				<td>{{row.check_no}}</td>
				<td>{{row.check_date}}</td>
				<td>
					<a target="_blank" :href="'/invoice/'+row.id" class="btn btn-default btn-xs">下載（預覽）發票</a>
					<button v-if="allowUploadCheck" @click="uploadCheck(row)" class="btn btn-default btn-xs">上傳支票</button>
				</td>
			</tr>
		</tbody>
	</table>
	<modal :show.sync="showCreateInvoice" effect="fade">
		<div slot="modal-header" class="modal-header">
			<h4 class="modal-title">
				發票
			</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<table class="table table-hover table-condensed">
				<thead>
					<tr>
						<th>
							選擇
						</th>
						<th>
							序號
						</th>
						<th>
							工作内容
						</th>
						<th>
							單價
						</th>
						<th>
							數量
						</th>
						<th>
							總價
						</th>
					</tr>
				</thead>
				<tbody>
					<tr @click="rowClick($index)" v-for="row of jobs">
						<td>
							<input type="checkbox" v-model="row.checked" />
						</td>
						<td>{{row.index}}</td>
						<td>{{row.content}}</td>
						<td>{{row.retail?row.retail:""}}</td>
						<td>{{row.count?row.count:""}}</td>
						<td>{{row.count?row.retail*row.count:""}}</td>
					</tr>
				</tbody>
			</table>
			<div>總價：{{jobCount}}</div>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button @click="showCreateInvoice=false" class="btn btn-default">關閉</button>
			<button v-if="jobCount>0" @click="createInvoice" class="btn btn-default">生成發票</button>
		</div>
	</modal>
	<modal :show.sync="showUploadCheck" effect="fade">
		<div slot="modal-header" class="modal-header">
			<h4 class="modal-title">
				支票
			</h4>
		</div>
		<div slot="modal-body" class="modal-body">
			<bs-input type="number" :value.sync="submitData.check_money" label="支票金額"></bs-input>
			<bs-input type="number" :value.sync="submitData.check_no" label="支票號碼"></bs-input>
			<div>支票</div>
			<vue-strap-upload :file-id.sync="submitData.attachment_id"></vue-strap-upload>
		</div>
		<div slot="modal-footer" class="modal-footer">
			<button @click="showUploadCheck=false" class="btn btn-default">關閉</button>
			<button v-if="allowConfirmCheck" @click="submitCheck" class="btn btn-default">確認</button>
		</div>
	</modal>
</div>
</template>
<script>
import checkPermission from '../extend/check-permission'
import view_quotation from '../api/view_quotation'
import VueStrapUpload from './extend/vue-strap-upload'
import invoice from '../api/invoice'
import check from '../api/check'
import {
	modal,
	input as bsInput
} from 'vue-strap'

export default {
	components: {
		modal,
		bsInput,
		VueStrapUpload
	},
	props: {
		project: {
			type: Object
		}
	},
	data() {
		return {
			submitData: {
				id: "",
				check_no: "",
				check_money: "",
				attachment_id: 0,
				attachment_name: "",
				project_id: ""
			},
			showCreateInvoice: false,
			invoices: [],
			jobs: [],
			jobCount: 0,
			showUploadCheck: false
		}
	},
	methods: {
		checkPermission,
		getProjectInvoices(id) {
			var that = this
			view_quotation.getProjectInvoices({
				id: id
			}).then((result) => {
				that.invoices = result
			}).catch((err) => {
				window.alert(err)
			})
		},
		addInvoice() {
			var that = this
			that.getJobs(that.project.quotation_no)
			that.showCreateInvoice = true
		},
		createInvoice() {
			var that = this
			invoice.createInvoice({
				project_id: that.project.id,
				project_invoce_details: that.jobs.filter(o => o.checked).map((o) => {
					return {
						quotation_job_id: o.id
					}
				})
			}).then((result) => {
				that.getProjectInvoices(that.project.id)
				that.showCreateInvoice = false
			}).catch((err) => {
				window.alert(err)
			})
		},
		getJobs(qno) {
			var that = this
			view_quotation.getQuotationJobs({
				quotationNo: qno
			}).then((result) => {
				that.jobs = result.list
			}).catch((err) => {
				window.alert(err)
			})
		},
		rowClick(index) {
			var row = this.jobs[index]
			row.checked = !row.checked
			this.jobs.$set(index, {
				id: row.id,
				retail: row.retail,
				content: row.content,
				count: row.count,
				index: row.index,
				checked: row.checked
			})

			this.jobCount = this.jobs.reduce((sum, o) => {
				return sum + (o.checked ? (o.count ? o.retail * o.count : 0) : 0)
			}, 0)
		},
		uploadCheck(row) {
			this.submitData = {
				id: row.id,
				check_no: row.check_no,
				check_money: row.check_money,
				attachment_id: row.attachment_id,
				attachment_name: row.attachment ? row.attachment.name : "",
				project_id: this.project.id
			}
			this.showUploadCheck = true
		},
		submitCheck() {
			var that = this
			check.submitCheck(that.submitData).then(() => {
				that.getProjectInvoices(that.project.id)
				that.showUploadCheck = false
			}).catch((err) => {
				window.alert(err)
			})
		}
	},
	computed: {
		allowUploadCheck() {
			return this.checkPermission(['check'])
		}
	},
	watch: {
		'project': function() {
			this.getProjectInvoices(this.project.id)
		}
	},
	ready() {
		if (this.project) {
			this.getProjectInvoices(this.project.id)
		}
	}
}
</script>
