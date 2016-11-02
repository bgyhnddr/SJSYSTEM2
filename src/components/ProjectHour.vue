<template>
	<div class="panel panel-default">
		<div class="panel-heading">工時錄入</div>
		<div class="panel-body">
			<button @click="addHours" class="btn btn-default">新增記錄</button>
			<table class="table table-hover table-condensed">
				<thead>
					<tr>
						<th>
							開工日期
						</th>
						<th>
							開工員工
						</th>
						<th>
							開工時長
						</th>
						<th>
							備注
						</th>
						<th>
							操作
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row of hours">
						<td>{{row.begin_date}}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<script>
    import checkPermission from '../extend/check-permission'
    import create_quotation from '../api/create_quotation'
    import view_quotation from '../api/view_quotation'
    import VueStrapUpload from './extend/vue-strap-upload'
    export default {
        props: {
            project: {
                type: Object
            }
        },
        data() {
            return {
                hours: []
            }
        },
        methods: {
            getProjectHours(id) {
                var that = this
                view_quotation.getProjectHours({
                    id: id
                }).then((result) => {
                    that.hours = result
                })
            },
            submitProjectHour(obj) {
                var that = this
                create_quotation.submitProjectHour(obj).then((result) => {
                    that.getProjectHours(that.project.id)
                })
            }
        },
        watch: {
            'project': function() {
                this.getProjectHours(this.project.id)
            }
        },
        ready() {
            if (this.project) {
                this.getProjectHours(this.project.id)
            }
        }
    }
</script>