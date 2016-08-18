/// <reference path="../typings/index.d.ts" />

import * as mysql from 'mysql';

interface callbackFunction {
    (err, results);
}

function isUndefined(x){return typeof(x) == "undefined"};

export var pool=mysql.createPool({
    host: 'localhost',
    user: 'Larry',
    password: 'nalanala',
    database: 'freshair',
    connectionLimit: 10
});

export interface UserRec {
    idUsers: number;
    UserName: string;
    Password: string;  //encrypted
    idAccounts : number;
    idUserGroups : number;
}

export function GetUser(username:string, callback:callbackFunction){
    pool.getConnection(function(err,connection){
        if (err) {console.log('connection error:'+err); callback(err, null); return};
        var Query='SELECT * FROM Users WHERE UserName='+ connection.escape(username);
        connection.query(Query,
            function(err, results:UserRec[]){
                connection.release();
                if (err) return callback(err,null);
                callback(null, results);
            })
    })
}

export function GetUsersByAccountDisplay(page:number, account:number, callback:callbackFunction){
    pool.getConnection(function(err, connection){
        if(err){console.log('connection error:'+err); callback(err,null); return}
        var qq:string='SELECT Users.idUsers as UserNo, Users.UserName as UserName, ' +
            'UserGroups.UserGroupName as UserGroup FROM Users JOIN UserGroups ON ' +
            'Users.idUserGroups=UserGroups.idUserGroups WHERE Users.idAccounts=' + account;
        connection.query(qq,function(err, results){
            connection.release();
            if(err){callback(err,null); return};
            callback(null, results);
        })
    })
}

export interface userGroupRec {
    idUserGroups: number;
    UserGroupName: string;
}

export function GetUserGroup(idUserGroups:number, callback:callbackFunction){
    pool.getConnection(function(err,connection){
        if (err) {console.log('connection error: + err'); callback(err,null); return};
        connection.query('SELECT * FROM UserGroups WHERE idUserGroups =' + idUserGroups,
            function(err, results: userGroupRec[]){
                connection.release();
                if (err) return callback(err,null);
                callback(null, results);
        });
    })
}

export function GetUserGroupByName(usergroup:string,callback:callbackFunction){
    pool.getConnection(function(err,connection){
        if (err) {console.log('connection error: + err'); callback(err,null); return};
        connection.query('SELECT * FROM UserGroups WHERE UserGroupName='+connection.escape(usergroup),
            function(err, results){
                connection.release();
                if (err) return callback(err,null);
                callback(null, results);
            })
    })
}

export interface accountsRec {
    idAccounts : number;
    AccountName: string;
    idOrganization : number;
}

export function GetAccount(account:number, callback:callbackFunction){
    pool.getConnection(function(err,connection) {
        if (err) {console.log('connection error: + err'); callback(err, null); return };
        connection.query('SELECT * FROM Accounts WHERE idAccounts=' + account,
            function (err, results) {
                connection.release();
                if (err) return callback(err, null);
                callback(null, results);
            })
    })
}

export interface deviceRec {
    idDevices : number;
    idAccounts : number;
    ID : string;
    Name : string;
    Bluetooth : string;
    Location : string;
    EncryptKey: string;
    InstallationStatus : string;
    FirmwareVersion : string;
    HardwareVersion : string;
    InstallationTimestamp : string;
    LastConnection : string;
    Logging : boolean;
}

export function GetDevice(ID : string, callback:callbackFunction) {
    pool.getConnection(function(err, connection){
        if (err) {console.log('connection error:'+err); callback(err,null); return};

        var xx:string='SELECT * FROM Devices WHERE ID='+ connection.escape(ID);
        connection.query(xx, function(err, results: deviceRec[]){
            connection.release();
            if (err) {callback(err,null); return};
                callback(null, results);
        })
    })
}

export function CreateDevice(ID: string, Name:string, Account:number, Firmware:string, Hardware:string,
                             Bluetooth:string, Location:string, callback:callbackFunction){
    var timestamp : string = new Date(Date.now()).toISOString();

    pool.getConnection(function(err, connection){
        if (err) {console.log('connection error:'+err); callback(err,null); return};

        var qq:string='INSERT INTO Devices (ID, Name, idAccounts, FirmwareVersion, HardwareVersion, Bluetooth, Location, ' +
            'EncryptKey, InstallationStatus, InstallationTimestamp, ' +
            'LastConnection, Logging) VALUES('+connection.escape(ID)+','+connection.escape(Name)+','+Account+','+
            connection.escape(Firmware)+','+connection.escape(Hardware)+','+connection.escape(Bluetooth)+
            ','+connection.escape(Location)+','+connection.escape("")+','+'"INSTALLING"'+','+
            connection.escape(timestamp)+','+connection.escape(timestamp)+','+'true'+')';
        connection.query(qq, function(err, results){
            connection.release();
            if (err) {callback(err,null); return};
            callback(null, results);
        });
    });
}

