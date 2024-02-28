import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { useSettingsState } from '../stores/settings.state';

const API_URL = 'https://api.exchangerate-api.com/v4/latest/CAD'; // Base currency: CAD
let globalRates = {}; // Global object to store rates

async function updateRates() {
    try {
        const response = await axios.get(`${API_URL}`);
        globalRates = response.data.rates;
        console.log(globalRates);
    } catch (error) {
        console.error('Error fetching currency rates:', error);
    }
}

const currencyService = {
    convert(amount) {
        const settingsStore = useSettingsState();
        const targetCurrency = settingsStore.currency;

        if (!targetCurrency || targetCurrency === 'CAD' || !globalRates[targetCurrency]) {
            return `${amount.toFixed(2)} ${targetCurrency}`;
        }

        const rate = globalRates[targetCurrency];
        return `${(amount * rate).toFixed(2)} ${targetCurrency}`;
    }
};

// Call updateRates at app start and at regular intervals
updateRates();
setInterval(updateRates, 3600000);

export default boot(({ app }) => {
    app.config.globalProperties.$c = currencyService.convert;
});
