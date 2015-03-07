# hipchathooks
endpoints to use for hipchat webhooks
https://www.hipchat.com/docs/apiv2/method/create_webhook

For creating webhooks, see also:
https://github.com/charltoons/hipchatter#hipchattercreate_webhook

create an .env file with your api keys when running locally.

## To install in your hipchat room
> NOTE: you must be an admin of the room to proceed.

1. Log in to the hipchat website.
2. Go to http://hipchat.com/rooms
3. Click on the My Rooms tab
4. Click on the room to which you want to add the bot.
5. On the left panel, click the "Integrations" link.
6. Make sure the "Find New" tab is selected.
7. The first tile under the bitbucket banner should be "Build Your Own!" Click create.
8. Enter a name for your integration. This will be the bot's chatroom handle. Click create.
9. Scroll to the bottom of the page and check the box that says "Add a Command".
10. Where it says enter your slash command enter the slug for your bot. Ex: "/jif". This is what triggers the bot.
11. Where it says "We will POST to this URL"enter the api url and append your slug. Ex: https://hipchathooks.herokuapp.com/jif
12. Click "Save".
