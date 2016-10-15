<template>
	<div v-if="checkPermission()">
		<button @click="save" v-if="change" class="btn btn-default">保存</button>
		<div class="form-group">
			<label class="control-label">報價單編號</label>
			<p>{{quotation.no}}</p>
		</div>
		<div class="form-group">
			<label class="control-label">物業公司</label>
			<p>{{quotation.property_management_co_name}}</p>
		</div>
		<div class="form-group">
			<bs-input :value.sync="quotation.project_name" label="工程名稱"></bs-input>
		</div>
		<div class="form-group">
			<label class="control-label">工程負責人</label>
			<p>{{quotation.manager}}<button @click="project_manager_select_setting.show = true" class="btn btn-default btn-xs">選擇</button>
				<button @click="project_manager_select_setting.show = false" v-if="project_manager_select_setting.show" class="btn btn-default btn-xs">關閉</button></p>
			<p v-if="project_manager_select_setting.show">
				<project-manager-setting :selectable="project_manager_select_setting.selectable" :select-event="project_manager_select_setting.selectEvent"></project-manager-setting>
			</p>
		</div>
		<div class="form-group">
			<label class="control-label">報價日期</label>
			<p>
				<datepicker v-ref:dp :value.sync="datepickerSetting.value" format="yyyy-MM-dd" :clear-button="datepickerSetting.clear" width="370px"></datepicker>
			</p>
		</div>
		<div class="form-group">
			<label class="control-label">盤名</label>
			<p>{{quotation.building_detail.name}}</p>
		</div>
		<div class="form-group">
			<label class="control-label">工程類型與項目</label>
			<p>{{quotation.project_type}} {{quotation.project_item}}<button @click="project_type_setting.show = true" class="btn btn-default btn-xs">選擇</button>
				<button @click="project_type_setting.show = false" v-if="project_type_setting.show" class="btn btn-default btn-xs">關閉</button>
			</p>
			<div v-if="project_type_setting.show">
				<div class="col-sm-6">
					<project-type-setting :breadcrumb="project_type_setting.breadcrumb" :selectable="project_type_setting.selectable" :select-event="project_type_setting.selectEvent"></project-type-setting>
				</div>
				<div v-if="project_item_setting.show" class="col-sm-6">
					<project-item-setting :breadcrumb="project_item_setting.breadcrumb" :project-type="project_item_setting.type" :selectable="project_item_setting.selectable"
						:select-event="project_item_setting.selectEvent"></project-item-setting>
				</div>
			</div>
		</div>
		<div class="col-sm-12">
			<quotation-job :quotation-no="quotation.no"></quotation-job>
		</div>
	</div>
</template>
<script>
    import checkPermission from '../extend/check-permission'
    import ProjectManagerSetting from './ProjectManagerSetting'
    import ProjectTypeSetting from './ProjectTypeSetting'
    import ProjectItemSetting from './ProjectItemSetting'
    import create_quotation from '../api/create_quotation'
    import QuotationJob from './QuotationJob'

    import {
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
            QuotationJob
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
                    project_item: "",
                    building_detail: {
                        name: "",
                        name_en: "",
                        address: "",
                        address_en: "",
                        bill_address: "",
                        bill_address_en: "",
                        attn: "",
                        attn_en: "",
                        tel: "",
                        fax: "",
                        email: ""
                    }
                }
            }
        },
        data() {
            var dateNow = new Date()
            return {
                change: false,
                datepickerSetting: {
                    value: dateNow.Format("yyyy-MM-dd"),
                    clear: true
                },
                project_manager_select_setting: {
                    selectable: true,
                    selectEvent: "project_manager_select",
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
                }
            }
        },
        methods: {
            checkPermission,
            save() {
                var that = this
                return create_quotation.saveDraft(that.quotation).then(function() {
                    that.change = false
                }).catch(function(err) {
                    window.alert(err)
                })
            },
            showProjectTypeItem: function() {
                this.project_type_setting.show = true
            },
            hideProjectTypeItem: function() {
                this.project_type_setting.show = false
                this.project_item_setting.show = false
            }
        },
        watch: {
            'quotation': {
                handler: function(val, oldVal) {
                    if (oldVal.no !== undefined) {
                        this.change = true
                    }
                },
                deep: true
            },
            'quotation.quotation_date': function(val, oldVal) {
                this.datepickerSetting.value = val
            },
            'datepickerSetting.value': function(val, oldVal) {
                this.quotation.quotation_date = val
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
            }
        },
        ready() {
            if (this.quotation.quotation_date) {
                this.datepickerSetting.value = quotation.quotation_date
            }
        }
    }
</script>