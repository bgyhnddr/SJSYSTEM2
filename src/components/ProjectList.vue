<template>
	<div>
		<vue-strap-table v-ref:table :data.sync="data" @rowaction="rowaction" @getdata="getData" :columns.sync="columns"></vue-strap-table>
	</div>
</template>
<script>
    import VueStrapTable from './extend/vue-strap-table'
    import checkPermission from '../extend/check-permission'
    import view_quotation from '../api/view_quotation'

    export default {
        components: {
            VueStrapTable
        },
        data() {
            return {
                columns: [{
                    "header": "報價單編號",
                    "bind": "quotation_no"
                }, {
                    "header": "物業管理公司",
                    "bind": "property_management_co_name"
                }, {
                    "header": "負責人",
                    "bind": "manager"
                }, {
                    "header": "盤名",
                    "bind": "building_name"
                }, {
                    "header": "工程名稱",
                    "bind": "project_name"
                }, {
                    "header": "工程類型",
                    "bind": "project_type"
                }, {
                    "header": "工程狀態",
                    "bind": "state"
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
            getData(page, count, filterKey, append) {
                let that = this
                view_quotation.getProjects({
                    page,
                    count,
                    filterKey,
                    type: that.$route.params.type
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
                this.$router.go("/index/ProjectManagement/Project/" + row.id)
            }
        },
        route: {
            data() {
                this.$refs.table.$emit("refreshData")
            }
        },
        ready() {

        }
    }
</script>