const express = require('express');
const FormData = require('form-data');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config({ path: '.env.yaml' })

const app = express();

// var allowlist = ['http://localhost:3000', 'http://localhost:58174'] //For local testing.
// https://20230308t184818-dot-som-rit-relief-app.uw.r.appspot.com/
var allowlist = [/https:\/\/calmtool\.med\.stanford\.edu/, /.*som-rit-relief-app\.uw\.r\.appspot\.com.*/]
var corsOptions = {
    origin: function (origin, callback) {
        console.log('testing ... ', origin)
        const isMatch = allowlist.some(rx => rx.test(origin))
        console.log(isMatch)
        if(isMatch) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
        // if (allowlist.indexOf(origin) !== -1) {
        //     callback(null, true)
        // } else {
        //     callback(new Error('Not allowed by CORS'))
        // }
    }
}

app.options('*', cors(corsOptions))
app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
app.post('/sendUsageData', async (req, res, next) => {
    try {
        // const {start_time, end_time, user_id, redcap_record_id} = req.body
        // if (!start_time || !end_time || !user_id || !redcap_record_id)
        if(!req.body.length)
            return res.status(401).send('Required data not passed');
        const data = await sendPostRequest(req.body)
        res.status(200).send({ data });

    } catch (err) {
        next(err);
    }
});

async function sendPostRequest(body) {
    let full = []
    let record = {}
    for(let record in body){
        upload = {
            'id': body[record].redcap_record_id,
            'redcap_repeat_instance': 'new',
            'redcap_repeat_instrument': 'session_data',
            'start_time': body[record].start_time,
            'end_time': body[record].end_time,
            'duration': (new Date(body[record].end_time).getTime() - new Date(body[record].start_time).getTime()) / 1000
        }
        full.push(upload)
    }
        
    record = JSON.stringify(full)
    let bodyFormData = new FormData();
    bodyFormData.append('token', process.env.REDCAP_API_TOKEN);
    bodyFormData.append('content', 'record');
    bodyFormData.append('format', 'json');
    bodyFormData.append('type', 'flat');
    bodyFormData.append('data', record);

    const { data } = await axios({
        method: 'post',
        url: 'https://redcap.stanford.edu/api/',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })

    return data;
}

app.post('/login', async (req, res, next) => {
    try{
        const {username, password} = req.body
        if(!username || !password)
            return res.status(401).send('No data passed');

        let recordData = buildPayload('id,study_id,alias,pw,deactivate', `[alias] = '${username}'`);
        let { data } = await axios({
            method: 'post',
            url: 'https://redcap.stanford.edu/api/',
            data: recordData,
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        if(data.length && data[0].pw === password && data[0].deactivate___1 === '0'){
            delete data[0].pw; //Remove pass, not necessary to return to client after login
            res.status(200).send(data[0]);
        } else {
            res.status(403).send(`Unauthorized, supplied credentials are incorrect for user ${username}`)
        }
            
    } catch (err) {
        next(err)
    }
})

app.post('/verify', async (req, res, next) => {
    try {
        const {hash} = req.body
        
        if(!hash){
            res.status(400).send('Hash not supplied')
        } else {
            let recordData = buildPayload('id,study_id,alias,hash', `[hash] = '${hash}'`);
            let { data } = await axios({
                method: 'post',
                url: 'https://redcap.stanford.edu/api/',
                data: recordData,
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            if(data.length){
                res.status(200).send(data[0]);
            } else {
                res.status(400).send(`Hash ${hash} is invalid`)
            }
        }
    } catch (err) {
        next(err)
    }
})

function buildPayload(fieldString, filterString) {
    let recordData = new FormData();
    recordData.append('token', process.env.REDCAP_API_TOKEN);
    recordData.append('content', 'record');
    recordData.append('format', 'json');
    recordData.append('action', 'export');
    recordData.append('type', 'flat');
    recordData.append('fields', fieldString);
    recordData.append('filterLogic', filterString)
    return recordData;
}



module.exports = {
    app
};