import { boot } from "quasar/wrappers";
import { createI18n } from "vue-i18n";
import messages from "src/i18n";
import fs from "fs";

const i18n = createI18n({
	locale: "en-US",
	fallbackLocale: "en-US",
	messages,
});

const translationService = {
	async translate(exp) {
		const { $t, te } = i18n.global;
		if (!te(exp)) {
			console.warn(`Translation for '${exp}' not found!`);

			// TODO:add exp to object in files /src/i18n/en-US/index.js /src/i18n/fr-CA/index.js
			const langs = ["en-US", "fr-CA"];
			for (const lang of langs) {
				const jsonFilePath = `src/i18n/${lang}/t.json`;
				const jsonFile = await import(`src/i18n/${lang}/t.json`);
				if (!jsonFile[exp]) {
					jsonFile[exp] = exp;
				}
				// Todo: save json to json file
				await fs.writeFile(jsonFilePath, jsonFile, "utf8");
			}

			return exp; // Fallback to the original expression
		}
		return $t(exp);
	},
};

export default boot(({ app }) => {
	app.config.globalProperties.$tt = translationService.translate;
});
