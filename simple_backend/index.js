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