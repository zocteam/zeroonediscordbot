const clientToken = 'clientToken';
var rpc_host = "127.0.0.1";
var rpc_port = "10101";
var rpc_username = "rpc_username";
var rpc_pass = "rpc_pass";

function GetClientToken(){
    return clientToken;
}

function Getrpchost(){
    return rpc_host;
}

function Getrpcport(){
    return rpc_port;
}

function Getrpcusername(){
    return rpc_username;
}

function Getrpcpass(){
    return rpc_pass;
}

module.exports.GetClientToken = GetClientToken;
module.exports.Getrpchost = Getrpchost;
module.exports.Getrpcport = Getrpcport;
module.exports.Getrpcusername = Getrpcusername;
module.exports.Getrpcpass = Getrpcpass;