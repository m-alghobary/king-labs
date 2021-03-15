<template>
	<div class="login mx-4">
		<div>
			<h1 class="text-center mb-10 mt-10" style="color: #2057a7">King diagonsitc lab</h1>
			<v-card width="400" class="mx-auto">
				<div class="d-flex justify-center pt-2">
					<img src="../assets/logo.jpg" width="200" />
				</div>

				<v-card-title class="justify-center pb-4">
					<v-divider class="my-1"></v-divider>
					<div class="mx-4">تسجيل الدخول</div>
					<v-divider class="my-1"></v-divider>
				</v-card-title>
				<v-card-text>
					<div class="d-flex justify-center mb-6">
						<v-btn-toggle v-model="loginType" mandatory color="primary">
							<v-btn outlined max-width="80" width="80" value="user">مستخدم</v-btn>
							<v-btn outlined max-width="80" width="80" value="company">شركة</v-btn>
						</v-btn-toggle>
					</div>
					<v-form ref="loginForm" v-model="validForm" @submit.prevent="loginUser">
						<v-text-field v-model="email" label="البريد الإلكتروني" outlined required :rules="emailRules" />
						<v-text-field
							v-model="password"
							:type="showPass ? 'text' : 'password'"
							label="كلمة المرور"
							outlined
							:append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
							required
							:rules="passRules"
							@click:append="showPass = !showPass"
						/>
						<v-btn type="submit" :loading="isLoading" large block color="success">تسجيل الدخول</v-btn>
					</v-form>
				</v-card-text>
			</v-card>
			<v-snackbar v-model="showError" color="error" right>
				كلمة المرور او البريد الإلكتروني غير صحيح
				<template v-slot:action="{ attrs }">
					<v-btn dark text icon v-bind="attrs" @click="showError = false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</template>
			</v-snackbar>
		</div>
	</div>
</template>

<script>
import { authActions } from '../state/mapper.js';
export default {
	data: () => ({
		loginType: 'user',
		email: '',
		password: '',
		validForm: false,
		showPass: false,
		showError: false,
		isLoading: false,
		emailRules: [(value) => !!value || 'بريد إلكتروني مطلوب', (value) => /.+@.+\..+/.test(value) || 'يرجى إدخال بريد إلكتروني صحيح'],
		passRules: [(value) => !!value || 'كلمة المرور مطلوبة'],
	}),

	methods: {
		loginAction: authActions.logIn,
		async loginUser() {
			this.isLoading = true;

			try {
				const user = await this.loginAction({
					email: this.email,
					password: this.password,
					type: this.loginType,
				});

				this.isLoading = false;
				this.$router.push(this.$route.query.redirectFrom || user.type === 'user' ? { name: 'dashboard' } : { name: 'companyAgents' });
			} catch (error) {
				this.isLoading = false;
				this.showError = true;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.login {
	height: 100vh;
}
</style>
