const {SlackUtils} = require('./utils/slackUtils');

const validationCheck = (webhookUrl) => {
    if(!webhookUrl) {
        console.error("please check slack webhook url");
        return;
    }
}

function SimpleSlackReporter(emitter, reporterOptions) {
    const webhookUrl = reporterOptions.webhookurl || process.env.SLACK_WEBHOOK_URL;
    const channel = reporterOptions.channel || process.env.SLACK_CHANNEL || '';
    let imgLinkJson = reporterOptions.imglink || process.env.IMG_LINK || '';
    
    validationCheck(webhookUrl);

    if(imgLinkJson) {
        imgLinkJson = (imgLinkJson[0] == '/') ? imgLinkJson : [process.env.PWD, imgLinkJson].join('/');
    }

    emitter.on('done', (error, summary) => {
        if (error) {
            console.error('error in done');
            return;
        }

        const run = summary.run;
        const collection = summary.collection;

        SlackUtils.send(webhookUrl, SlackUtils.makeSlackMessage(run, collection.name,  channel, imgLinkJson));
    });
}

module.exports = SimpleSlackReporter;