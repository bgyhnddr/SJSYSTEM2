<template>
	<div v-if="checkPermission()">
		<alert v-if="alertText" type="success">
			{{alertText}}
		</alert>
		<quotation-editor :quotation.sync="quotation"></quotation-editor>
	</div>
</template>

<script>
    import checkPermission from '../extend/check-permission'
    import QuotationEditor from './QuotationEditor'
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
            alert
        },
        data() {
            return {
                quotation: {},
                alertText: ""
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
                    console.log("sdfsdfds" + result)
                    return result
                })
            }
        },
        watch: {
            "quotation_no": function(val, oldVal) {
                window.alert(val + "mark")
                if (val) {
                    var that = this
                    that.getQuotation(val).then((result) => {
                        that.quotation = result
                        that.alertText = ""
                        console.log(that.quotation)
                    }).catch((err) => {
                        console.log(err)
                        that.alertText = err
                    })
                }
            }
        },
        ready() {
            var that = this
            if (that.quotation_no) {
                that.getQuotation(that.quotation_no).then((result) => {
                    that.quotation = result
                    that.alertText = ""
                    console.log(that.quotation)
                }).catch((err) => {
                    console.log(err)
                    that.alertText = err
                })
            }
        }
    }
</script>