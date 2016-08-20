/// <reference path="../typings/index.d.ts" />

import * as mysql from 'mysql';
import {configType, getConfigObject} from '../services/config';

interface callbackFunction {
    (err, results);
}

function isUndefined(x){return typeof(x) == "undefined"};

var config:configType = getConfigObject();


export interface UserRec {
    idUsers: number;
    UserName: string;
    password: string;  //encrypted
    idAccounts : number;
    idUserGroups : number;
}

var pool:mysql.IPool;

export function GetUser(username:string, callback:callbackFunction){
    //if connection pool does not exist, create it
    if (!pool) {
        pool=mysql.createPool({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            connectionLimit: 10
        })};

    //run query on database
    pool.getConnection(function(err,connection){
        if (err) {console.log('connection error:'+err); callback(err, null); return};
        var Query='SELECT * FROM users WHERE userid='+ connection.escape(username);
        console.log('query', Query);
        connection.query(Query,
            function(err, results:UserRec[]){
                connection.release();
                if (err) return callback(err,null);
                callback(null, results);
            })
    })
}

