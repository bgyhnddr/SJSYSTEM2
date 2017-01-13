<template>
<div>
	<div v-if="checkPermission(['datasource'])">
		<ol v-if="breadcrumb" class="breadcrumb">
			<li>
				<a v-link="{ path: '/index/DataManagement/ProjectType' }">工程類別</a>
			</li>
			<li class="active">{{type}}</li>
		</ol>
		<div>
			<button @click="addProjectItem" class="btn btn-default">添加工程項目</button>
			<div style="position:relative">
				<vue-strap-table :err-msg.sync="errMsg" :data.sync="data" :get-data-event="getData" :columns="columns"></vue-strap-table>
			</div>
			<modal :show.sync="showProjectItemModel" effect="fade" width="400">
				<div slot="modal-header" class="modal-header">
					<h4 class="modal-title">
						工程項目
					</h4>
				</div>
				<div slot="modal-body" class="modal-body">
					<alert :type="alertType">
						{{alertText}}
					</alert>
					<bs-input :value.sync="submitData.name" label="名稱"></bs-input>
				</div>
				<div slot="modal-footer" class="modal-footer">
					<button type="button" class="btn btn-default" @click="showProjectItemModel=false">关闭</button>
					<button :disabled="submitting" type="button" class="btn btn-success" @click="submitProjectItem">確認</button>
				</div>
			</modal>
		</div>
	</div>
</div>
</template>

<script>
import VueStrapTable from './extend/vue-strap-table'
import {
	modal,
	alert,
	input as bsInput
} from 'vue-strap'
import datasource from '../api/datasource'
import checkPermission from '../extend/check-permission'
import VueRouter from "vue-router" //首先导入路由对象

export default {
	props: {
		selectable: {
			type: Boolean,
			default: false
		},
		selectEvent: {
			type: String,
			default: 'select'
		},
		projectType: {
			type: String,
			default: ""
		},
		breadcrumb: {
			type: Boolean,
			default: true
		}
	},
	components: {
		VueStrapTable,
		modal,
		alert,
		bsInput
	},
	data() {
		let columns = [{
			"header": "名稱",
			"bind": "name"
		}, {
			"header": "操作",
			"type": "action",
			"items": [{
				eventName: "editUploadDetail",
				tag: "button",
				class: "btn-xs",
				text: "编辑上傳模板"
			}, {
				eventName: "editContentDetail",
				tag: "button",
				class: "btn-xs",
				text: "编辑内容模板"
			}, {
				eventName: "edit",
				tag: "button",
				class: "btn-xs",
				text: "修改"
			}, {
				eventName: "delete",
				tag: "button",
				class: "btn-xs",
				text: "刪除"
			}]
		}]
		if (this.selectable) {
			columns.unshift({
				"header": "",
				"type": "action",
				"items": [{
					eventName: this.selectEvent,
					tag: "button",
					class: "btn-xs",
					text: "選擇"
				}]
			})
		}
		return {
			submitting: false,
			getData: "getData",
			submitData: {
				id: "",
				name: ""
			},
			showProjectItemModel: false,
			data: {},
			serverMsg: "",
			columns: columns,
			errMsg: ""
		}
	},
	computed: {
		alertType() {
			return this.valid() ? "success" : "warning"
		},
		alertText() {
			if (this.serverMsg) {
				return this.serverMsg;
			}
			let returnText = "請輸入";
			if (!this.valid()) {
				returnText = "請輸入"
			}
			return returnText
		},
		type() {
			return this.projectType ? this.projectType : decodeURIComponent(this.$route.params.type)
		}
	},
	watch: {
		'projectType': function(val) {
			this.$broadcast("refreshData")
		}
	},
	methods: {
		checkPermission,
		valid() {
			return this.submitData.name
		},
		addProjectItem() {
			for (var i in this.submitData) {
				this.submitData[i] = ""
			}
			this.showProjectItemModel = true
		},
		submitProjectItem() {
			if (this.valid()) {
				var that = this
				that.submitting = true
				datasource.submitProjectItem({
					id: that.submitData.id,
					name: that.submitData.name,
					project_type_name: that.type
				}).then(function(result) {
					that.submitting = false
					that.$broadcast("refreshData")
					that.showProjectItemModel = false
					that.serverMsg = ""
				}).catch(function(err) {
					that.submitting = false
					that.serverMsg = err
				})
			}
		},
		editProjectItem(row) {
			for (var i in this.submitData) {
				this.submitData[i] = row[i]
			}
			this.showProjectItemModel = true
		},
		deleteProjectItem(row) {
			if (window.confirm("是否確認刪除：" + row.name + "及其相關的工程項目與模板?")) {
				var that = this
				datasource.deleteProjectItem({
					id: row.id
				}).then(function(result) {
					that.$broadcast("refreshData")
				}).catch(function(err) {
					window.alert(err)
				})
			}
		}
	},
	events: {
		"edit": function(row) {
			this.editProjectItem(row)
		},
		"delete": function(row) {
			this.deleteProjectItem(row)
		},
		"getData": function(pageNum, countPerPage, filterKey, append) {
			let that = this
			datasource.getProjectItems(that.type, pageNum, countPerPage, filterKey).then(function(result) {
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
		"editUploadDetail": function(row) {
			this.$router.go("/index/DataManagement/ProjectType/" + encodeURIComponent(this.type) + "/" + encodeURIComponent(row.name) + "/upload")
		},
		"editContentDetail": function(row) {
			this.$router.go("/index/DataManagement/ProjectType/" + encodeURIComponent(this.type) + "/" + encodeURIComponent(row.name) + "/job")
		}
	},
	ready() {
		this.$broadcast("refreshData")
	}
}
</script>
