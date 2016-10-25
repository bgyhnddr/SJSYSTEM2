<template>
	<div>
		<div v-if="checkPermission()">
			<navbar type="default">
				<a slot="brand" class="navbar-brand">工程管理</a>
				<li v-if="checkPermission()">
					<a v-link="{ path: '/index/ProjectManagement/Project' }">新建報價單</a>
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