export function DeleteDevice(ID: string, callback:callbackFunction){
    pool.getConnection(function(err, connection){
        if (err) {console.log('connection error:'+err); callback(err,null); return};
        connection.query('DELETE FROM Devices WHERE ID='+connection.escape(ID), function(err, results){
            connection.release();
            if (err) {callback(err,null); return};
            callback(null, results);
        });
    });
}

export function UpdateDeviceInstallStatus(ID: string, newStatus: string, callback:callbackFunction){
    pool.getConnection(function(err, connection){
        if (err) {console.log('connection error:'+err); callback(err,null); return};
        var qq:string ='UPDATE Devices SET InstallationStatus='+connection.escape(newStatus) +
            ' WHERE ID='+connection.escape(ID);
        connection.query(qq, function(err, results){
            connection.release();
            if (err) {callback(err,null); return};
            callback(null, results);
        });
    });
}

export function UpdateDeviceKey(ID:string, Key:string, callback:callbackFunction){
    pool.getConnection(function(err, connection) {
        if (err) {console.log('connection error:' + err); callback(err, null); return};
        connection.query('UPDATE Devices SET EncryptKey='+connection.escape(Key)+' WHERE ID='+
        connection.escape(ID), function(err, results){
            connection.release();
            if (err) {callback(err,null); return};
            callback(null, results);
        });
    });
}

export function UpdateDevice(device:deviceRec, callback:callbackFunction){
    console.log('UpdateDevice');
    console.log(device);
    pool.getConnection(function(err, connection){
        if (err) {console.log('connection error:' + err); callback(err, null); return};
        var Qry='UPDATE Devices SET idAccounts='+device.idAccounts+
                ', Name='+connection.escape(device.Name)+
                ', Location='+connection.escape(device.Location)+
                ', FirmwareVersion='+connection.escape(device.FirmwareVersion)+
                ', ID='+connection.escape(device.ID)+
                ', Bluetooth='+connection.escape(device.Bluetooth)+
                ', HardwareVersion='+connection.escape(device.HardwareVersion)+
                ', Logging='+device.Logging+
                ' WHERE idDevices='+device.idDevices;

        connection.query(Qry, function(err, results){
            connection.release();
            if (err) {callback(err,null); return};
            callback(null, results);
        })
    })
}

export interface dataRec {
    ID:string;
    Name:string;
    idDeviceData : number;
    idDevices : number;
    TimeStamp: string;
    Data1 : number;
    Data2 : number;
}

export function GetDataDisplay(Account:number, UserId:number, DeviceID:string, StartTime:string, StopTime:string ,
                               callback:callbackFunction){
    var DataQuery = 'SELECT Devices.ID as ID, Devices.Name as Name, DeviceData.idDeviceData, DeviceData.TS as TimeStamp,' +
        ' DeviceData.D1 as Data1, DeviceData.D2 as Data2 FROM DeviceData JOIN Devices ON DeviceData.idDevices=Devices.idDevices'+
        ' WHERE 1=1';
    if (!isUndefined(Account)){DataQuery=DataQuery+' AND Devices.idAccounts='+Account};
    if (!isUndefined(DeviceID)){DataQuery=DataQuery+' AND Devices.ID="'+DeviceID+'"'};
    if (!isUndefined(StartTime)){DataQuery=DataQuery+' AND DeviceData.TS>="'+StartTime+'"'};
    if (!isUndefined(StopTime)){DataQuery=DataQuery+' AND DeviceData.TS<="'+StopTime+'"'};
//TODO Add check for device in device group assigned to user

    pool.getConnection(function(err, connection){
        if (err){console.log('connection error:'+err); callback(err,null); return};
        connection.query(DataQuery, function(err, results){
            connection.release();
            if(err){callback(err,null); return};
            callback(null, results);
        })
    })
}

export interface eventRec {
    idDeviceEvents : number;
    idDevices : number;
    TimeStamp : string;
    EventType : number;
    EventData : string;
}

