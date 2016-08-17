/// <reference path="./typings/index.d.ts" />

//standard middleware
import * as express      from "express";
import * as logger       from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser   from "body-parser";

//application specific middleware

//application routes



var app = express();
var port = 3002;  //listening port

//set up configuration object before starting processing

//define middleware sequence
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());

//define routes

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
