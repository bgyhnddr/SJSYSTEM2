<template>
<div>
	<div v-if="isEdit">
		<button @click="saveChange" v-if="changed" class="btn btn-default">保存修改</button>
		<button @click="confirmInfo" v-if="allowConfirm" class="btn btn-default">確認信息</button>
		<bs-input type="number" :value.sync="submitData.ecost" label="工程預計成本"></bs-input>
		<bs-input type="number" :value.sync="submitData.acost" label="工程實際成本"></bs-input>
		<bs-input type="number" :value.sync="submitData.income" label="工程實際收入"></bs-input>
		工程實際利潤：：{{profit}}
	</div>
	<div v-else>
		<p>工程預計成本：{{submitData.ecost}}</p>
		<p>工程實際成本：{{submitData.acost}}</p>
		<p>工程實際收入：{{submitData.income}}</p>
		<p>工程實際利潤：{{profit}}</p>
	</div>
</div>
</template>
<script>
import checkPermission from '../extend/check-permission'
import view_quotation from '../api/view_quotation'
import {
	modal,
	alert,
	input as bsInput
} from 'vue-strap'

export default {
	props: {
		project: {
			type: Object
		}
	},
	components: {
		bsInput
	},
	data() {
		return {
			state: window.state,
			submitData: {
				id: "",
				ecost: undefined,
				acost: undefined,
				income: undefined
			},
			changed: false
		}
	},
	computed: {
		isEdit() {
			var state = this.project.project_state ? this.project.project_state.state : ""
			return !['quotation_save', 'draft'].some(o => o == state) && (this.project.project_state.state == "paying" && this.checkPermission(['boss', 'check']))
		},
		allowConfirm() {
			return (this.checkPermission(['boss']) || state.userInfo.name == this.project.quotation.manager) && this.project.project_state.state == 'counting'
		},
		profit() {
			return this.submitData.income - this.submitData.acost
		}
	},
	methods: {
		checkPermission,
		getProjectAccounting(project_id) {
			var that = this
			view_quotation.getProjectAccounting({
				project_id: project_id
			}).then((result) => {
				that.submitData = result
			})
		},
		saveChange() {
			var that = this
			view_quotation.saveProjectAcounting({
				ecost: that.submitData.ecost,
				acost: that.submitData.acost,
				income: that.submitData.income,
				project_id: that.project.id
			}).then((result) => {
				that.changed = false
			}).catch((err) => {
				window.alert(err)
			})
		},
		confirmInfo() {
			var that = this
			if (confirm("一旦確認，衹能由BOSS再次更改")) {
				view_quotation.confirmProjectAcounting({
					id: that.project.id
				}).then((result) => {
					that.project.project_state.state = "paying"
				}).catch((err) => {
					window.alert(err)
				})
			}
		}
	},
	watch: {
		'project': function() {
			this.getProjectAccounting(this.project.id)
		},
		'submitData.ecost': function(val, val2) {
			if (val2 != undefined) {
				this.changed = true
			}
		},
		'submitData.acost': function(val, val2) {
			if (val2 != undefined) {
				this.changed = true
			}
		},
		'submitData.income': function(val, val2) {
			if (val2 != undefined) {
				this.changed = true
			}
		}
	},
	ready() {
		if (this.project) {
			this.getProjectAccounting(this.project.id)
		}
	}
}
</script>
