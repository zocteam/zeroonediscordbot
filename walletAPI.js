var bitcoin_rpc = require('node-bitcoin-rpc');
var config = require('./config.js');
var masternoodeCount;

function Setup() {
    bitcoin_rpc.BITCOIND_TIMEOUT = 1000;
    bitcoin_rpc.init(config.Getrpchost(), config.Getrpcport(), config.Getrpcusername(), config.Getrpcpass());
}
function Masternode() {
    return new Promise(function (resolve, reject) {
        // Do async job
        var number = walletAPI.GetMasternodeCount();
        resolve(number);
    })
}

function GetMasternodeCount() {

    return new Promise(function (resolve, reject) {
        // Do async job
        bitcoin_rpc.call('masternodelist', [], function (err, res) {

            var enabled = 0;
            if (err) {
                let errMsg = "Error when calling bitcoin RPC: " + err;
                console.log(errMsg);

            } else if (res.error) {
                let errMsg = "Error received by bitcoin RPC: " + res.error.message + " (" + res.error.code + ")";
                console.log(errMsg);
            } else {

                var keys = Object.keys(res.result);
                for (var i = 0; i < keys.length; i++) {
                    if(res.result[keys[i]] == "ENABLED"){
                        enabled++;
                    }   
                }
                masternoodeCount = enabled;
            }
            resolve(enabled);
        })
        console.log("Masternodes : " + masternoodeCount);
        return masternoodeCount;

    })
}

module.exports.Setup = Setup;
module.exports.GetMasternodeCount = GetMasternodeCount;