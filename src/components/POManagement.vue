<template>
	<div>
		<div v-if="checkPermission()">
			<navbar type="default">
				<a slot="brand" class="navbar-brand">PO管理</a>
				<li v-if="checkPermission()">
					<a href="#" @click.prevent="$router.go('/index/POManagement/PO')">新建PO</a>
				</li>
				<li v-if="checkPermission()">
					<a href="#" @click.prevent="$router.go('/index/POManagement/POList/draft')">草稿PO</a>
				</li>
				<li v-if="checkPermission()">
					<a href="#" @click.prevent="$router.go('/index/POManagement/POList/wait')">待確認PO</a>
				</li>
				<li v-if="checkPermission()">
					<a href="#" @click.prevent="$router.go('/index/POManagement/POList/waitboss')">待審核超預算PO</a>
				</li>
				<li v-if="checkPermission()">
					<a href="#" @click.prevent="$router.go('/index/POManagement/POList/approved')">已確認/核准PO</a>
				</li>
				<li v-if="checkPermission()">
					<a href="#" @click.prevent="$router.go('/index/POManagement/POList/paid')">已付款PO</a>
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