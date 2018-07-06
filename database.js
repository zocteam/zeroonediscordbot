//
var fs = require('fs');
var data = {};
data.table = [];

var discordinvitelinks = {};
function AddDiscordInviteLink(user, Link){

    var obj = {
        id: user,
        link: Link
    }
    data.table.push(obj);
   
}
function CheckIfUserHasLink(user){
    if(discordinvitelinks[user]== null){
        return null;
    }else{
        return discordinvitelinks[user];
    }
}

function Save(){

fs.writeFile ("discordlinks.json", JSON.stringify(data), function(err) {
    if (err) throw err;
        console.log('complete');
    }
);

}
function Load(){
   fs.readFile('discordlinks.json', 'utf8', function readFileCallback(err, data){
        if (err){
             console.log(err);
        } else {
             discordinvitelinks = JSON.parse(data); //now it an object
    }})
}

module.exports.AddDiscordInviteLink = AddDiscordInviteLink;
module.exports.CheckIfUserHasLink = CheckIfUserHasLink;
module.exports.Save = Save;
module.exports.Load = Load;