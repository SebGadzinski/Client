import {api} from '../boot/axios';
import {Preferences} from '@capacitor/preferences';
import {Capacitor} from '@capacitor/core';
import {i18n} from '../boot/i18n';

class DataService {
    /**
     * Checks to see if there is a update available for the application
     * @returns {Object}
     */
    async checkForUpdate() {
        return new Promise((resolve, reject) => {
            let currentVersion = require('../../package.json').version;
            if (! currentVersion)
                reject(null);

            api.post('/app/checkForUpdate', {currentVersion}).then((response) => {
                if (!response.data)
                    return reject('No Data In Response');

                console.log(response);
                resolve(response.data);
            }).catch((err) => {
                let {message} = err;
                if (message.includes('304')) { // no update available
                    return resolve({message: 'No Update Available'});
                }
                reject(message);
            });
        });
    }

    /**
     * Updates Subscriptio for firebase notification
     * @param {String} token
     * @param {String} enable
     * @returns
     */
    updateNotificationSubscription({token, enable}) {
        return new Promise((resolve, reject) => {
            if (!token)
                return reject('No Token for updateNotification');

            let obj = {
                token,
                enable,
            };
            api.post('/app/updateNotificationSubscription', obj).then((resp) => {
                if(resp.data.success){
                    resolve(true);
                }else{
                    console.log("Message: ");
                    console.log(resp.data.message);
                    throw new Error("Could not turn on notififications");
                }
            }).catch(({message}) => {
                reject(message);
            });
        });
    }

    async getHomePageData() {
        return await this.call(api.get('/data/getHomePageData'), "Could not get home page data");
    }

    async getCategoryPageData(categorySlug) {
        return await this.call(api.post('/data/getCategoryPageData', { categorySlug }), "Could not get category page data");
    }

    async getServicePageData(categorySlug, serviceSlug) {
        return await this.call(api.post('/data/getServicePageData', { categorySlug, serviceSlug }), "Could not get service page data");
    }

    async getMeetingPageData(categorySlug, serviceSlug) {
        return await this.call(api.post('/data/getMeetingPageData', { categorySlug, serviceSlug, date: new Date() }), "Could not get meeting page data");
    }

    async findUnavailableDurations(date) {
        return await this.call(api.post('/data/meeting/findUnavailableDurations', { date }), "Could not find unavailable durations");
    }

    async bookMeeting({categorySlug, serviceSlug, startDate}) {
        try{
            return await api.post('/data/meeting/book', {
                categorySlug, serviceSlug, startDate
              });
        }catch(err){
            throw err;
        }
    }

    async getWorkPageData() {
        return await this.call(api.get('/data/getWorkPageData'), "Could not get work page data");
    }

    async getWorkConfirmationPageData(workId) {
        return await this.call(api.post('/data/getWorkConfirmationPageData', { workId }), "Could not get work confirmation page data");
    }

    async getWorkCancelPageData(workId) {
        return await this.call(api.post('/data/getWorkCancelPageData', { workId }), "Could not get work cancel page data");
    }

    async confirmWork(workId) {
        return await this.call(api.post('/data/work/confirm', { workId }));
    }

    async cancelWork(workId) {
        return await this.call(api.post('/data/work/cancel', { workId }));
    }

    async getWorkViewComponent(workId) {
        return await this.call(api.post('/data/work/viewComponent', { workId }));
    }

    async getWorkEditorPageData(workId) {
        return await this.call(api.post('/data/getWorkEditorPageData', { workId }), "Could not get work editor page data");
    }

    async upsertWork(work) {
        return await this.call(api.post('/data/work/upsert', work));
    }

    async getWorkComponent(workId) {
        return await this.call(api.post('/data/work', { workId }), "Could not get work component");
    }


    async getUserPageData() {
        return await this.call(api.get('/data/admin/getUserPageData'), "Could not get work data");
    }

    async getProfile(userId) {
        let body = {};
        if(userId){
            body.userId = userId;
        }
        return await this.call(api.post(`/data/getProfile`, body), "Could not get profile");
    }

    async saveProfile(userId, user) {
        return await this.call(api.post('/data/saveProfile', {userId, user}));
    }

    async generateConfirmationPayment(workId, type, paymentItemId = null) {
        let body = {
            workId, type
        };
        if(paymentItemId) body.paymentItemId = paymentItemId;
        console.log(body);
        const result =  await this.call(api.post('/data/work/pay', body));
        return result;
    }

    async confirmPaymentIntent(paymentHistoryId) {
        return await this.call(api.get(`data/work/pay/confirm?id=${paymentHistoryId}`));
    }

    async call(func, customError = null) {
        try{
            const result = await func;
            if(customError){
                if(result.data.success){
                    return result.data.data;
                }else{
                    console.log("Message: ");
                    console.log(result.data.message);
                    throw new Error(customError);
                }
            }else{
                if(result?.data?.message) throw new Error(result?.data?.message);
            }

            return result.data.data;
        }catch(err){
            throw err;
        }
    }
}

export default new DataService();
