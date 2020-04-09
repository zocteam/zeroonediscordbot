var request = require("request");
var Data = ['', '', '', '', '', '', '', '', '', '', '', '']; // This is kinda confusing? >~<
var walletAPI = require('./walletAPI.js');
const database = require('./database.js');

//Simple Http Request
function requestData(id, url) {
    // Setting URL and headers for request
    var options = {
        url: url,
        headers: {
            'User-Agent': 'request',
            'rejectUnauthorized': 'false'
        }
    };
    // Return new promise
    return new Promise(function (resolve, reject) {
        // Do async job
        request.get(options, function (err, resp, body) {
            if (err) {
                reject(err);
            } else {
                Data[id] = body;
                resolve(body);
            }
        })

    })
}

//Loads the database
function Setup(){
  //  database.Load();
}

//Gets the block count
function GetBlockCount(message){
    var BlockdataPromise = requestData(0, "https://explorer.01coin.io/api/getblockcount");
        BlockdataPromise.then(function (result) {
            message.channel.send('**```fix\nThe current block count is: ' + Data[0]+ '```**');
        });
}

//Get the balance of the accounts from the sites apis
function GetFund(message){
    //setups the requests
    var BTCdataPromise = requestData(1, "https://blockexplorer.com/api/addr/33aoJAthELcSGsYZJXxV8PAHVYiDECPuJR/balance");
    var ZOCdataPromise = requestData(2, "https://explorer.01coin.io/ext/getbalance/5AchYc7iQS7ynce7hNZ6Ya8djsbm5N9JBS");
    var ETHdataPromise = requestData(5, "http://api.ethplorer.io/getAddressInfo/0x1189d2c383A6533196b1A63e6FFcA69Edefce9ee?apiKey=freekey");

    //process the requests
    Promise.all([BTCdataPromise, ZOCdataPromise,ETHdataPromise]).then(function (result) {
        //passes the json data to be usable
        Data[5] = JSON.parse(Data[5]);
        ///sends the message then the request is done
        message.channel.send('**```fix\nThe current donation wallet balances are: \n' + Number((Data[1] / 100000000)).toFixed(8) + ' BTC (donate to 33aoJAthELcSGsYZJXxV8PAHVYiDECPuJR)\n' + Number(Data[2]).toFixed(8) + ' ZOC (donate to 5AchYc7iQS7ynce7hNZ6Ya8djsbm5N9JBS)\n' + Number(Data[5].ETH.balance).toFixed(8) +' ETH (donate to 0x1189d2c383A6533196b1A63e6FFcA69Edefce9ee) ```**');
    });
}

function GetHashrate(message){
    var BlockdataPromise = requestData(3, "https://explorer.01coin.io/api/getnetworkhashps");
    BlockdataPromise.then(function (result) {
        message.channel.send('**```fix\nThe current hashrate is: ' + Number((Data[3] / 1000000)).toFixed(2) + " MH/s```**");
    });
}

function GetPrice (message) {
  var GraviexPromise = requestData(4, "https://graviex.net/api/v2/tickers/zocbtc.json"),
  CrexPromise = requestData(7, "https://api.crex24.com/v2/public/recentTrades?instrument=ZOC-BTC"),
  CrexBookPromise = requestData(9, "https://api.crex24.com/v2/public/orderBook?instrument=ZOC-BTC"),
  CryptalPromise = requestData(8, "https://api.cryptaldash.com/v1/pubticker/zocbtc");
  GraviexPromise.then(function (graviexResult) {
    CrexPromise.then(function (crexResult) {
      CrexBookPromise.then(function (crexBookResult) {
        CryptalPromise.then(function (cryptalResult) {
          var crexOrderbook = JSON.parse(Data[9])
          var graviexMarket = JSON.parse(Data[4]), crexMarket = JSON.parse(Data[7]), cryptalMarket = JSON.parse(Data[8]);
          var graviexPrice = Number(graviexMarket.ticker.change * 100).toFixed(2), crexPrice = Number(crexMarket[0].price).toFixed(8), cryptalPrice = Number(cryptalMarket.price_ticker.last_price).toFixed(8);
          if(exchange === 'crex24' || exchange === 'crex'){
              message.channel.send('**```fix\nCrex24:\nLast Trade: ' + Number(crexPrice).toFixed(8) + ' BTC\nCurrent buy: ' + crexOrderbook.buyLevels[0].price.toFixed(8) + ' BTC\nCurrent sell: ' + crexOrderbook.sellLevels[0].price.toFixed(8) + ' BTC\n```**');
          }else if(exchange === 'graviex' || exchange === 'grav'){
              message.channel.send('**```fix\nGraviex:\nLast trade: ' + Number(graviexMarket.ticker.last).toFixed(8) + ' BTC\nCurrent buy: ' + Number(graviexMarket.ticker.buy).toFixed(8) + ' BTC\nCurrent sell: ' + Number(graviexMarket.ticker.sell).toFixed(8) + ' BTC\n24h change: ' + ((graviexPrice >= 0) ? '+' : '') + graviexPrice + '%\nVolume: ' + Number(graviexMarket.ticker.volbtc).toFixed(4) + ' BTC```**');
          }else if(exchange === 'cryptaldash' || exchange === 'cd'){
              message.channel.send('**```fix\nCryptalDash:\nLast Trade: ' + cryptalPrice + ' BTC\nCurrent buy: ' + cryptalMarket.price_ticker.ask.toFixed(8) + ' BTC\nCurrent sell: ' + cryptalMarket.price_ticker.bid.toFixed(8) + ' BTC\n24h change: ' + cryptalMarket.price_ticker.percent_change24h.toFixed(2) + '%\nVolume: ' + cryptalMarket.price_ticker.volume24h + ' BTC```**');
          }else{
             message.channel.send('**```Suggested use: !price graviex, !price crex, !price cd```**');
          }
        });
      });
    });
  });
}

