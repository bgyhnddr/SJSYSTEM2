<template>
<div>
	<div>
		<div class="panel panel-default">
			<div class="panel-heading">報價單確認</div>
			<div class="panel-body">
				<button :disabled="editing" v-if="allowDraft" @click="draftQuotation" class="btn btn-default">{{editing?'loading':'修改報價'}}</button>
				<button v-if="showConfirm" @click="confirmQuotation" class="btn btn-default">確認報價</button>
				<button :disabled="editing" v-if="allowEdit" @click="editQuotation" class="btn btn-default">{{editing?'loading':'批准修改'}}</button>
				<p>報價單確認狀態：{{confirmText}}</p>
				<p v-if="projectInfo.belowprofitability">利潤率不達標</p>
				<p v-if="projectInfo.overtotalprofit">工程總額過高</p>
			</div>
		</div>
	</div>
</div>
</template>
<script>
import checkPermission from '../extend/check-permission'
import view_quotation from '../api/view_quotation'
import create_quotation from '../api/create_quotation'
import edit_quotation from '../api/edit_quotation'
import confirm_quotation from '../api/confirm_quotation'
import boss from '../api/boss'

export default {
	components: {},
	props: {
		project: {
			type: Object
		},
		projectInfo: {
			type: Object
		}
	},
	data() {
		return {
			state: window.state,
			editing: false
		}
	},
	computed: {
		allowEdit() {
			if (this.project.project_state) {
				if (this.project.project_state.state == "quotation_save") {
					return this.checkPermission(["boss"]) || (this.state.userInfo.name == this.projectInfo.manager)
				}
			}
			return false
		},
		allowDraft() {
			return this.checkPermission(["create_quotation"]) && this.project.project_state.state == "quotation_save" && !this.project.project_state.manager_approve
		},
		confirmText() {
			if (this.project.project_state) {
				switch (this.project.project_state.state) {
					case "quotation_save":
						if (this.project.project_state.boss_approve) {
							return "BOSS已確認"
						} else if (this.project.project_state.manager_approve) {
							if (this.projectInfo.belowprofitability || this.projectInfo.overtotalprofit) {
								return "等待BOSS確認"
							} else {
								return "PIC已確認"
							}
						} else {
							if (this.projectInfo.belowprofitability || this.projectInfo.overtotalprofit) {
								return "等待BOSS確認"
							} else {
								return "等待PIC或BOSS確認"
							}
						}
					default:
						return ""
				}
			}
			return ""
		},
		showConfirm() {
			if (this.project.project_state) {
				if (this.project.project_state.state == "quotation_save") {
					if (this.checkPermission(["boss"])) {
						return !this.project.project_state.boss_approve
					} else {
						if (!this.projectInfo.belowprofitability && !this.projectInfo.overtotalprofit) {
							return this.projectInfo.manager == this.state.userInfo.name && !this.project.project_state.manager_approve
						}
					}
				}
			}
			return false
		}
	},
	methods: {
		checkPermission,
		editQuotation() {
			var that = this
			that.editing = true
			edit_quotation.editQuotation({
				no: that.projectInfo.quotation_no
			}).then(function() {
				that.$dispatch("refreshProject")
				that.editing = false
			}).catch((err) => {
				window.alert(err)
				that.editing = false
			})
		},
		draftQuotation() {
			var that = this
			that.editing = true
			create_quotation.editQuotation({
				no: that.projectInfo.quotation_no
			}).then(function() {
				that.editing = false
				window.location.reload()
			}).catch((err) => {
				window.alert(err)
				that.editing = false
			})
		},
		confirmQuotation() {
			var that = this
			that.reqConfirm().then((result) => {
				that.$dispatch("refreshProject")
			}).catch((err) => {
				window.alert(err)
			})
		},
		reqConfirm() {
			var that = this
			if (that.checkPermission(["boss"])) {
				return boss.confirmQuotation({
					id: that.project.id
				})
			} else {
				return confirm_quotation.confirmQuotation({
					id: that.project.id
				})
			}
		}
	},
	watch: {},
	events: {},
	ready() {}
}
</script>
