<img width="25" src="{{ tweet.user.profile_image_url }}"/>
<a href="https://twitter.com/statuses/{{ tweet.id_str }}">{{ tweet.text }}</a>
<p>&mdash;{{ tweet.user.name }}<a href="https://twitter.com/intent/user?user_id={{ tweet.user.id_str }}">(@{{ tweet.user.screen_name }})</a></p>