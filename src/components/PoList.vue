<template>
	<div>
		<div v-if="checkPermission()">
            <vue-strap-table v-ref:table :data.sync="data" @rowaction="rowaction" @getdata="getData" :columns.sync="columns"></vue-strap-table>
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
                    "header": "序號",
                    "type": "index"
                }, {
                    "header": "PO No.",
                    "bind": "no"
                }, {
                    "header": "Prepared By",
                    "bind": "prepared_by"
                }, {
                    "header": "日期",
                    "bind": "date"
                }, {
                    "header": "備注",
                    "bind": "comments"
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
                }
            },
            getData(page, count, filterKey, append) {
                let that = this
                that.getListFunc(this.$route.params.type)({
                    page,
                    count,
                    filterKey
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