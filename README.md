# hipchathooks [![Build Status](https://travis-ci.org/chrisdevwords/hipchathooks.svg?branch=master)](https://travis-ci.org/chrisdevwords/hipchathooks)
[Endpoints to use for hipchat webhooks and integrations](https://hipchathooks.herokuapp.com).

## Running locally
Each endpoint provides example POST data when viewed as a GET request. Use that data in [Chrome DHC](https://chrome.google.com/webstore/detail/dhc-resthttp-api-client/aejoelaoggembcahagimdiliamlcdmfm?hl=en) or [Postman](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en) or whatever you use for that kind of stuff.

You can run locally with node...
```
$ node index
```
But you won't have the required API keys. If running locally and using the [Heroku Toolbelt](https://toolbelt.heroku.com/), you should create an .env file with your api keys and run locally with:
```
$ foreman start dev
```

###Required Api vars (add these to a .env file)
````
IMGUR_ID="xxxxx"
YOU_TUBE_KEY="xxxx"
````

## To install in your hipchat room
> NOTE: you must be an admin of the room to proceed. See [here](https://hipchathooks.herokuapp.com) for a list of all available hooks.

1. Log in to the hipchat website.
2. Go to http://hipchat.com/rooms?t=mine
3. Click on the My Rooms tab
4. Click on the room to which you want to add the bot.
5. On the left panel, click the "Integrations" link.
6. Make sure the "Find New" tab is selected.
7. The first tile under the bitbucket banner should be "Build Your Own!" Click create.
8. Enter a name for your integration. This will be the bot's chatroom handle. Click create.
9. Scroll to the bottom of the page and check the box that says "Add a Command".
10. Where it says enter your slash command enter the slug for your bot. Ex: "/jif". This is what triggers the bot.
11. Where it says "We will POST to this URL"enter the api url and append your slug. Ex: https://hipchathooks.herokuapp.com/api/jif
12. Click "Save".

###Learn more
Read [How to create a HipChat webhook](https://www.hipchat.com/docs/apiv2/method/create_webhook). 
And [see also](https://github.com/charltoons/hipchatter#hipchattercreate_webhook).

