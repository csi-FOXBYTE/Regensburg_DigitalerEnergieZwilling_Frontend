import viewer from "../modules/viewer/locales/en.json";

declare module "i18next" {
	interface CustomTypeOptions {
		resources: {
			viewer: typeof viewer,
		}
	}
}
