const core = require('@actions/core');
const github = require('@actions/github');
const AWS = require('aws-sdk')
const PDFGenerator = require('pdfkit')
const fs = require('fs');

const mainData = {
    "checks": [
        {
            "id": "zXCkfM1nI3",
            "name": "IAM Use",
            "description": "Checks for your use of AWS Identity and Access Management (IAM). You can use IAM to create users, groups, and roles in AWS, and you can use permissions to control access to AWS resources. \n<br>\n<br>\n<b>Alert Criteria</b><br>\nYellow: No IAM users have been created for this account.\n<br>\n<br>\n<b>Recommended Action</b><br>\nCreate one or more IAM users and groups in your account. You can then create additional users whose permissions are limited to perform specific tasks in your AWS environment. For more information, see <a href=\"https://docs.aws.amazon.com/IAM/latest/UserGuide/IAMGettingStarted.html\" target=\"_blank\">Getting Started</a>. \n<br><br>\n<b>Additional Resources</b><br>\n<a href=\"https://docs.aws.amazon.com/IAM/latest/UserGuide/IAM_Introduction.html\" target=\"_blank\">What Is IAM?</a>",
            "category": "security",
            "metadata": []
        }
    ]
}

const main = async () => {
    try {
        const email = core.getInput('email');
        const profile = core.getInput('profile');
        const region = core.getInput('region');
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
            generateTable(output, mainData);
            output.end()
        })
        
    } catch (error) {
        console.error(error);
        core.setFailed(error.message);
    }
}

const generatePDF = (data) => {
    const tableTop = 270
    const nameCodeX = 50
    const descriptionX = 100
    const categoryX = 350
    const metadataX = 500
    let output = new PDFGenerator
    output.pipe(fs.createWriteStream('trusted_advisor_checks.pdf'));
    output.text('Sample Text', { bold: true, underline: true, align: 'center' });
    output.fontSize(10)
        .text('Name', nameCodeX, tableTop, {bold: true})
        .text('Description', descriptionX, tableTop, {bold: true})
        .text('Category', categoryX, tableTop, {bold: true})
        .text('Metadata', metadataX, tableTop, {bold: true})
    
    for(let i = 0; i < data.checks.length; i++){
        const item = data.checks[i];
        console.log(item);
        const y = tableTop + 25 + (i * 25);

        output.fontSize(10)
            .text(item.name, nameCodeX, y)
            .text(item.description, descriptionX, y)
            .text(item.category, categoryX, y)
    }

    output.end()
    
} 



// main();

// generatePDF(mainData);

// console.log(mainData.checks[0].id)