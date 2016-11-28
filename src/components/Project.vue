<template>
<div class="container-fluid container-limited">
	<div>
		<alert v-if="alertText" type="success">
			{{alertText}}
		</alert>
		<div v-if="project.id">
			<h4>報價單：{{project.quotation_no}}</h4>
			<h4>工程名稱：{{project.quotation.project_name}}</h4>
			<div class="panel-group">
				<div v-if="showprojectInvoice" class="panel panel-default">
					<div @click="toggerShow" class="panel-heading">
						<h4 class="panel-title">
							<a v-link="{ path: '/index/ProjectManagement/Project/'+$route.params.id + '/invoice' }">發票</a>
						</h4>
					</div>
					<div class="panel-collapse collapse in">
						<div class="panel-body">
							<project-invoice :project.sync="project"></project-invoice>
						</div>
					</div>
				</div>
				<div v-if="showprojectAccounting" class="panel panel-default">
					<div @click="toggerShow" class="panel-heading">
						<h4 class="panel-title">
							<a v-link="{ path: '/index/ProjectManagement/Project/'+$route.params.id + '/accounting' }">賬務信息</a>
						</h4>
					</div>
					<div class="panel-collapse collapse in">
						<div class="panel-body">
							<project-accounting :project.sync="project"></project-accounting>
						</div>
					</div>
				</div>
				<div v-if="showProjectProgress" class="panel panel-default">
					<div @click="toggerShow" class="panel-heading">
						<h4 class="panel-title">
							<a v-link="{ path: '/index/ProjectManagement/Project/'+$route.params.id + '/progress' }">工程進度</a>
						</h4>
					</div>
					<div class="panel-collapse collapse in">
						<div class="panel-body">
							<project-progress :project.sync="project"></project-progress>
						</div>
					</div>
				</div>
				<div class="panel panel-default">
					<div @click="toggerShow" class="panel-heading">
						<h4 class="panel-title">
							<a v-link="{ path: '/index/ProjectManagement/Project/'+$route.params.id + '/quotation' }">报价单</a>
						</h4>
					</div>
					<div class="panel-collapse collapse in">
						<div class="panel-body">
							<project-contract v-if="project.project_state.state!='draft'" :project.sync="project" :project-info="projectInfo"></project-contract>
							<quotation-confirm v-if="showQuotationConfirm" :project.sync="project" :project-info="projectInfo"></quotation-confirm>
							<quotation :quotation_no.sync="project.quotation_no"></quotation>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</template>
<script>
import checkPermission from '../extend/check-permission'
import Quotation from './Quotation'
import QuotationConfirm from './QuotationConfirm'
import view_quotation from '../api/view_quotation'
import ProjectContract from './ProjectContract'
import ProjectProgress from './ProjectProgress'
import ProjectAccounting from './ProjectAccounting'
import ProjectInvoice from './ProjectInvoice'
import {
	alert
} from 'vue-strap'
export default {
	data() {
		return {
			alertText: "",
			project: {},
			projectInfo: {},
			state: window.state
		}
	},
	computed: {
		showQuotationConfirm() {
			var state = this.project.project_state ? this.project.project_state.state : ""
			return ['quotation_save'].some(o => o == state)
		},
		showProjectProgress() {
			var state = this.project.project_state ? this.project.project_state.state : ""
			return !['quotation_save', 'draft'].some(o => o == state)
		},
		showprojectAccounting() {
			var state = this.project.project_state ? this.project.project_state.state : ""
			return !['quotation_save', 'draft'].some(o => o == state)
		},
		showprojectInvoice() {
			var state = this.project.project_state ? this.project.project_state.state : ""
			return !['quotation_save', 'draft', 'quotation_contract', 'working', 'counting'].some(o => o == state) &&
				this.checkPermission(['boss', 'invoice'])
		}
	},
	components: {
		Quotation,
		QuotationConfirm,
		ProjectContract,
		ProjectProgress,
		ProjectAccounting,
		ProjectInvoice,
		alert
	},
	methods: {
		checkPermission,
		getProject(id) {
			var that = this
			return view_quotation.getProject({
				id: id
			}).then((result) => {
				that.project = result
				that.alertText = ""
			}).catch((err) => {
				that.alertText = err
			})
		},
		getProjectConfirmInfo(id) {
			var that = this
			return view_quotation.getProjectConfirmInfo(id).then(function(result) {
				that.projectInfo = result
			})
		},
		toggerShow(e) {
			var node = e.currentTarget.parentNode.getElementsByClassName("panel-collapse collapse")[0]
			console.log(node.className)
			if (node.className.indexOf("in") >= 0) {
				node.className = "panel-collapse collapse"
			} else {
				node.className = "panel-collapse collapse in"
			}
		}
	},
	ready() {
		var that = this
		that.getProject(that.$route.params.id)
		that.getProjectConfirmInfo(that.$route.params.id)
		window.document.getElementsByClassName("v-link-active")[1].className = ""
	},
	events: {
		'refreshProject': function() {
			this.getProject(this.$route.params.id)
			this.getProjectConfirmInfo(this.$route.params.id)
		}
	},
	route: {
		deactivate(transition) {
			if (transition.from.path.indexOf("/index/ProjectManagement/Project/") >= 0) {
				if (this.state.quotation_change) {
					if (window.confirm("存在未保存内容，是否離開頁面？")) {
						this.state.quotation_change = false
					} else {
						transition.abort()
					}
				}
			}
			transition.next()
		}
	}
}
</script>
