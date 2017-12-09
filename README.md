# difmskill
Unofficial DI.FM-Skill for Alexa / Amazon Voice Services

This current version is provided as a proof-of-concept and hardcoded to the author's favourites. I do not guarantee it to be useful.
Also note that the current "documentation" was written on short notice, so mainly use it as a guideline.
Plus: I hope that this project will be obsolete, soon and DI provides an official skill.

What you need:
* Alexa device

Although Alexa works on Fire TVs, Smartphones, Amazon tablets, Simulators etc., you most surely want to use this skill on a real Echo, Echo Dot, Echo Show, etc.

* Amazon Account

This seems required to use Alexa.

* Amazon Developers Account

https://developer.amazon.com
This is needed to create the Alexa-specific parts of your skill. By having a custom skill in your developer profile, you can access it from your Alexa devices. 
From what I remember, this account is free.

* Amazon Web Services Account

https://aws.amazon.com
This is one of the easiest ways to get a https-endpoint for your skill (called "Lambda" and used in this project) and one of the easier ways to get the music steam URI onto https.
The Account itself is free but you may have to pay for cloud services, so (at the time of writing) you have to provide  valid credit card information.
At the time of writing, Lambda (Web function) calls only get charged once you do more than a million in a single month. I consider them free.
S3 storage (for the music stream URI) has a very large "free" part for the first year.

* Digitally Imported Premium Account

You need to get a stream URI; those are only given out to Premium Users. 

* Digitally Imported Stream URI on https that can be accessed from your Alexa device

When you ask the Echo to start a stream, the final result is a Stream URI being sent from AVS to your Echo (from the Cloud). It then needs to be able to access this Stream URI and for security reasons, this URI has to be on https (valid certificate and everything). 
You can get such a stream URI from Digitally Imported if you are a Premium Member; This option is under "Player Settings" and "Hardware Player Settings". I was successfull with quality "Excellent (128k AAC)" but other quality options might work, too (according to Amazon documentation).
At the time of writing, Digitally Imported Stream URIs are given on http only. You can work around this by putting the URI into a playlist file and hosting this playlist file on https.
If you have your own webspace with certificate, you can host it there.
You can also put this playlist file onto S3 storage and create a https-URI for your Alexa.
Also, Github allows to access files in raw format via https - although they may be a bit too public there. After all: You paid for Premium and you should be the only one using the Streams URIs linked to your Premium account.


HowTo:

1. Skill in Amazon Developers

Create a new skill in your Amazon Developers Account (Try some of the official Tutorials to get the hang of it).
This skill uses Audio Player directives (that's kind of the point).
You can find a sample interaction model under ./SpeechAssets in JSON-forme. You may want to adjust this to your language and your favourite channels.
You haven't created the endpoint (ARN), yet. So pause there and do the next step in AWS Account.

2. Lambda in AWS Account

Create a Lambda, using Node.js. 
The source code can be copied from ./src/index.js. You may want to adjust some language strings and also the available channels.
There are some variables "process.env.*" (e.g. "process.env.streamUri") in the source. Configure an environment variable for each of them. Use the https stream URIs as values.
Add Alexa Skills kit to the the Triggers.

Once the Lambda is saved and works without errors, you can copy the ARN from the AWS into the endpoint on your Amazon Developer Console.

3. Debugging

You can test the skill from Amazon Dev Console by entering an utterance and checking the returned JSON. If there is a section "directives" with your stream URI in it, that's a good sign.
The JSON in the "service request" is what is sent to the lambda, so you can copy this and use it as testcase in the Lambda.

I've personally had a major bughunting-session with a stream not playing from my Echo although the same S3 URI worked from other players. This problem went away when I accessed the Metadata (under Properties) and corrected the "Content-Type" to "audio/x-mpegurl". It seems like Alexa Audio Players are a bit sensitive to that.

4. Real Listening

Once it tests successfully from the Amazon Dev Console, the skill should be ready to run from your Alexa device, so say out loud "Alexa, start Digitally Imported and play <favouriteChannel/>" (or whatever you set your utterances to) and hope the music plays.
You don't need to publish the skill for this to work. In fact, do not publish this skill! It is only meant for personal use.

