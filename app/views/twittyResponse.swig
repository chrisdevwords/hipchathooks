<img width="25" src="{{ tweet.user.profile_image_url }}"/>
<a href="">{{ tweet.text }}</a>
{% for hash in tweet.entities.hastags %}
    {{ hash.text }}
{% endfor %}