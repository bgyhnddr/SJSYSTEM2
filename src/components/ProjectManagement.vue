<template>
	<div>
		<div v-if="checkPermission()">
			<navbar type="default">
				<a slot="brand" class="navbar-brand">工程管理</a>
				<li v-if="checkPermission()">
					<a v-link="{ path: '/index/ProjectManagement/Project' }">新建報價單</a>
				</li>
				<li v-if="checkPermission()">
					<a v-link="{ path: '/index/ProjectManagement/ProjectList/draft' }">報價單草稿</a>
				</li>
				<li v-if="checkPermission()">
					<a v-link="{ path: '/index/ProjectManagement/ProjectList/1' }">待核准工程</a>
				</li>
				<li v-if="checkPermission()">
					<a v-link="{ path: '/index/ProjectManagement/ProjectList/1' }">待boss確認工程</a>
				</li>
				<li v-if="checkPermission()">
					<a v-link="{ path: '/index/ProjectManagement/ProjectList/1' }">等待合同工程</a>
				</li>
				<li v-if="checkPermission()">
					<a v-link="{ path: '/index/ProjectManagement/ProjectList/1' }">已報價工程</a>
				</li>
				<li v-if="checkPermission()">
					<a v-link="{ path: '/index/ProjectManagement/ProjectList/1' }">開工中工程</a>
				</li>
				<li v-if="checkPermission()">
					<a v-link="{ path: '/index/ProjectManagement/ProjectList/1' }">未付款工程</a>
				</li>
				<li v-if="checkPermission()">
					<a v-link="{ path: '/index/ProjectManagement/ProjectList/1' }">已付款</a>
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