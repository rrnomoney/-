import {
	createSSRApp
} from "vue";
import { createPinia } from 'pinia'
import App from "./App.vue";

export function createApp() {
	const app = createSSRApp(App);
	const pinia = createPinia();
	
	app.use(pinia);
	
	// 配置路由
	app.config.globalProperties.$router = {
		push: (url) => {
			uni.navigateTo({ url });
		},
		replace: (url) => {
			uni.redirectTo({ url });
		},
		back: () => {
			uni.navigateBack();
		}
	};
	
	return {
		app,
	};
}
