# Lego workstream SlackBot


Track your workstream using slack and visualize it

Screenshots

###Installation:
- Create a slack app
    - Bot needs to have permissions for:
        - Interactive messages
        - Receive direct mentions
    
- Set environment variables
```
clientId=<your slack clientID>
clientSecret=<your slack clientSecret>
API_TOKEN=<your slack API TOKEN>
PORT=
MONGODB_URI= 
```
- yarn install
- yarn start
- Add the bot to your channel
    - Send a direct message to the bot
        - @yourbotname help
        - Adjust settings
      
### Metric
    - 

inspired by [lego-workstream-visualisation](https://code.joejag.com/2018/lego-workstream-visualisation.html)