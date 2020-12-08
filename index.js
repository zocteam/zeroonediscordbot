process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

//config
const settings = require('./config.js');
var request = require("request");
var walletAPI = require('./walletAPI.js');

//Discord API
const Discord = require('discord.js');
const Bot = new Discord.Client();
const Commands = require('./commands.js');

Bot.on('ready', () => {
    walletAPI.Setup();
    Commands.Setup();
    console.log('Ready!');
    Bot.user.setPresence({
        game: {
            name: prefix + 'help',
            type: 2
        }
    });
});

Bot.on('guildMemberAdd', member => {
    member.send("Hello, and welcome to the 01coin Community! We are happy to have you!\n\nTo help you get started with 01coin, please proceed directly to the <#439415791826501642> channel.\n\nYou'll find all of the lastest news in the <#426349998675066891> channel. Once you're up to speed, please swing by any of the channels in the 01chat category. We have a large and dedicated team of moderators available to answer any questions you may have, not to mention a knowledgeable and helpful community - which now includes you!\n\n:link:  ** Useful Links:**\nLatest wallets: <https://github.com/zocteam/zeroonecoin/releases>\nBlock explorer: <https://explorer.01coin.io/>\nBitcointalk ANN: <https://bitcointalk.org/index.php?topic=3457534>\nLive dev roadmap: <https://trello.com/b/oTHwfsge/zero-one-coin-a-team>\n\n:twisted_rightwards_arrows:  **Exchanges:**\nGraviex: <https://graviex.net/markets/zocbtc>\nBisq: <https://bisq.network/>\nCrex24: <https://crex24.com/exchange/ZOC-BTC>\nCryptalDash: <https://exchange.cryptaldash.com/>\n\n:selfie:  **Social Media:**\nTwitter: <https://twitter.com/01CoinTeam>\nTelegram: <https://t.me/ZOCCoinOfficial>\nFacebook: <https://www.facebook.com/01CoinTeam>\nYouTube: <https://www.youtube.com/channel/UCWpXI8H8JnJiiaalFM8e3FQ>\nMedium: <https://medium.com/01coin-community-blog>\nSteemit: <https://steemit.com/@zeroonecoin>\nReddit: <https://www.reddit.com/r/01coin/>\n\nWe hope you enjoy being a part of the 01coin Community, and remember, with 01coin...\n\n***The future is in your hands***");
});

const prefix = "!";
Bot.on('message', (message) => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);

    const command = args[0]
    // console.log('Args: ' + args);
    if (command === 'block' || command === 'blocks') {
        Commands.GetBlockCount(message);
    }

    if (command === 'fund' || command === 'donations' || command === 'fundraiser') {
       Commands.GetFund(message);
    }

    if (command === 'hash' || command === 'hashrate' ) {
        Commands.GetHashrate(message);
    }

    if (command === 'market' || command === 'price') {
       Commands.GetPrice(message);
    }

    //masternodes
    if (command === 'masternodes' || command === 'masternode' || command === 'mn') {
         Commands.GetMasternodesCount(message);
    }

    if(command === 'rewards' || command === 'reward'){
        Commands.GetRewards(message);
    }

    if(command === 'mine'){
        Commands.CalcMining(message, args);
    }

    if(command === 'value'){
        Commands.CalcValue(message, args);
    }

    if (command === 'guide') {
        message.channel.send('**```fix\nYou can find the current guide to setup masternodes on linux here: https://github.com/zocteam/zeroonecoin/blob/master/doc/01KT-MasternodeGuide.pdf```**');
    }

    if (command === 'help') {
        message.author.send("Hi, I'm the 01coin bot, and I'm happy to help! I respond to the following commands...\n**```fix\n" +
                            prefix + "blockcount - Shows the current block height\n" +
                            prefix + "donations - Shows the current balance in the donation wallets\n" +
                            prefix + "price - Shows the current ZOC price on exchange\n" +
                            prefix + "hashrate - Shows the current mining hashrate of the network\n" +
                            prefix + "mine N - Shows the estimated mining proceeds for N MH/s\n" +
                            prefix + "value N - Shows the market value for N ZOC\n" +
                            prefix + "masternodes - Shows the current masternode count and estimated ROI\n" +
                            prefix + "rewards - Shows the estimated masternode rewards\n" +
                            prefix + "guide - Provides a link to the masternode setup guide```**" +
                            "\n"
                          );
    }

    if (command === 'takeoverworld') {
        //message.channel.send('World Dommiaton Is Mine! :P');
        message.channel.sendFile("https://i.imgur.com/Ljc8jRm.jpg");
    }

    const BannedLinks = ["discord.gg"];
   //ZeroOneCoin is the test server bot role name

    if (BannedLinks.some(BannedLinks => message.content.includes(BannedLinks) && !message.member.roles.find("name", "ZeroOneCoin") && !message.member.roles.find("name", "01Coin")&& !message.member.roles.find("name", "zocteam")&& !message.member.roles.find("name", "pool admin") && !message.member.roles.find("name", "shared mn provider"))) {
        let role = message.guild.roles.find("name", "read-only");
        message.member.addRole(role);
        
        //warn User
        message.author.send('**```fix\nPlease be aware there is a ZERO TOLERANCE policy for link spamming on the 01coin Community Discord server. Your spam links will be immediately deleted, so please take your spam elsewhere.```**');
        
        message.delete();
    }
});

Bot.login(settings.GetClientToken());
