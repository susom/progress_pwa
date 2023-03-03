//Dexie is a wrapper library for indexDB
import Dexie from 'dexie';

export const db_audios = new Dexie('progress_audios');
db_audios.version(1).stores({
    files :  '++id, title, data'
});

export const db_sessions = new Dexie('progress_sessions');
db_sessions.version(4).stores({
    logs  : '++id, user_id, start_time, end_time, uploaded, redcap_record_id'
});


export const db_user = new Dexie('progress_user');
db_user.version(2).stores({
    user  : '++id, user_id, study_id, last_login, redcap_record_id'
});
