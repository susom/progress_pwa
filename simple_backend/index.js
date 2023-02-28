const express = require('express');
const FormData = require('form-data');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config({ path: '.env.yaml' })

const app = express();

var whitelist = ['http://localhost:3000'] //For local testing.
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

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
app.post('/analyze', async (req, res, next) => {
    try {
        const data = await sendGetRequest()
        res.status(200).send({ data });

    } catch (err) {
        next(err);
    }
});

app.post('/login', async (req, res, next) => {
    try{
        const {username, password} = req.body
        let recordData = buildPayload('id,study_id,alias,pw,hash', `[alias] = '${username}'`);
        let { data } = await axios({
            method: 'post',
            url: 'https://redcap.stanford.edu/api/',
            data: recordData,
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        if(data.length && data[0].pw === password){
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

async function sendGetRequest() {
    try {
        let record = {
            'id': '12',
            'device_id': 123456,
            'duration': 55,
            'last_login': new Date().toISOString(),
            'redcap_repeat_instance': 'new',
            'redcap_repeat_instrument': 'session_data'
        }

        record = JSON.stringify([record])
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


    } catch (err) {
        // Handle Error Here
        console.error(err);
        next(err);
    }
}

module.exports = {
    app
};