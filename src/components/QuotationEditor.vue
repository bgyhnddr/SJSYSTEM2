<template>
<div>
	<div>
		<div class="form-group">
			<label class="control-label">報價單編號</label>
			<p>{{quotation.no}}</p>
		</div>
		<div class="form-group">
			<label class="control-label">物業公司</label>
			<p>{{quotation.property_management_co_name}}
				<button @click="property_management_co_setting.show = true" class="btn btn-default btn-xs">選擇</button>
				<button @click="property_management_co_setting.show = false" v-if="property_management_co_setting.show" class="btn btn-default btn-xs">關閉</button>
			</p>
			<p v-if="property_management_co_setting.show">
				<property-management-co-setting :selectable="property_management_co_setting.selectable" :select-event="property_management_co_setting.selectEvent"></property-management-co-setting>
			</p>
		</div>
		<div class="form-group">
			<bs-input :value.sync="quotation.project_name" label="工程名稱"></bs-input>
		</div>
		<div class="form-group">
			<label class="control-label">工程負責人</label>
			<p>{{quotation.manager}}
				<button @click="project_manager_select_setting.show = true" class="btn btn-default btn-xs">選擇</button>
				<button @click="project_manager_select_setting.show = false" v-if="project_manager_select_setting.show" class="btn btn-default btn-xs">關閉</button>
			</p>
			<p v-if="project_manager_select_setting.show">
				<project-manager-setting :selectable="project_manager_select_setting.selectable" :select-event="project_manager_select_setting.selectEvent"></project-manager-setting>
			</p>
		</div>
		<div class="form-group">
			<label class="control-label">報價日期</label>
			<p v-if="quotation.project.project_state.boss_edit">{{new Date().Format("yyyy-MM-dd")}}</p>
			<p v-else>
				<datepicker v-ref:dp :value.sync="datepickerSetting.value" format="yyyy-MM-dd" :clear-button="datepickerSetting.clear" width="370px"></datepicker>
			</p>
		</div>
		<div class="form-group">
			<label class="control-label">盤</label>
			<button @click="building_setting.show = true" class="btn btn-default btn-xs">選擇</button>
			<p>
				<button @click="building_setting.show = false" v-if="building_setting.show" class="btn btn-default btn-xs">關閉</button>
				<div v-if="building_setting.show">
					<building-setting :selectable="building_setting.selectable" :select-event="building_setting.selectEvent"></building-setting>
				</div>
				<div v-if="!building_setting.show">
					<vue-strap-table :has-filter="false" :data.sync="building_setting.data" :columns.sync="building_setting.columns"></vue-strap-table>
					<modal :show.sync="showBuildingModel" effect="fade" :large="true">
						<div slot="modal-header" class="modal-header">
							<h4 class="modal-title">
								盤
							</h4>
						</div>
						<div slot="modal-body" class="modal-body">
							<bs-input v-show="false" :value.sync="building.id"></bs-input>
							<bs-input :value.sync="building.name" label="名稱"></bs-input>
							<bs-input :value.sync="building.name_en" label="名稱(英文)"></bs-input>
							<bs-input :value.sync="building.address" label="地址" pattern=""></bs-input>
							<bs-input :value.sync="building.address_en" label="地址（英文）" pattern=""></bs-input>
							<bs-input :value.sync="building.attn" label="聯繫人" pattern=""></bs-input>
							<bs-input :value.sync="building.attn_en" label="聯繫人（英文）" pattern=""></bs-input>
							<bs-input :value.sync="building.tel" label="電話" pattern=""></bs-input>
							<bs-input :value.sync="building.fax" label="傳真" pattern=""></bs-input>
							<bs-input :value.sync="building.mgt_tel" label="管理處電話" pattern=""></bs-input>
							<bs-input :value.sync="building.mgt_fax" label="管理處傳真" pattern=""></bs-input>
							<bs-input :value.sync="building.email" label="電郵" pattern=""></bs-input>
						</div>
						<div slot="modal-footer" class="modal-footer">
							<button type="button" class="btn btn-default" @click="showBuildingModel=false">关闭</button>
							<button :disabled="submitting" type="button" class="btn btn-success" @click="submitBuilding">確認</button>
						</div>
					</modal>
				</div>
			</p>
		</div>
		<div class="form-group">
			<label class="control-label">工程類型與項目</label>
			<p>{{quotation.project_type}} {{quotation.project_item}}
				<button @click="project_type_setting.show = true" class="btn btn-default btn-xs">選擇</button>
				<button @click="project_type_setting.show = false" v-if="project_type_setting.show" class="btn btn-default btn-xs">關閉</button>
			</p>
			<div v-if="project_type_setting.show" class="col-sm-12">
				<div class="col-sm-6">
					<project-type-setting :breadcrumb="project_type_setting.breadcrumb" :selectable="project_type_setting.selectable" :select-event="project_type_setting.selectEvent"></project-type-setting>
				</div>
				<div v-if="project_item_setting.show" class="col-sm-6">
					<project-item-setting :breadcrumb="project_item_setting.breadcrumb" :project-type.sync="project_item_setting.type" :selectable="project_item_setting.selectable" :select-event="project_item_setting.selectEvent"></project-item-setting>
				</div>
			</div>
		</div>
		<div class="col-sm-12">
			<quotation-job :retail.sync="retail" :quotation-no="quotation.no"></quotation-job>
		</div>
		<button v-if="vaild()" :disabled="finishing" @click="finish" class="btn btn-primary">{{finishing?'loading':'完成報價'}}</button>
		<label v-if="!vaild()">完成填寫報價信息后才能完成報價</label>
		<button @click="save" v-if="state.quotation_change" class="btn btn-primary">保存報價</button>
		<button @click="deleteProject" class="btn btn-danger">捨棄報價</button>
	</div>
