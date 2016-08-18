/// <reference path="../typings/index.d.ts" />

import * as bcrypt from 'bcrypt';

export function Encrypt(value, cb) {
    bcrypt.genSalt(6, function (err, salt) {
        bcrypt.hash(value, salt, function (err, hash) {
            if (err) {cb(err); return;}
                else {cb(null, hash); return};
            });
        });
    };

export function Compare(value, hash, cb) {
        bcrypt.compare(value,hash, function(err,result){
            if (err){cb(err);return}
            cb(null, result);return;
        });
    }

