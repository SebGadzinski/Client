import { DateTime } from 'luxon';

class DateService {
    convertISOLocal(dateISO) {
        const localDate = DateTime.fromISO(dateISO).toLocal();
        return localDate.toFormat('yyyy-LL-dd\'T\'HH:mm');
    }
    convertISOLocalDisplay(dateISO) {
        const localDate = DateTime.fromISO(dateISO).toLocal();
        return localDate.toFormat('yyyy-LL-dd HH:mm');
    }
}

export default new DateService();

