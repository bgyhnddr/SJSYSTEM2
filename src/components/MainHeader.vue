<template>
<div>
	<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css">
	<navbar type="default">
		<!-- Brand as slot -->
		<a slot="brand" href="/" title="Home" class="navbar-brand">
			<img style="width: 200px;" src='../assets/img/logo.png'>
		</a>
		<!-- For right positioning use slot -->
		<li v-if="checkPermission(['view_quotation'])">
			<a v-link="{ path: '/index/ProjectManagement' }">工程管理</a>
		</li>
		<li v-if="checkPermission(['view_po'])">
			<a v-link="{ path: '/index/POManagement' }">PO管理</a>
		</li>
		<li v-if="checkPermission(['datasource'])">
			<a v-link="{ path: '/index/DataManagement' }">數據管理</a>
		</li>
		<li v-if="checkPermission(['view_quotation'])">
			<a v-link="{ path: '/index/ReportManager' }">報表</a>
		</li>
		<li v-if="checkPermission(['boss'])">
			<a v-link="{ path: '/index/RBACManagement' }">權限管理</a>
		</li>
		<li v-if="checkPermission(['boss'])">
			<a v-link="{ path: '/index/Setting' }">設定</a>
		</li>
		<dropdown slot="right" v-if="state.userInfo.name" :text="state.userInfo.name">
			<li>
				<a @click="changePassword=true">change password</a>
			</li>
			<li>
				<a @click="submitLogout">Logout</a>
			</li>
		</dropdown>
		<li v-else slot="right">
			<a @click="showModal">登录</a>
		</li>
	</navbar>
	<login-modal></login-modal>
	<change-password-modal :show.sync="changePassword"></change-password-modal>
</div>
</template>

<script>
import {
	dropdown,
	navbar
} from 'vue-strap'
import LoginModal from './LoginModal'
import ChangePasswordModal from './ChangePasswordModal'
import authAPI from '../api/auth'
import checkPermission from '../extend/check-permission'

export default {
	data() {
		return {
			state: window.state,
			changePassword: false
		}
	},
	components: {
		navbar,
		dropdown,
		LoginModal,
		ChangePasswordModal
	},
	methods: {
		showModal() {
			this.state.showLoginModal = true
		},
		checkPermission,
		submitLogout() {
			var vm = this;
			authAPI.logout().then(function() {
				window.actions.logout()
			});
		}
	}
}
</script>