</div>
</template>
<script>
import checkPermission from '../extend/check-permission'
import ProjectManagerSetting from './ProjectManagerSetting'
import ProjectTypeSetting from './ProjectTypeSetting'
import ProjectItemSetting from './ProjectItemSetting'
import create_quotation from '../api/create_quotation'
import view_quotation from '../api/view_quotation'
import QuotationJob from './QuotationJob'
import BuildingSetting from './BuildingSetting'
import VueStrapTable from './extend/vue-strap-table'
import PropertyManagementCoSetting from './PropertyManagementCoSetting'
import datasource from '../api/datasource'

import {
	modal,
	datepicker,
	alert,
	input as bsInput
} from 'vue-strap'

export default {
	components: {
		bsInput,
		datepicker,
		ProjectManagerSetting,
		ProjectTypeSetting,
		ProjectItemSetting,
		PropertyManagementCoSetting,
		QuotationJob,
		BuildingSetting,
		VueStrapTable,
		modal
	},
	props: {
		quotation: {
			type: Object,
			default: {
				no: "",
				property_management_co_name: "",
				property_management_co_name_en: "",
				project_name: "",
				manager: "",
				quotation_date: "",
				building_id: "",
				project_type: "",
				project_item: ""
			}
		}
	},
	data() {
		var dateNow = new Date()
		return {
			showBuildingModel: false,
			building: {
				id: "",
				name: "",
				name_en: "",
				address: "",
				address_en: "",
				attn: "",
				attn_en: "",
				tel: "",
				fax: "",
				mgt_tel: "",
				mgt_fax: "",
				email: ""
			},
			submitting: false,
			state: window.state,
			datepickerSetting: {
				value: dateNow.Format("yyyy-MM-dd"),
				clear: true
			},
			project_manager_select_setting: {
				selectable: true,
				selectEvent: "project_manager_select",
				show: false
			},
			property_management_co_setting: {
				selectable: true,
				selectEvent: "property_management_co_select",
				show: false
			},
			project_type_setting: {
				selectable: true,
				selectEvent: "project_type_select",
				show: false,
				breadcrumb: false
			},
			project_item_setting: {
				selectable: true,
				selectEvent: "project_item_select",
				show: false,
				type: "",
				breadcrumb: false
			},
			building_setting: {
				selectable: true,
				selectEvent: "building_select",
				show: false,
				hasFilter: false,
				data: {
					end: true,
					list: [{
						id: "",
						name: "",
						name_en: "",
						address: "",
						address_en: "",
						attn: "",
						attn_en: "",
						tel: "",
						fax: "",
						mgt_tel: "",
						mgt_fax: "",
						email: ""
					}]
				},
				columns: [{
					"header": "名稱",
					"bind": "name"
				}, {
					"header": "名稱(英文)",
					"bind": "name_en"
				}, {
					"header": "地址",
					"bind": "address"
				}, {
					"header": "地址（英文）",
					"bind": "address_en"
				}, {
					"header": "聯繫人",
					"bind": "attn"
				}, {
					"header": "聯繫人（英文）",
					"bind": "attn_en"
				}, {
					"header": "電話",
					"bind": "tel"
				}, {
					"header": "傳真",
					"bind": "fax"
				}, {
					"header": "管理處電話",
					"bind": "mgt_tel"
				}, {
					"header": "管理處傳真",
					"bind": "mgt_fax"
				}, {
					"header": "電郵",
					"bind": "email"
				}, {
					"header": "操作",
					"type": "action",
					"items": [{
						eventName: "editBuilding",
						tag: "button",
						class: "btn-xs",
						text: "修改"
					}]
				}]
			},
			retail: 0,
			finishing: false
		}
	},
	methods: {
		checkPermission,
		vaild() {
			var check = true
			for (var i in this.quotation) {
				if (i != "comments") {
					if (this.quotation[i] == null || this.quotation[i] == undefined || this.quotation[i] == "") {
						check = false
					}
				}
			}
			return check && this.retail
		},
		vaildBuilding() {
			return this.building.name && this.building.name_en
		},
		save() {
			var that = this
			return create_quotation.saveDraft(that.quotation).then(function() {
				that.state.quotation_change = false
			}).catch(function(err) {
				console.log(err)
				window.alert(err)
			})
		},
		deleteProject() {
			var that = this
			if (confirm("是否確認捨棄當前報價草稿？")) {
				return create_quotation.deleteProject({
					id: this.quotation.project_id
				}).then(() => {
					that.$router.go("/index/ProjectManagement/ProjectList/all")
				})
			}
		},
		finish() {
			var that = this
			that.finishing = true
			that.save().then(function() {
				if (that.vaild()) {
					return create_quotation.saveQuotation({
						no: that.quotation.no
					})
				} else {
					window.alert("信息不全不能完成")
				}
			}).then(function() {
				that.$dispatch("refreshProject")
				that.$dispatch("refreshQuotation")
				that.finishing = false
			}).catch(function(err) {
				window.alert(err)
				that.finishing = false
			})
		},
		showProjectTypeItem: function() {
			this.project_type_setting.show = true
		},
		hideProjectTypeItem: function() {
			this.project_type_setting.show = false
			this.project_item_setting.show = false
		},
		getBuilding(id) {
			if (id) {
				var that = this
				view_quotation.getBuilding(id).then((result) => {
					var newObj = {}
					for (var c in that.building_setting.data.list[0]) {
						newObj[c] = result[c]
					}
					that.building_setting.data = {
						end: true,
						list: [newObj]
					}
				}).catch((err) => {
					window.alert(err)
				})
			}
		},
		submitBuilding() {
			if (this.vaildBuilding()) {
				var that = this
				that.submitting = true
				datasource.submitBuilding(that.building).then(function(result) {
					that.submitting = false
					that.showBuildingModel = false
					return that.getBuilding(that.building.id)
				}).catch(function(err) {
					that.submitting = false
					that.serverMsg = err
				})
			}
		}
	},
	watch: {
		'quotation': {
			handler: function(val, oldVal) {
				if (oldVal.no !== undefined) {
					this.state.quotation_change = true
				}
			},
			deep: true
		},
		'quotation.quotation_date': function(val, oldVal) {
			this.datepickerSetting.value = val
		},
		'datepickerSetting.value': function(val, oldVal) {
			this.quotation.quotation_date = val
		},
		'quotation.building_id': function(val) {
			this.getBuilding(val)
		}
	},
	events: {
		'project_manager_select': function(row) {
			this.quotation.manager = row.user_account
			this.project_manager_select_setting.show = false
		},
		'project_type_select': function(row) {
			this.project_item_setting.show = true
			this.project_item_setting.type = row.name
		},
		'property_management_co_select': function(row) {
			this.property_management_co_setting.show = false
			this.quotation.property_management_co_name = row.name
		},
		'project_item_select': function(row) {
			var that = this
			if (that.quotation.project_item != row.name) {
				if (confirm("選擇工程類型項目會重置工作内容，是否確認選擇？")) {
					that.quotation.project_type = that.project_item_setting.type
					that.quotation.project_item = row.name
					that.hideProjectTypeItem() //refreshQuotationJob
					that.save().then(function() {
						that.$broadcast("refreshQuotationJob")
					})
				}
			}
		},
		'building_select': function(row) {
			this.quotation.building_id = row.id
			this.building_setting.show = false
		},
		'editBuilding': function(obj) {
			for (var i in this.building) {
				this.building[i] = obj[i]
			}
			this.showBuildingModel = true
		}
	},
	ready() {
		if (this.quotation.quotation_date) {
			this.datepickerSetting.value = this.quotation.quotation_date
		}

		if (this.quotation.building_id) {
			this.getBuilding(this.quotation.building_id)
		}
	}
}
</script>
