/// <reference path="./typings/index.d.ts" />

//standard middleware
import * as express      from "express";
import * as logger       from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser   from "body-parser";

//application controllers
import {authenticate} from './controllers/loginController';

var app = express();
var port = 3002;  //listening port

//define middleware sequence
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());

//define routes
app.post('/sys/login',authenticate);

//handle errors
app.use(function(err,req:express.Request,res:express.Response,next){
    console.log(err);
    res.status( 400).send(err);
});

if (!module.parent) {
    app.listen(port, function () {
        console.log("Express server listening on port %d",port);
    });

};

export = app;
