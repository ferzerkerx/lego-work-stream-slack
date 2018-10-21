## Lego workstream SlackBot

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

http://<your-server>:<your-port>/metrics.html