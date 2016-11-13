<template>
<div class="container-fluid">
	<div v-if="checkPermission(['boss'])">
		<div class="panel panel-default">
			<div class="panel-heading">報價單BOSS審批條件</div>
			<div class="panel-body">
				<button @click="save" v-if="changed" class="btn btn-default">保存</button>
				<bs-input :value.sync="profitability" label="利潤率(%)低於" type="number"></bs-input>
				<bs-input :value.sync="totalprofit" label="項目總價高於" type="number"></bs-input>
			</div>
		</div>
	</div>
</template>
<script>
import boss from '../api/boss'
import view_quotation from '../api/view_quotation'
import {
	spinner,
	input as bsInput
} from 'vue-strap'
import checkPermission from '../extend/check-permission'

export default {
	components: {
		spinner,
		bsInput
	},
	data() {
		return {
			totalprofit: undefined,
			profitability: undefined,
			initData: true,
			changed: false
		}
	},
	methods: {
		checkPermission,
		getSetting() {
			var that = this
			view_quotation.getProfitSetting().then((result) => {
				that.totalprofit = result.totalprofit
				that.profitability = result.profitability
			})
		},
		save() {
			var that = this
			boss.submitConfirmInfo({
				totalprofit: this.totalprofit,
				profitability: this.profitability
			}).then(() => {
				that.changed = false
			}).catch((err) => {
				window.alert(err)
			})
		}
	},
	watch: {
		'totalprofit': function(val, oval) {
			if (oval != undefined) {
				this.changed = true
			}
		},
		'profitability': function(val, oval) {
			if (oval != undefined) {
				this.changed = true
			}
		}
	},
	ready() {
		this.getSetting()
	}
}
</script>
