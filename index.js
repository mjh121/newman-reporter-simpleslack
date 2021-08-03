const {SlackUtils} = require('./utils/slackUtils');

function SimpleSlackReporter(emitter, reporterOptions) {
    const webhookUrl = reporterOptions.webhookurl ||process.env.SLACK_WEBHOOK_URL;
    const channel = reporterOptions.channel || process.env.SLACK_CHANNEL;
    let imgLinkJson = reporterOptions.imglink || process.env.IMG_LINK || '';
    
    if(imgLinkJson) {
        imgLinkJson = (imgLinkJson[0] == '/') ? imgLinkJson : [process.env.PWD, imgLinkJson].join('/');
    }

    if(!webhookUrl) {
        console.log("please check slack webhook url");
        return;
    }
    
    if(!channel) {
        console.log("please check slack channel");
        return;
    }

    emitter.on('done', (error, summary) => {
        if (error) {
            console.error('error in done');
            return;
        }

        let run = summary.run;
        let collection = summary.collection;

        SlackUtils.send(webhookUrl, SlackUtils.makeSlackMessage(run.stats, run.timings, run.failures, collection.name,  channel, imgLinkJson));
    });
}

module.exports = SimpleSlackReporter;