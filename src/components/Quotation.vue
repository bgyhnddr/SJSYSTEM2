<template>
<div>
	<div>
		<alert v-if="alertText" type="success">
			{{alertText}}
		</alert>
		<a target="_blank" :href="'/quotation/'+quotation.project.id" class="btn btn-default">下載(預覽)報價單</a>
		<div v-if="editable">
			<quotation-editor :quotation.sync="quotation"></quotation-editor>
		</div>
		<div v-if="!editable">
			<quotation-view :quotation.sync="quotation"></quotation-view>
		</div>
		<div>
			<p>BOSS審批條件</p>
			<p>毛利率低於：{{profitSetting.profitability}}%</p>
			<p>項目總價高於：{{profitSetting.totalprofit}}</p>
		</div>
		<div class="col-sm-12">
			<quotation-history :quotation.sync="quotation"></quotation-history>
		</div>
		<div class="col-sm-12">
			<div class="panel panel-default">
				<div class="panel-heading">補充信息</div>
				<div class="panel-body">
					<bs-input @input="commentsChanged=true" :value.sync="comments" type="textarea"></bs-input>
					<button v-if="commentsChanged" @click="saveQuotationComments" class="btn btn-default">保存補充信息</button>
				</div>
			</div>
		</div>
		<div class="col-sm-12">
			<div class="panel panel-default">
				<div class="panel-heading">PO</div>
				<div class="panel-body">
					<div class="col-sm-12">
						<div v-for="po in pos" class="panel panel-default">
							<div class="panel-heading">PO No：{{po.po.no}}</div>
							<div class="panel-body">
								<table class="table table-hover table-condensed">
									<thead>
										<tr>
											<th>序號</th>
											<th>收款人</th>
											<th>内容</th>
											<th>單價</th>
											<th>數量</th>
											<th>金額</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="d in po.po_quotation_details">
											<td>{{$index+1}}</td>
											<td>{{d.po_payee_name}}</td>
											<td>
												<pre class="no-border">{{d.content}}</pre>
											</td>
											<td>{{d.price}}</td>
											<td>{{d.count}}</td>
											<td>{{d.price*d.count}}</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div class="panel-footer">
								<span>總價：{{po.sum}}</span>
								<span>狀態：{{po.state}}</span>
							</div>
						</div>
					</div>
					<div class="col-sm-12">
						PO總價：{{sumDetail()}}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import checkPermission from '../extend/check-permission'
import QuotationEditor from './QuotationEditor'
import QuotationView from './QuotationView'
import QuotationHistory from './QuotationHistory'
import ViewQuotation from '../api/view_quotation'
import create_quotation from '../api/create_quotation'
import {
	input as bsInput,
	alert
} from 'vue-strap'

export default {
	props: {
		quotation_no: {
			type: String,
			default: ""
		}
	},
	components: {
		QuotationEditor,
		QuotationView,
		QuotationHistory,
		alert,
		bsInput
	},
	data() {
		return {
			quotation: {},
			alertText: "",
			profitSetting: {
				totalprofit: "0",
				profitability: "0"
			},
			commentsChanged: false,
			comments: "",
			pos: []
		}
	},
	computed: {
		editable() {
			if (this.quotation.project) {
				return this.quotation.project.project_state.state == "draft"
			}
		}
	},
	methods: {
		checkPermission,
		sumDetail() {
			return this.pos.reduce((sum, o) => {
				return sum + o.sum
			}, 0)
		},
		getQuotation(no) {
			var that = this
			return ViewQuotation.getQuotation({
				no: no
			}).then(function(result) {
				if (!result.quotation_date) {
					result.quotation_date = new Date().Format("yyyy-MM-dd")
				}
				that.comments = result.comments
				return result
			})
		},
		refresh() {
			var that = this
			if (that.quotation_no) {
				that.getQuotation(that.quotation_no).then((result) => {
					that.quotation = result
					that.alertText = ""
				}).catch((err) => {
					console.log(err)
					that.alertText = err
				})
			}

			ViewQuotation.getProfitSetting().then((result) => {
				that.profitSetting.totalprofit = result.totalprofit
				that.profitSetting.profitability = result.profitability
			}).catch((err) => {
				window.alert(err)
			})
			this.getPODetail(that.quotation_no)
		},
		saveQuotationComments() {
			var that = this
			create_quotation.saveQuotationComments({
				no: that.quotation.no,
				comments: that.comments
			}).then(() => {
				that.commentsChanged = false
			}).catch((err) => {
				window.alert(err)
			})
		},
		getPODetail(no) {
			var that = this
			ViewQuotation.getPODetail({
				quotation_no: no
			}).then((result) => {
				that.pos = result
			}).catch((err) => {
				window.alert(err)
			})
		}
	},
	watch: {
		"quotation_no": function(val, oldVal) {
			if (val) {
				var that = this
				that.getQuotation(val).then((result) => {
					that.quotation = result
					that.alertText = ""
				}).catch((err) => {
					console.log(err)
					that.alertText = err
				})

				this.getPODetail(val)
			}
		}
	},
	events: {
		'refreshQuotation': function() {
			this.refresh()
		}
	},
	ready() {
		this.refresh()
	}
}
</script>
