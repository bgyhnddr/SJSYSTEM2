<template>
	<div>
		<div v-if="checkPermission(['datasource'])">
			<navbar type="default">
				<a slot="brand" class="navbar-brand">數據管理</a>
				<li>
					<a v-link="{ path: '/index/DataManagement/ProjectType' }">工程類型管理</a>
				</li>
				<li v-if="checkPermission(['boss'])">
					<a v-link="{ path: '/index/DataManagement/ProjectManager' }">工程負責人</a>
				</li>
				<li>
					<a v-link="{ path: '/index/DataManagement/Building' }">盤</a>
				</li>
				<li>
					<a v-link="{ path: '/index/DataManagement/PropertyManagementCo' }">物業公司</a>
				</li>
				<li>
					<a v-link="{ path: '/index/DataManagement/Staff' }">開工員工</a>
				</li>
				<li>
					<a v-link="{ path: '/index/DataManagement/OutSourceContractor' }">外判資料</a>
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
