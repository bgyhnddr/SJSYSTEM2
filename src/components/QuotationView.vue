<template>
	<div>
		<div v-if="checkPermission()">
			<p>報價單編號：{{quotation.no}}</p>
			<p>物業公司：{{quotation.property_management_co_name}}</p>
			<p>工程名稱：{{quotation.project_name}}</p>
			<p>工程負責人：{{quotation.manager}}</p>
			<p>報價日期：{{quotation.quotation_date}}</p>
			<p>盤</p>
			<vue-strap-table :has-filter="false" :data.sync="building_setting.data" :columns.sync="building_setting.columns"></vue-strap-table>
			<p>工程類型與項目：{{quotation.project_type}} {{quotation.project_item}}</p>
			<p>工作内容</p>
			<quotation-job :editable="false" :quotation-no="quotation.no"></quotation-job>
		</div>
	</div>
</template>
<script>
    import checkPermission from '../extend/check-permission'
    import VueStrapTable from './extend/vue-strap-table'
    import view_quotation from '../api/view_quotation'
    import QuotationJob from './QuotationJob'
    export default {
        components: {
            VueStrapTable,
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
                    project_item: ""
                }
            }
        },
        methods: {
            checkPermission,
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
            }
        },
        data() {
            return {
                building_setting: {
                    data: {
                        end: true,
                        list: [{
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
                        "header": "賬單地址",
                        "bind": "bill_address"
                    }, {
                        "header": "賬單地址（英文）",
                        "bind": "bill_address_en"
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
                        "header": "電郵",
                        "bind": "email"
                    }]
                }
            }
        },
        watch: {
            'quotation': {
                handler: function(val, oldVal) {
                    this.getBuilding(this.quotation.building_id)
                },
                deep: true
            }
        },
        ready() {
            if (this.quotation.building_id) {
                this.getBuilding(this.quotation.building_id)
            }
        }
    }
</script>