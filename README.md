Alexa Skill Kit that generates rap verses based on a topic you give it.

If you make changes and have access to the lambda function follow these steps to upload the latest version:

* run `npm install`
* zip `nodule_modules` and `index.js` together into one folder.
* Edit Lambda function on AWS and upload new zip folder.

High level diagram of logic: http://www.gliffy.com/go/publish/9718515

*Ensure you have the config.keys.json file (file is in hipchat) in the root of the project to be able to run service requests.*