<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Hip Chat Integration Endpoints</title>
    <meta name="description" content="Endpoints for Custom Hipchat Integrations.">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="//maxcdn.bootstrapcdn.com/bootswatch/3.3.2/cyborg/bootstrap.min.css" rel="stylesheet"></head>
<body>
    <div class="site-wrapper">
        <h1>Oh hey.</h1>
        <p>Here are some HipChat Integrations. <a href="https://github.com/chrisdevwords/hipchathooks" target="_blank">Fork 'em!</a></p>
        <table class="table table-striped table-hover ">
            <thead>
            <tr>
                <th>Slash Command</th>
                <th>POST Endpoint</th>
                <th>Bot Name</th>
                <th>What it does?</th>
            </tr>
            </thead>
            <tbody>
            {% for hook in hooks %}
                <tr>
                    <td>{{ hook.slug }}</td>
                    <td><a href="{{ hook.endpoint }}" target="_blank">{{ hook.endpoint }}</a></td>
                    <td>{{ hook.name }}</td>
                    <td>{{ hook.description }}</td>
                </tr>
            {% endfor %}
            </tbody>
        </table>
    </div>
    <p>Theme: <a href="https://bootswatch.com/cyborg/">Cyborg</a>.</p>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script type="text/javascript" src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
</body>
</html>