function GetMasternodesCount(message){
    var MasternodePromise = walletAPI.GetMasternodeCount();
    MasternodePromise.then(function (result) {

        var roi = 1000 / (7488 / result);
        message.channel.send('**```fix\nThe current masternode count is: ' + result + '\nThe estimated ROI of a ZOC masternode is: ' + Number(roi).toFixed(0) + ' days```**');
    });
}

function GetRewards(message){
    var MasternodePromise = walletAPI.GetMasternodeCount();
    MasternodePromise.then(function (result) {
        //amount of masternodes times block time / mins in day
        var amountperday = (60/2.5*24)/result;

        message.channel.send('**```fix\nThe average masternode rewards are:\n' + Number((amountperday * 13)).toFixed(2) + ' ZOC per day\n' + Number(((amountperday * 13)* 7)).toFixed(2) + ' ZOC per week\n' + Number(((amountperday * 13)* 28)).toFixed(2) + ' ZOC per month\n' + Number(((amountperday * 13)* 365)).toFixed(2) + ' ZOC per year```**');

    });
}
//WIP
function GetInvite(message){
//check if user has one if not then gen one
    var link = database.CheckIfUserHasLink(message.author);

       if(link == null){
           //var genlink = GenInvite(message);
           message.channel.createInvite({maxAge: 0, unique: true}).then(invite => {
            database.AddDiscordInviteLink(message.author,invite.code);
           message.channel.send(`${message.author} Invite Link : ${invite.code}`);
           console.log(invite.code);
           database.Save();
        });


       }else{
            message.channel.send(`${message.author} Invite Link : ${link}`);
       }
   // message.channel.createInvite({maxAge: 0, unique: true}).then(invite => {

//message.channel.send('Here you go : ' + invite.code)

}

function CalcMining(message, args){
    if (args[1] === null || args[1] === undefined || Number(args[1]) <= 0 || isNaN(Number(args[1]))) return message.channel.send('**```fix\nFollow the !mine instruction with a number in MH/s to get average mining rewards per day: e.g. !mine 2.5```**');
    var BlockdataPromise = requestData(6, "https://explorer.01coin.io/api/getdifficulty");
    BlockdataPromise.then(function (result) {
        //message.channel.send('The current hashrate is : ' + (Data[6] / 1000000) + " MHs");
        var Hashrate = args[1] * 1000000;
        var Difficulty  = Data[6];
        var RewardperBlock = 13;
        var numberOfDays = 1;
        var SecondsPerDay = 86400;
        var reward = ((numberOfDays*Hashrate*RewardperBlock*SecondsPerDay)/(Difficulty*2**32));
        console.log(reward);
        message.channel.send('**```fix\nThe average mining rewards per day with ' + args[1] + ' MH/s is ' + Number(reward).toFixed(8) + ' ZOC```**');
    });
}

function CalcValue(message, args){
  if (args[1] === null || args[1] === undefined || Number(args[1]) <= 0 || isNaN(Number(args[1]))) return message.channel.send('**```fix\nFollow the !value instruction with an amount of ZOC to get the value of your ZOC: e.g !value 1000```**');
  var MarketdataPromise = requestData(4, "https://graviex.net/api/v2/tickers/zocbtc.json");
  MarketdataPromise.then(function (result) {
      var market = JSON.parse(Data[4]);
      message.channel.send('**```fix\n' + args[1] + ' ZOC is worth:\n' + (Number(market.ticker.last) * Number(args[1])).toFixed(8) + ' BTC```**');
  });
}
//exports  Functions to be used in main file
module.exports.Setup = Setup;
module.exports.GetBlockCount = GetBlockCount;
module.exports.GetFund = GetFund;
module.exports.GetHashrate = GetHashrate;
module.exports.GetPrice = GetPrice;
module.exports.GetMasternodesCount = GetMasternodesCount;
module.exports.GetRewards = GetRewards;
module.exports.GetInvite = GetInvite;
module.exports.CalcMining = CalcMining;
module.exports.CalcValue = CalcValue;
