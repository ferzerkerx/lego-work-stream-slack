## Lego Workstream SlackBot 

[![Build Status](https://travis-ci.org/ferzerkerx/lego-work-stream-slack.svg?branch=master)](https://travis-ci.org/ferzerkerx/lego-work-stream-slack)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=lego-work-stream-slack&metric=alert_status)](https://sonarcloud.io/dashboard?id=lego-work-stream-slack)


Track your workstream using slack and visualize it 
>inspired by [lego-workstream-visualisation](https://code.joejag.com/2018/lego-workstream-visualisation.html)


### Screenshots
![alt tag](https://raw.githubusercontent.com/ferzerkerx/lego-work-stream-slack/master/screenshots/lego3.png)

![alt tag](https://raw.githubusercontent.com/ferzerkerx/lego-work-stream-slack/master/screenshots/lego1.png)

![alt tag](https://raw.githubusercontent.com/ferzerkerx/lego-work-stream-slack/master/screenshots/lego2.png)

### Installation:
- Create a slack app
    - Bot needs to have permissions for:
        - Interactive messages
        - Receive direct mentions
    
- Set environment variables
```
clientId=<your slack clientID>
clientSecret=<your slack clientSecret>
API_TOKEN=<your slack API TOKEN>
PORT=<your desired port>
MONGODB_URI=<your MONGODB_URI>
```
- yarn install
- yarn start
- Add the bot to your channel
    - Send a direct message to the bot
        - @yourbotname help
        - Adjust settings
      
### Metrics
- Search metrics
- Download CSV report

```http://<your-server>:<your-port>/metrics.html```


##### To update the configuration:
```
@testbot setConfig{
  "actionDescriptors": [
    { "name": "green", "text": "Green" },
    { "name": "red", "text": "Red" },
    { "name": "orange", "text": "Orange" },
    { "name": "black", "text":"Black" }
  ],
  "min": 0,
  "max": 8}

```
