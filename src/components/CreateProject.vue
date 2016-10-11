<template>
	<h3>選擇物業公司</h3>
	<property-management-co-setting :selectable="selectable"></property-management-co-setting>
</template>
<script>
    import PropertyManagementCoSetting from './PropertyManagementCoSetting'
    import create_quotation from '../api/create_quotation'

    export default {
        data() {
            return {
                selectable: true
            }
        },
        components: {
            PropertyManagementCoSetting
        },
        events: {
            'select': function(row) {
                var that = this
                create_quotation.create_quotation({
                    co_id: row.id
                }).then(function(result) {
                    that.$router.go("/index/ProjectManagement/Project/" + result.id)
                }).catch(function(err) {
                    console.log(err)
                    window.alert(err)
                })
            }
        }
    }
</script>