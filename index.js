const core = require('@actions/core');
const github = require('@actions/github');
const AWS = require('aws-sdk')
const PDFGenerator = require('pdfkit')
const fs = require('fs');

const main = async () => {
    try {
        // const email = core.getInput('email');
        // const profile = core.getInput('profile');
        // const region = core.getInput('region');
        const email = 'ibukunolatunde1@gmai.com'
        const profile = 'Production'
        const region = 'us-east-1'
        console.log(`Hello ${email} this is your ${profile}`);
        const time = (new Date()).toTimeString();
        // core.setOutput("time", time);
        const support = new AWS.Support();
        let params = {
            language: 'en',
            region: `${region}`
        }
        support.describeTrustedAdvisorChecks(params, (err, data) => {
            if(err) console.log(err, err.stack);
            else console.log(data);
            let output = new PDFGenerator
            output.pipe(fs.createWriteStream('trusted_advisor_checks.pdf'));
            output.text('Sample Text', { bold: true, underline: true, align: center });
            output.text(data);
            output.end()
        })
        
    } catch (error) {
        console.error(error);
        // core.setFailed(error.message);
    }
}

main();