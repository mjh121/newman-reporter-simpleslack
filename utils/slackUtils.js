const prettyms = require('pretty-ms');
const axios = require('axios').default;
const jsonminify = require('jsonminify');

async function send(webhookurl, slackMessage) {
    const config= {
        method: 'post',
        url: webhookurl,
        headers: {
            'content-type': 'application/json'
        },
        data: slackMessage
    };

    axios.interceptors.response.use(
        () => {},
        error => {
            console.log(error);
        }
    );
    await axios(config)
    .then(() =>{})
    .catch((e) => { console.log(e) });
}

function makeSlackMessage(stats, timings, failures, title, channel) {
    const curDay = new Date().getDate();

    return jsonminify(`
    {
        "channel": "${channel}",
        "attachments": [
            {
                "color": "${failures.length > 0 ? "#FF4040" : "#AEDDEF" }",
                "blocks": [
                    {
                        "type": "header",
                        "text": {
                            "type": "plain_text",
                            "text": "${title}"
                        }
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "section",
                        "fields": [
                            {
                                "type": "mrkdwn",
                                "text": "iterations"
                            },
                            {
                                "type": "mrkdwn",
                                "text": "total : ${stats.iterations.total} / failed : ${stats.iterations.failed}"
                            },                            
                            {
                                "type": "mrkdwn",
                                "text": "requests"
                            },
                            {
                                "type": "mrkdwn",
                                "text": "total : ${stats.requests.total} / failed : ${stats.requests.failed}"
                            },
                            {
                                "type": "mrkdwn",
                                "text": "testScripts"
                            },
                            {
                                "type": "mrkdwn",
                                "text": "total : ${stats.testScripts.total} / failed : ${stats.testScripts.failed}"
                            },
                            {
                                "type": "mrkdwn",
                                "text": "prerequestScripts"
                            },
                            {
                                "type": "mrkdwn",
                                "text": "total : ${stats.prerequestScripts.total} / failed : ${stats.prerequestScripts.failed}"
                            },
                            {
                                "type": "mrkdwn",
                                "text": "assertions"
                            },
                            {
                                "type": "mrkdwn",
                                "text": "total : ${stats.assertions.total} / failed : ${stats.assertions.failed}"
                            }
                        ],
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "section",
                        "text": 
                        {
                            "type":"mrkdwn",
                            "text":"${failures.length > 0 ? ":x: Result: *FAIL*" : ":smile_cat: Result:  *PASS*"}  (total run duration : ${prettyms(timings.completed - timings.started)} :stopwatch:)"
                        }
                    }
                ]
            }
        ]
    }
    `);
}

exports.SlackUtils = { send, makeSlackMessage };