const core = require('@actions/core');
const github = require('@actions/github');
const AWS = require('aws-sdk')
const PDFGenerator = require('pdfkit')
const fs = require('fs');

const main = async () => {
    try {
        const email = core.getInput('email');
        const profile = core.getInput('profile');
        const region = core.getInput('region');
        // const email = 'ibukunolatunde1@gmai.com'
        // const profile = 'Production'
        // const region = 'eu-central-1'
        console.log(`Hello ${email} this is your ${profile}`);
        const time = (new Date()).toTimeString();
        core.setOutput("time", time);
        AWS.config.update({region: region});
        const support = new AWS.Support();
        let params = {
            language: 'en'
        }
        support.describeTrustedAdvisorChecks(params, (err, data) => {
            if(err) console.log(err, err.stack);
            else console.log(data);
            let output = new PDFGenerator
            output.pipe(fs.createWriteStream('trusted_advisor_checks.pdf'));
            output.text('Sample Text', { bold: true, underline: true, align: 'center' });
            // generateTable(output, data);
            output.end()
        })
        
    } catch (error) {
        console.error(error);
        core.setFailed(error.message);
    }
}

// const generateTable = (outputStream, data) => {
//     const tableTop = 270
//     const nameCodeX = 50
//     const descriptionX = 250
//     const categoryX = 350
//     const metadataX = 500

//     outputStream.fontSize(10)
//         .text('Name', nameCodeX, tableTop, {bold: true})
//         .text('Description', descriptionX, tableTop, {bold: true})
//         .text('Category', categoryX, tableTop, {bold: true})
//         .text('Metadata', metadataX, tableTop, {bold: true})
    
//     for(let i = 0; i < data.checks.length; i++){

//     }
    
// } 

main();