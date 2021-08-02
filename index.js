const {SlackUtils} = require('./utils/slackUtils');

function SimpleSlackReporter(emitter, reporterOptions) {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL || reporterOptions.webhookurl;
    const channel = process.env.SLACK_CHANNEL || reporterOptions.channel || '';
    
    if(!webhookUrl) {
        console.log("please check slack webhook url");
        return;
    }
    
    if(!channel) {
        console.log("please check slack channel");
        return;
    }
``
    emitter.on('done', (error, summary) => {
        if (error) {
            console.error('error in done');
            return;
        }

        let run = summary.run;
        let collection = summary.collection;

        SlackUtils.send(webhookUrl, SlackUtils.makeSlackMessage(run.stats, run.timings, run.failures, collection.name,  channel));
    });
}

module.exports = SimpleSlackReporter;