import { DateTime } from 'luxon';

export function formatDateToObject(dateValue) {
	let dateTime;

	if (typeof dateValue === 'string') {
		dateTime = DateTime.fromSQL(dateValue, { zone: 'Asia/Manila' });
	} else {
		dateTime = DateTime.fromJSDate(dateValue, { zone: 'Asia/Manila' });
	}

	return {
		weekday: dateTime.toFormat('cccc'),        
		date: dateTime.toFormat('LLLL dd, yyyy'),   
		time: dateTime.toFormat('hh:mm:ss a')       
	};
}