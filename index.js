//config
const settings = require('./config.js');
var request = require("request");

//Discord API
const Discord = require('discord.js');
const Bot = new Discord.Client();

var Data = ['','','',''];

function requestData(id,url) {
    // Setting URL and headers for request
    var options = {
        url: url,
        headers: {
            'User-Agent': 'request', 
            'rejectUnauthorized': 'false'            
        }
    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
    	// Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
               Data[id] = body;
               resolve(body);
            }
        })

    })

}

Bot.on('ready', () => {
    console.log('Ready!');
});

Bot.on('message', (message) => {
    console.log(Data);
    if(message.channel.id == '' )
    if(message.content=='!ping'){
        message.channel.send('Pong');
    }

    if(message.content == '!Blockcount' || message.content == '!blockcount' || message.content == '!block' || message.content == '!Block' || message.content == '!blocks' ){
       
        var BlockdataPromise = requestData(0,"https://explorer.01coin.io/api/getblockcount");
         BlockdataPromise.then(function(result) {
            
         message.channel.send('The Current Block Count Is : ' + Data[0]);
       });    
    }
      

    if(message.content == '!fund' || message.content == '!donations' || message.content == '!fundraiser'){

    var BTCdataPromise = requestData(1,"https://blockexplorer.com/api/addr/33aoJAthELcSGsYZJXxV8PAHVYiDECPuJR/balance");
    var ZOCdataPromise = requestData(2,"https://explorer.01coin.io/ext/getbalance/5AchYc7iQS7ynce7hNZ6Ya8djsbm5N9JBS");

     Promise.all([BTCdataPromise,ZOCdataPromise]).then(function(result) {
             
            message.channel.send('The Current Balance For BTC Is  : ' + (Data[1]/100000000) + ' BTC \n' + 'The Current Balance For ZOC Is : ' + Data[2] + ' ZOC' );
      });    
     
    }

    if(message.content == '!hash' ||message.content == '!hashrate' ){
        var BlockdataPromise = requestData(3,"https://explorer.01coin.io/api/getnetworkhashps");
        BlockdataPromise.then(function(result) {
            
           message.channel.send('The Current HashRate Is : ' + (Data[3]/1000000) + " MHs");
      });    
    }
  
    if(message.content == '!market'|| message.content == '!price'){
        //https://graviex.net:443//api/v2/tickers/zocbtc.json
        var MarketdataPromise = requestData(4,"https://graviex.net/api/v2/tickers/zocbtc.json");
        MarketdataPromise.then(function(result) {
            var market = JSON.parse(Data[4]);
           message.channel.send('The Last Trading Price Is : ' + market.ticker.last + ' BTC ');
       });    
    }

    if(message.content == '!help'){
        message.channel.send('!blockcount - Shows the current block height \n!donations - Shows the current balance in the donation wallets\n!hashrate - Shows the current mining hashrate of the network\n!market or !price - Shows the current ZOC price on exchange');
    }

    if(message.content=='!takeoverworld'){
        //message.channel.send('World Dommiaton Is Mine! :P');
        message.channel.sendFile("https://i.imgur.com/Ljc8jRm.jpg");
    }
    console.log(Data);
});

Bot.login(settings.GetClientToken());