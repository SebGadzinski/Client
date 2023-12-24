import {api} from '../boot/axios';
import {Preferences} from '@capacitor/preferences';
import {Capacitor} from '@capacitor/core';
import {i18n} from '../boot/i18n';

class DataService {
    /**
     * Checks to see if there is a update available for the application
     * @returns {Object} //TODO
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
     * @returns //TODO
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
        try{
            let response = await api.get('/data/getHomePageData');
            if(response.data.success){
                return response.data.data;
            }else{
                console.log("Message: ");
                console.log(response.data.message);
                throw new Error(`Could not get categories`);
            }
        }catch(err){
            throw err;
        }
    }

    async getCategoryPageData(categorySlug) {
        try{
            let response = await api.post('/data/getCategoryPageData', {
                categorySlug
              });
            if(response.data.success){
                return response.data.data;
            }else{
                console.log("Message: ");
                console.log(response.data.message);
                throw new Error(`Could not get categories`);
            }
        }catch(err){
            throw err;
        }
    }

    async getServicePageData(categorySlug, serviceSlug) {
        try{
            let response = await api.post('/data/getServicePageData', {
                categorySlug, serviceSlug
              });
            if(response.data.success){
                return response.data.data;
            }else{
                console.log("Message: ");
                console.log(response.data.message);
                throw new Error(`Could not get service data`);
            }
        }catch(err){
            throw err;
        }
    }

    async getMeetingPageData(categorySlug, serviceSlug) {
        try{
            let response = await api.post('/data/getMeetingPageData', {
                categorySlug, serviceSlug, date: new Date()
              });
            if(response.data.success){
                return response.data.data;
            }else{
                console.log("Message: ");
                console.log(response.data.message);
                throw new Error(`Could not get meeting data`);
            }
        }catch(err){
            throw err;
        }
    }

    async findUnavailableDurations(date) {
        try{
            let response = await api.post('/data/meeting/findUnavailableDurations', {
                 date
              });
            if(response.data.success){
                return response.data.data;
            }else{
                console.log("Message: ");
                console.log(response.data.message);
                throw new Error(`Could not get meeting data`);
            }
        }catch(err){
            throw err;
        }
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
        try{
            let response = await api.get('/data/getWorkPageData');
            if(response.data.success){
                return response.data.data;
            }else{
                console.log("Message: ");
                console.log(response.data.message);
                throw new Error(`Could not get work data`);
            }
        }catch(err){
            throw err;
        }
    }

    async getWorkConfirmationPageData(workId) {
        try{
            const response = await api.post(`/data/getWorkConfirmationPageData`, {
                workId
              });
            if(response.data.success){
                return response.data.data;
            }else{
                console.log("Message: ");
                console.log(response.data.message);
                throw new Error(`Could not get work confirmation data`);
            }
        }catch(err){
            throw err;
        }
    }

    async getWorkCancelPageData(workId) {
        try{
            const response = await api.post(`/data/getWorkCancelPageData`, {
                workId
              });
            if(response.data.success){
                return response.data.data;
            }else{
                console.log("Message: ");
                console.log(response.data.message);
                throw new Error(`Could not get work cancel data`);
            }
        }catch(err){
            throw err;
        }
    }

    async confirmWork(workId) {
        try{
            return await api.post('/data/work/confirm', {
                workId
              });
        }catch(err){
            throw err;
        }
    }

    async cancelWork(workId) {
        try{
            return await api.post('/data/work/cancel', {
                workId
              });
        }catch(err){
            throw err;
        }
    }
}

export default new DataService();