export function GetEventDisplay(Account:number, UserId:number, DeviceID:string, StartTime:string, StopTime:string ,
                                callback:callbackFunction){
    var EventQuery = 'SELECT Devices.ID as ID, Devices.Name as Name, DeviceEvents.idDeviceEvents, DeviceEvents.TS as TimeStamp,' +
        ' DeviceEvents.ET as EventType, DeviceEvents.ED as EventData FROM DeviceEvents '+
        'JOIN Devices ON DeviceEvents.idDevices=Devices.idDevices WHERE 1=1';
    if (!isUndefined(Account)){EventQuery=EventQuery+' AND Devices.idAccounts='+Account};
    if (!isUndefined(DeviceID)){EventQuery=EventQuery+' AND Devices.ID="'+DeviceID+'"'};
    if (!isUndefined(StartTime)){EventQuery=EventQuery+' AND DeviceEvents.TS>="'+StartTime+'"'};
    if (!isUndefined(StopTime)){EventQuery=EventQuery+' AND DeviceEvents.TS<="'+StopTime+'"'};
//TODO Add check for device in device group assigned to user
    pool.getConnection(function(err, connection){
        if (err){console.log('connection error:'+err); callback(err,null); return};
        connection.query(EventQuery, function(err, results){
            connection.release();
            if(err){callback(err,null); return};
            callback(null, results);
        })
    })

}

export interface deviceDisplayRec {
    ID : string;
    Name : string;
    Location : string;
}

export function GetDeviceDisplay(account:number, callback:callbackFunction){
    var DataQuery = 'SELECT Devices.ID as ID, Devices.Name as Name, Devices.Location as Location, ' +
        'Accounts.AccountName as AccountName FROM Devices JOIN Accounts ON Devices.idAccounts=Accounts.idAccounts';
    var OrderBy = ' ORDER BY Accounts.AccountName, Devices.ID LIMIT 20';
    pool.getConnection(function(err, connection){
        if (err){console.log('connection error:'+err); callback(err,null); return};
        if (typeof account!=='undefined'){
            DataQuery=DataQuery+' WHERE Devices.idAccounts='+ account;
        };
        DataQuery=DataQuery+OrderBy;

        connection.query(DataQuery, function(err, results){
            connection.release();
            if(err){callback(err,null); return};
            callback(null, results);
        })
    })
}
export function CreateUser(username: string, password:string, account: number, usergroup: number, callback: callbackFunction){
    pool.getConnection(function(err, connection){
        if(err){console.log('connection error:'+err); callback(err,null); return}
        connection.query('INSERT INTO Users (UserName, Password, idAccounts, idUserGroups) '+
        'VALUES ('+ connection.escape(username) +','+ connection.escape(password) +','+ account +','+
        usergroup +')', function(err, results){
            if (err) {callback(err,null); return}
            callback(null, results);
        })

    })
}

export function GetAccountDisplay(page:number, callback:callbackFunction){
    var qq:string='SELECT Accounts.AccountName as AccountName, Organizations.Name as OrgName,' +
        'Accounts.idAccounts as AccountNo FROM Accounts JOIN Organizations ON Accounts.idOrganization' +
        '=Organizations.idOrganizations ORDER BY Organizations.Name, Accounts.AccountName';
    pool.getConnection(function(err, connection){
        if(err){console.log('connection error:'+err); callback(err,null); return}
        connection.query(qq,function(err, results){
            connection.release();
            if(err){callback(err,null); return};
            callback(null, results);
        })
    })
}

export function GetFirmwareNames(callback:callbackFunction){
    var qq:string='SELECT Name FROM Firmware';
    pool.getConnection(function(err, connection){
        if(err){console.log('connection error:'+err); callback(err,null); return}
        connection.query(qq,function(err, results){
            connection.release();
            if(err){callback(err,null); return};
            callback(null, results);
        })
    })
}

export function GetTaskID(TaskName:string, callback:callbackFunction){
    pool.getConnection(function(err,connection){
        if(err){console.log('connection error:'+err); callback(err,null); return};
        connection.query('SELECT idTaskTypes FROM TaskTypes WHERE TaskTypeName='
        +connection.escape(TaskName), function(err,results){
            connection.release();
            if(err){callback(err,null); return};
            callback(null, results);
        })
    })
}

export function AddTask(idTaskType:number, idDevices:number, TaskData:string,
                        callback:callbackFunction){
    pool.getConnection(function(err,connection) {
        if (err) {console.log('connection error:' + err); callback(err, null); return};
        connection.query('INSERT INTO DeviceTasks (idDevices, idTaskType, TaskData)'+
        ' VALUES ('+idDevices+','+idTaskType+','+connection.escape(TaskData)+')',
        function(err, results){
            connection.release();
            if(err){callback(err,null); return};
            callback(null, results);
        })
    });
}