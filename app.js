var config = require('yaml-config');
var settings = config.readConfig('./config/app.yaml');

var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var moment = require('moment');
var LdapAuth = require('ldapauth');
var cors = require('cors');
var rpc = require('./rpc.js');

app = express();
var jwtauth = require('./jwtauth.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors());

var options = {
    url: settings.url,
    searchBase: settings.searchBase,
    searchFilter: settings.searchFilter,
    adminDn: settings.admin.username,
    adminPassword: settings.admin.password,
}
var auth = new LdapAuth(options);

app.set('jwtTokenSecret', settings.secret);

app.post('/authenticate', function (req, res) {
    console.log(req.body.username);
    if(req.body.username && req.body.password) {
        auth.authenticate(req.body.username, req.body.password, function(err, user) {
            if(err) {
                console.log("error authenticating");
                console.log(err);
                res.status(401).send({ error: 'Wrong user or password (could be admin or credentials)'});
                return false;
            }
            if(user) {
                console.log("successfully authneticated");
                var expires = moment().add(7, 'days').valueOf();
                var token = jwt.encode({
                    exp: expires,
                    username: user.sAMAccountName,
                    groups: user.memberOf,
                    mail: user.mail
                }, app.get('jwtTokenSecret'));

                res.json({
                    token : token,
                    expires: expires,
                    user: {
                        'username': user.sAMAccountName,
                        'groups'  : user.memberOf
                    }
                });

                return user;
            }
        });
    } else {
        res.status(401).send({error: "No username or password supplied"});
    }
});

app.all('/api/*', [bodyParser(), jwtauth]);

app.get('/api/protected', function(req, res) {
    if(!req.user) {
        res.send({ error: "Invalid token"});
        return;
    }
    res.send(req.user);

});

app.set('port', 3002);
app.listen(3002, function() {
    console.log("Listening on port: " + app.get('port'));
});

