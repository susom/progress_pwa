//Dexie is a wrapper library for indexDB
import Dexie from 'dexie';

export const db_audios = new Dexie('progress_audios');
db_audios.version(1).stores({
    files :  '++id, title, data'
});

export const db_sessions = new Dexie('progress_sessions');
db_sessions.version(1).stores({
    logs  : '++id, userid, timestamp, hash'
});
