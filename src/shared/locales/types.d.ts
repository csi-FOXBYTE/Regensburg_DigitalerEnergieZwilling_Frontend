import adminDashboard from "../modules/adminDashboard/locales/en.json";
import test from "../modules/test/locales/en.json";
import viewer from "../modules/viewer/locales/en.json";

declare module "i18next" {
	interface CustomTypeOptions {
		resources: {
			adminDashboard: typeof adminDashboard,
			test: typeof test,
			viewer: typeof viewer,
		}
	}
}
