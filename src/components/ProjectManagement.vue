<template>
	<div>
		<div v-if="checkPermission(['view_quotation'])">
			<navbar type="default">
				<a slot="brand" class="navbar-brand">工程管理</a>
				<li v-if="checkPermission(['create_quotation'])">
					<a v-link="{ path: '/index/ProjectManagement/Project' }">新建報價單</a>
				</li>
				<li>
					<a v-link="{ path: '/index/ProjectManagement/ProjectList/draft' }">報價單草稿</a>
				</li>
				<li>
					<a v-link="{ path: '/index/ProjectManagement/ProjectList/wait_approve' }">待核准工程</a>
				</li>
				<li>
					<a v-link="{ path: '/index/ProjectManagement/ProjectList/wait_approve_boss' }">待boss核准工程</a>
				</li>
				<li>
					<a v-link="{ path: '/index/ProjectManagement/ProjectList/wait_contract' }">等待合同工程</a>
				</li>
				<li>
					<a v-link="{ path: '/index/ProjectManagement/ProjectList/quotation_contract' }">已確認工程</a>
				</li>
				<li>
					<a v-link="{ path: '/index/ProjectManagement/ProjectList/working' }">施工中工程</a>
				</li>
				<li>
					<a v-link="{ path: '/index/ProjectManagement/ProjectList/counting' }">已完成工程</a>
				</li>
				<li>
					<a v-link="{ path: '/index/ProjectManagement/ProjectList/wait_invoice' }">待開發票工程</a>
				</li>
				<li>
					<a v-link="{ path: '/index/ProjectManagement/ProjectList/wait_pay' }">待收款工程</a>
				</li>
				<li>
					<a v-link="{ path: '/index/ProjectManagement/ProjectList/paid' }">已收款工程</a>
				</li>
				<li>
					<a v-link="{ path: '/index/ProjectManagement/ProjectList/all' }">全部工程</a>
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
