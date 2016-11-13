<template>
	<div>
		<div>
			<navbar type="default">
				<a slot="brand" class="navbar-brand">報表</a>
				<li v-if="checkPermission(['view_quotation'])">
					<a href="#" @click.prevent="$router.go('/index/ReportManager/Hour')">工時報表</a>
				</li>
			</navbar>
			<router-view class="view" transition="fate" transition-mode="out-in"></router-view>
		</div>
	</div>
</template>
<script>
    import {
        navbar
    } from 'vue-strap'
    import checkPermission from '../extend/check-permission'

    export default {
        components: {
            navbar
        },
        methods: {
            checkPermission
        }
    }
</script>
