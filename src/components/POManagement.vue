<template>
	<div>
		<div v-if="checkPermission(['view_po'])">
			<navbar type="default">
				<a slot="brand" class="navbar-brand">PO管理</a>
				<li>
					<a v-link="{ path: '/index/POManagement/PO' }">新建PO</a>
				</li>
				<li>
					<a v-link="{ path: '/index/POManagement/POList/draft' }">草稿PO</a>
				</li>
				<li>
					<a v-link="{ path: '/index/POManagement/POList/wait' }">待確認PO</a>
				</li>
				<li>
					<a v-link="{ path: '/index/POManagement/POList/waitboss' }">待審核超預算PO</a>
				</li>
				<li>
					<a v-link="{ path: '/index/POManagement/POList/approved' }">已確認/核准PO</a>
				</li>
				<li>
					<a v-link="{ path: '/index/POManagement/POList/paid' }">已付款PO</a>
				</li>
				<li>
					<a v-link="{ path: '/index/POManagement/POList/all' }">全部PO</a>
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
