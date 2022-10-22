import core from '@actions/core'
import github from '@actions/github'
import { Support, STS } from 'aws-sdk'

const main = async () => {
    try {
        const email = core.getInput('email', { required: true });
        const profile = core.getInput('profile', { required: true });
        const region = core.getInput('region', { required: true });
        console.log(`Hello ${email} this is your ${profile}`);
        const time = (new Date()).toTimeString();
        core.setOutput("time", time);
        const support = new Support();
        let params = {
            language: 'en',
            region: `${region}`
        }
        support.describeTrustedAdvisorChecks(params, (err, data) => {
            if(err) console.log(err, err.stack);
            else console.log(data);
        })
    } catch (error) {
        console.error(error);
        core.setFailed(error.message);
    }
}

main();