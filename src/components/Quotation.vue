<template>
	<div v-if="checkPermission()">
		<alert v-if="alertText" type="success">
			{{alertText}}
		</alert>
		<div v-if="editable">
			<quotation-editor :quotation.sync="quotation"></quotation-editor>
		</div>
		<div v-if="!editable">
            <button class="btn btn-default">下載報價單</button>
			<quotation-view :quotation.sync="quotation"></quotation-view>
		</div>
		<div>
			<p>BOSS審批條件</p>
			<p>毛利率低於：{{profitSetting.profitability}}%</p>
			<p>項目總價高於：{{profitSetting.totalprofit}}</p>
		</div>
	</div>
</template>

<script>
    import checkPermission from '../extend/check-permission'
    import QuotationEditor from './QuotationEditor'
    import QuotationView from './QuotationView'
    import ViewQuotation from '../api/view_quotation'
    import {
        alert
    } from 'vue-strap'

    export default {
        props: {
            quotation_no: {
                type: String,
                default: ""
            }
        },
        components: {
            QuotationEditor,
            QuotationView,
            alert
        },
        data() {
            return {
                quotation: {},
                alertText: "",
                profitSetting: {
                    totalprofit: "0",
                    profitability: "0"
                }
            }
        },
        computed: {
            editable() {
                if (this.quotation.project) {
                    return this.quotation.project.project_state.state == "draft"
                }
            }
        },
        methods: {
            checkPermission,
            getQuotation(no) {
                return ViewQuotation.getQuotation({
                    no: no
                }).then(function(result) {
                    if (!result.quotation_date) {
                        result.quotation_date = new Date().Format("yyyy-MM-dd")
                    }
                    return result
                })
            },
            refresh() {
                var that = this
                if (that.quotation_no) {
                    that.getQuotation(that.quotation_no).then((result) => {
                        that.quotation = result
                        that.alertText = ""
                    }).catch((err) => {
                        console.log(err)
                        that.alertText = err
                    })
                }

                ViewQuotation.getProfitSetting().then((result) => {
                    that.profitSetting.totalprofit = result.totalprofit
                    that.profitSetting.profitability = result.profitability
                }).catch((err) => {
                    window.alert(err)
                })
            }
        },
        watch: {
            "quotation_no": function(val, oldVal) {
                if (val) {
                    var that = this
                    that.getQuotation(val).then((result) => {
                        that.quotation = result
                        that.alertText = ""
                    }).catch((err) => {
                        console.log(err)
                        that.alertText = err
                    })
                }
            }
        },
        events: {
            'refreshQuotation': function() {
                this.refresh()
            }
        },
        ready() {
            this.refresh()
        }
    }
</script>