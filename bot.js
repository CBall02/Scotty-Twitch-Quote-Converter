// JavaScript source code

//  npm install prompt-sync
//  npm install tmi.js
//  npm install minimist
//  npm install node-fetch


const tmi = require('tmi.js');
const argv = require('minimist')(process.argv.slice(2));
const fetch = require('node-fetch');
const prompt = require('prompt-sync')({ sigint: true });



//Get bot, channel and format information

var twitchName;
if (argv['b'] === undefined) {
    twitchName = prompt('Twitch Name: ');
}
else {
    twitchName = argv['b'];
}


var twitchOauth;
if (argv['o'] === undefined) {
    twitchOauth = prompt('Twitch OAuth Key: ');
}
else {
    twitchOauth = argv['o'];
}


var targetChannel;
if (argv['t'] === undefined) {
    targetChannel = prompt('Target Channel: ');
}
else {
    targetChannel = argv['t'];
}


var mixerChannel;
if (argv['m'] === undefined) {
    mixerChannel = prompt('Mixer Channel: ');
}
else {
    mixerChannel = argv['m'];
}


var unparsedCMD;
if (argv['c'] === undefined) {
    console.log(' \n%u Username \t%m Quote/Message \t%d Date \t%g Game');
    unparsedCMD = prompt('Quote Format: ');
}
else {
    unparsedCMD = argv['c'];
}



// Parse custom quote CMD and ensure it is correct
do {
    const name = 'TestName', date = '00/00/00', quote = 'TestQuote', game = 'TestGame';
    unparsedCMD = unparsedCMD.replace('%d', '${date}');
    unparsedCMD = unparsedCMD.replace('%u', '${name}');
    unparsedCMD = unparsedCMD.replace('%m', '${quote}');
    unparsedCMD = unparsedCMD.replace('%g', '${game}');
    unparsedCMD = unparsedCMD.trim();
    var parsedcmd = eval('`' + unparsedCMD + '`');
    console.log(parsedcmd);
    var correctFormat = prompt("Is this the correct format for entering a quote?   y/n\t");
    var confirmation;
    if (correctFormat === 'y' || correctFormat === 'Y') {
        confirmation = prompt("Are you sure?   y/n\t");
        if (confirmation === 'y' || confirmation === 'Y') {
            break;
        }
    }
    else {
        console.log(' \n%u Username \t%m Quote/Message \t%d Date \t%g Game');
        unparsedCMD = prompt('Quote Format: ');
    }
} while ((correctFormat !== 'y' || correctFormat !== 'Y') && (confirmation !== 'y' || confirmation !== 'Y'));



// json configuration for scotty import
let scottyURL = "https://scottybot.net/api/showquotes?chanid=" + mixerChannel;
let jsonsettings = { method: "Get" };

// Define configuration options
const opts = {
  identity: {
        username: twitchName,
        password: twitchOauth
  },
  channels: [targetChannel]
};

// Create a client using options
const client = new tmi.client(opts);


// Declare event handlers
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();


// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot
    if (msg[0] !== '!') { return; } //Ignore non-cmds

  // Remove whitespace from chat message
    const commandName = msg.toLowerCase().trim();

  // If the command is known, let's execute it
    if (commandName === '!importscottyquotes') {
        {
            const name = 'TestName', date = '00/00/00', quote = 'TestQuote', game = 'TestGame';
            var parsedcmd = eval('`' + unparsedCMD + '`');
            client.say(target, "WARNING: By confiming you will automatically add all quotes in the current format. If it is incorrect, potentially hundreds of quotes will be added incorrectly.");
            client.say(target, '"' + parsedcmd + '"');
            client.say(target, 'Confirm in the node CONSOLE this is the correct way to add quotes. ');
            console.log("WARNING: By confiming you will automatically add all quotes in the current format. If it is incorrect, potentially hundreds of quotes will be added incorrectly.");
            console.log('\n' + parsedcmd);
        }
        var confirmation = prompt('Confirm this is the correct format for adding quotes.  y/n\t');
        if ((confirmation === 'y' || confirmation === 'Y')) {
            var data = fetch(scottyURL, jsonsettings).then(res => res.json()).then((json) => {
                countMultipleDashes(json);
                for (i in json) {
                    var splitQuote = json[i].quote.split(" - ");
                    var dateAndGame = splitQuote[2];


                    var quote = splitQuote[0].trim();
                    var username = splitQuote[1].trim();
                    var gameStart = dateAndGame.indexOf('(');
                    var date;
                    var game;
                    if (gameStart === -1) {
                        date = dateAndGame.trim();
                    }
                    else {
                        date = dateAndGame.substring(0, gameStart).trim();
                        game = dateAndGame.substring(gameStart, dateAndGame.length).trim();
                    }
                    cmdToTwitch(target, username, quote, date, game);
                    sleep(6000);
                }
            });
            console.log(`* Executed ${commandName} command`);
            return;
        }
        else {
            console.log(`* Canceled execution of ${commandName} and exited program. Re-run program to try again`);
            return process.exit(1);
        }
    }
    if (commandName === '!ping') {
        client.action(target, 'PONG!');
        console.log(`* Executed ${commandName} command`);
        return;
    }
    else {
        console.log(`* Unknown command ${commandName}`);
        return;
    }
}


// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

//counts the number of " - " in a quote. Returns ids of problem quotes (more than three in a single quote)
function countMultipleDashes(jsonobj) {
    console.log("Quotes that will need fixing: ");
    for (i in jsonobj) {
        var workingString = jsonobj[i].quote;
        var numberOfDashes = workingString.match(/ - /gi).length;
        if (numberOfDashes > 2) {
            console.log(jsonobj[i].id);
        }
    }
}

//Sleep function
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}


//Send formatted comd to twitch chat
function cmdToTwitch(target, name, quote, date, game) {
    if (game === undefined) {
        game = '';
    }
    var parsedcmd = eval('`' + unparsedCMD + '`');
    //console.log(parsedcmd)
    client.say(target, parsedcmd);
}