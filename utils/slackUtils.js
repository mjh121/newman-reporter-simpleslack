const prettyms = require('pretty-ms');
const axios = require('axios').default;
const jsonminify = require('jsonminify');

const {ImgUtils} = require('./imgUtils');

// Slack message Layouts
const dividerLayout = initStr = `{ "type": "divider" }`;

const send = async (webhookurl, slackMessage) => {
    const config= {
        method: 'post',
        url: webhookurl,
        headers: {
            'content-type': 'application/json'
        },
        data: slackMessage
    };

    await axios(config)
    .then((res) => console.debug(res))
    .catch((e) => console.error(e));
}

const makeSlackMessage = (run, title, channel, imgLink) => {
    const stats = run.stats;
    const timings = run.timings;
    const failures = run.failures;

    const parsedFailures = parseFailures(failures);
    const failuresMessage = makeFailureDetail(title, parsedFailures);
    let accessory = makeAccessory(imgLink, failures.length);

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
                    ${dividerLayout},
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
                        ${accessory}
                    },
                    ${dividerLayout},
                    {
                        "type": "section",
                        "text": 
                        {
                            "type":"mrkdwn",
                            "text":"${failures.length > 0 ? ":x: Result: *FAIL*" : ":smile_cat: Result:  *PASS*"}  (total run duration : ${prettyms(timings.completed - timings.started)} :stopwatch:)"
                        }
                    },
                    ${failures.length > 0 ? failuresMessage : '' }
                ]
            }
        ]
    }
    `);
}

const parseFailures = (failures) => {
    const descPrefix = "\t• ";

    return failures.reduce((acc, cur) => {
        if(cur.error.name !== 'AssertionError') {
            return acc;
        }
        itemPath = [cur.parent.name, cur.source.name].join('/');

        if((acc.length == 0) || (acc[acc.length-1].name != itemPath)) {
            acc.push({
                name: itemPath,
                desc: descPrefix+cur.error.test
            });
        } else if(acc[acc.length-1].name == itemPath) {
            acc[acc.length-1].desc = [acc[acc.length-1].desc, descPrefix+cur.error.test].join('\\n');
        }

        return acc;
    }, []);
}

const makeFailureDetail = (title, parsedFailures) => {
    initStr = `{
        "type":"section",
        "text": {
            "type": "mrkdwn",
            "text": " :fire: *${title} Detail*"
        }
    }`;

    initStr = [initStr, dividerLayout].join(',');

    return parsedFailures.reduce((acc, cur, i) => {
        const failureText =  "*`"+(i+1) + "." + cur.name+"`*\\n" + cur.desc;
        const failure = `
        {
            "type":"section",
            "text": {
                "type": "mrkdwn",
                "text": "${failureText}"
            }
        }`;

        return [acc, failure].join(',');
    }, initStr);
}

const makeAccessory = (imgLink, len) => {
    if(!imgLink) {
        return '';
    }

    const imgUtils = new ImgUtils(imgLink);
    const curDay = new Date().getDate();
    const dayImgLink = len > 0 ? imgUtils.getImgLink("fail", curDay) : imgUtils.getImgLink("pass", curDay);

    return `
    "accessory": {
        "type": "image",
        "image_url": "${dayImgLink}",
                      
        "alt_text": "daily calendar"
    }
    `;
}

exports.SlackUtils = { send, makeSlackMessage };