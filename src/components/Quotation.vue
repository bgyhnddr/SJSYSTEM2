<template>
	<div>
		<div class="panel-group">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title">
						<a v-link="{ path: '/index/ProjectManagement/Project/'+$route.params.id + '/quotation' }">报价单</a>
					</h4>
				</div>
				<div class="panel-collapse collapse in">
					<div class="panel-body">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
    export default {
        components: {}
    }
</script>