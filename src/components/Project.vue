<template>
	<div>
		<alert v-if="alertText" type="success">
			{{alertText}}
		</alert>
		<div v-if="project.id">
			<div class="panel-group">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h4 class="panel-title">
							<a v-link="{ path: '/index/ProjectManagement/Project/'+$route.params.id + '/quotation' }">报价单</a>
						</h4>
					</div>
					<div class="panel-collapse collapse in">
						<div class="panel-body">
							<quotation :quotation_no.sync="project.quotation_no"></quotation>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
    import checkPermission from '../extend/check-permission'
    import Quotation from './Quotation'
    import view_quotation from '../api/view_quotation'
    import {
        alert
    } from 'vue-strap'
    export default {
        data() {
            return {
                alertText: "",
                project: {}
            }
        },
        components: {
            Quotation,
            alert
        },
        methods: {
            checkPermission,
            getProject(id) {
                return view_quotation.getProject({
                    id: id
                })
            }
        },
        ready() {
            var that = this
            that.getProject(that.$route.params.id).then((result) => {
                console.log(result)
                that.project = result
                that.alertText = ""
            }).catch((err) => {
                that.alertText = err
            })
        }
    }
</script>