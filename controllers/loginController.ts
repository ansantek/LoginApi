/// <reference path="../typings/index.d.ts" />

import * as jwt from 'jsonwebtoken';
import * as express from 'express';

import * as Database from '../models/Database';
import * as encryptionService from '../services/encryptionService';
import * as config from '../services/config';
import {TokenProfile} from '../services/common';

var InvalidUserError:Error     ={name:'INVALIDUSER', message:'Invalid user'};
var InvalidPasswordError:Error ={name:'INVALIDPASSWORD', message:'Invalid password'};
var InvalidUserGroupError:Error={name:'INVALIDUSERGROUP', message:'Invalid user group'};
var MissingLoginParametersError={name:'MISSINGPARAMS', message:'Missing login parameters'}

export function authenticate(request:express.Request, response:express.Response) {
    var username = request.body.username;
    var password = request.body.password;

    if(!username || !password) return response.status(400).send(MissingLoginParametersError);

    Database.GetUser(username, function (err, result:Database.UserRec[]) {
        if (err) return response.status(500).send(err);

        //check if user exists
        if ((!result) || (result.length!=1)) return response.status(400).send(InvalidUserError);

        var userprofile:TokenProfile = {userid: result[0].idUsers, account: result[0].idAccounts};

        encryptionService.Compare(password, result[0].Password, function (err, valid) {
            if (err) return response.status(500).send(err);

            if (!valid) return response.status(400).send(InvalidPasswordError);
            else {
                var secret: string = config.getConfigObject().tokensecret;
                var Token = jwt.sign(userprofile, secret);
                return response.status(200).json({Token: Token});
            }
            })
        });
    }
