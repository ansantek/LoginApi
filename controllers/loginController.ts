/// <reference path="../typings/index.d.ts" />

import * as jwt from 'jsonwebtoken';
import * as express from 'express';

import * as Database from '../models/Database';
import * as encryptionService from '../services/encryptionService';
import * as config from '../services/config';
import {TokenProfile} from '../services/common';

var InvalidUserPasswordError:Error     ={name:'INVALIDUSERPASSWORD', message:'Invalid user/password'};
var MissingLoginParametersError={name:'MISSINGPARAMS', message:'Missing login parameters'}

export function authenticate(request:express.Request, response:express.Response) {
    var username = request.body.username;
    var password = request.body.password;

    //check for missing parameters
    if(!username || !password) return response.status(400).send(MissingLoginParametersError);

    //get user record from database
    Database.GetUser(username, function (err, result:Database.UserRec[]) {

        if (err) return response.status(500).send(err);

        //check if user exists
        if ((!result) || (result.length!=1)) return response.status(400).send(InvalidUserPasswordError);

        var userprofile:TokenProfile = {idusers: result[0].idUsers} as TokenProfile;

        //check if password matches
 //       encryptionService.Compare(password, result[0].Password, function (err, valid) {
//            if (err) return response.status(500).send(err);
            var valid:boolean= (password==result[0].password);
            if (!valid) return response.status(400).send(InvalidUserPasswordError);
            else {
                //compose token response
                var secret: string = config.getConfigObject().tokensecret;
                var Token = jwt.sign(userprofile, secret);
                return response.status(200).json({Token: Token});
            }
            })
    }
