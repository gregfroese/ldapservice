var jwt = require('jwt-simple');
var config = require('yaml-config');
var settings = config.readConfig('./config/app.yaml');

var username = settings.rabbitmq.username;
var password = settings.rabbitmq.password;
var url = settings.rabbitmq.url;
var port = settings.rabbitmq.port;
var rpc = require('amqp-rpc').factory({
    url: "amqp://" + username + ":" + password + "@" + url + ":" + port
});

rpc.on('profile.confirmToken', function(params, callback) {
    var token = params.token;
    console.log("confirmToken is running");
    console.log(token);
    if(token) {
        try {
            var decoded = jwt.decode(token, app.get('jwtTokenSecret'));
            console.log("decoded successfully");

            if (decoded.exp <= Date.now()) {
               callback(false, {}, {error: "Token is expired"}); 
            }
            user = {
                username: decoded.username,
                mail: decoded.mail,
                groups: decoded.groups
            }
            console.log("calling the callback", true, user);
            callback(true, user, {});
        } catch (err) {
            console.log("error decoding");
            console.log(err);
            console.log("calling the callback", false, err);
            callback(false, {}, {error: err});
        }
    } else {
        console.log("calling the callback", false, "No token");
        callback(false, {}, {error: "No token resceived"});
    }
});
