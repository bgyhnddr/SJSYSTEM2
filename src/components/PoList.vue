<template>
<div>
	<div v-if="checkPermission(['view_po'])">
		<vue-strap-table :has-sort="true" v-ref:table :data.sync="data" @rowaction="rowaction" @getdata="getData" :columns.sync="columns"></vue-strap-table>
	</div>
</div>
</template>
<script>
import VueStrapTable from './extend/vue-strap-table'
import checkPermission from '../extend/check-permission'
import view_po from '../api/view_po'

export default {
	components: {
		VueStrapTable
	},
	data() {
		return {
			columns: [{
				"header": "PO No.",
				"bind": "no",
				"sortable": true
			}, {
				"header": "Prepared By",
				"bind": "prepared_by",
				"sortable": true
			}, {
				"header": "日期",
				"bind": "date",
				"sortable": true
			}, {
				"header": "報價單",
				"bind": "quotation_nos",
				"sortable": true
			}, {
				"header": "操作",
				"type": "action",
				"items": [{
					eventName: "goto",
					tag: "button",
					class: "btn-xs",
					text: "進入"
				}]
			}],
			data: {
				list: [],
				end: true
			}
		}
	},
	methods: {
		checkPermission,
		getListFunc(type) {
			switch (type) {
				case "draft":
					return view_po.getPODrafts
				case "wait":
					return view_po.getPOWaitApproves
				case 'waitboss':
					return view_po.getPOWaitBossApproves
				case 'approved':
					return view_po.getApproved
				case 'paid':
					return view_po.getPOPaids
				case 'all':
					return view_po.getPOs
			}
		},
		getData(page, count, filterKey, append, sort) {
			let that = this
			that.getListFunc(this.$route.params.type)({
				page,
				count,
				filterKey,
				sort
			}).then(function(result) {
				if (append) {
					that.data.end = result.end
					that.data.list = that.data.list.concat(result.list)
				} else {
					that.data = result
				}
			}).catch(function(err) {
				that.errMsg = err
			})
		},
		rowaction(event, row) {
			this.$router.go("/index/POManagement/PO/" + row.id)
		}
	},
	route: {
		data() {
			this.$refs.table.$emit("refreshData")
		}
	}
}
</script>
