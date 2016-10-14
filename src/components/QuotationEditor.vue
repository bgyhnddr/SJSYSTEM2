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
			<p>{{quotation.manager}}</p>
		</div>
		<div class="form-group">
			<label class="control-label">報價日期</label>
			<p>
				<datepicker v-ref:dp :value.sync="datepickerSetting.value" format="yyyy-MM-dd" :clear-button="datepickerSetting.clear" width="370px"></datepicker>
			</p>
		</div>
		<div class="form-group">
			<label class="control-label">盤名</label>
			<p>{{quotation.building}}</p>
		</div>
		<div class="form-group">
			<label class="control-label">工程類型與項目</label>
			<p>{{quotation.project_type}} {{quotation.project_item}}</p>
		</div>
	</div>
</template>
<script>
    import checkPermission from '../extend/check-permission'

    import {
        datepicker,
        alert,
        input as bsInput
    } from 'vue-strap'

    export default {
        props: {
            quotation: {
                type: Object,
                default: {
                    no: "",
                    property_management_co: "",
                    project_name: "",
                    manager: "",
                    quotation_date: "",
                    building: "",
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
        components: {
            bsInput,
            datepicker
        },
        data() {
            var dateNow = new Date()
            return {
                change: false,
                datepickerSetting: {
                    value: dateNow.Format("yyyy-MM-dd"),
                    clear: true
                }
            }
        },
        methods: {
            checkPermission,
            save() {
                this.change = false
            }
        },
        watch: {
            'quotation': {
                handler: function(val, oldVal) {
                    console.log(val)
                    this.change = true
                },
                deep: true
            }
        },
        ready() {
            if (quotation.quotation_date) {
                this.datepickerSetting.value = quotation.quotation_date
            }
        }
    }
</script>