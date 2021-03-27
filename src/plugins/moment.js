import moment from 'moment';

moment.locale('es');
moment.updateLocale('es', {
    week: {
        dow: 1
    }
})

export default moment;