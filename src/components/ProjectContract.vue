<template>
	<div v-if="checkPermission()">
		<div class="panel panel-default">
			<div class="panel-heading">合同</div>
			<div class="panel-body">
				合同
				<vue-strap-upload></vue-strap-upload>
			</div>
		</div>
	</div>
</template>
<script>
    import checkPermission from '../extend/check-permission'
    import VueStrapUpload from './extend/vue-strap-upload'

    export default {
        components: {
            VueStrapUpload
        },
        props: {
            projectId: {
                type: String
            }
        },
        data() {
            return {}
        },
        computed: {},
        methods: {
            checkPermission
        },
        watch: {},
        events: {},
        ready() {}
    }
</script>