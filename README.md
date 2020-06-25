# Scotty-Twitch-Quote-Converter
Allows a person to import quotes from ScottyBot into a Twitch chat bot. 

__The account sending the messages must be either OP or Moderator status in the target channel__

# Youtube Tutorial
Link will go here

# How to use
Install node.js https://nodejs.org/en/

Once installed, create a folder where the bot will be intalled and copy `bot.js` into this folder

Open the Node.js command prompt
<div align="center">
	<div>
		<img width="500" src="media/Node Command Line.png" alt="Awesome Node.js">
	</div>
</div>

cd into the directory where the bot will be installed
* ex. If the directory is  C:\Bots\Twitch Quotes the command will be: `cd C:\Bots\Twitch Quotes`

Once in navigated to this folder, install needed packages
```
npm install tmi.js

npm install node-fetch

npm install prompt-sync

npm install minimist
```
### Running the bot
__Important note about Node.js command line. Right click is the paste command. Ctrl+C will immediatly exit the program__

While still in that folder, run the command `node bot.js` and follow the prompts.
* `Twitch Name` is the name of the account sending the messages.
* `Twitch OAuth Key` is that account's OAuth key.
	* Can be obtained at https://twitchapps.com/tmi/
		* Whichever account you are logged into will generate the key
	* __Make sure to include `oauth:` when entering the key.__
* `Target Channel` is the channel the messages will be sent in. This will likely be your main Twitch channel.
* `Mixer Channel` is the Mixer channel you want to import the quotes from.
* `Quote Format` is the format your Twitch chat bot accepts new quotes. 
	* __Quote Format Variables__
		* `%u`   person who said the quote.
		* `%m`   body of the quote.
		* `%d`   original quote date.
		* `%g`   game playing when quote added
	* Ex. `!addquote %u %m %d %g`
		
     
After confirming that the quote format is correct, the console will show that you are connected to chat. To test the connection is working, type `!ping` in Twitch chat.

To transfer the quotes, type in Twitch chat `!importscottyquotes`. This will then prompt you in the __CONSOLE__ to confirm the formatting is correct one more time. Once you confirm, the bot will start adding the quotes to the new bot.

Any quotes that the program detects as problematic will be outputed to the console. They will still be added but will need to be fixed manually.
* The IDs given by the console are the ScottyBot ID.
* If you already have some quotes in your bot, the correct ID will be the `ID + # of pre-existing quotes`.

### Running the bot with runtime arguments
Start is still `node bot.js`. Add arguments after this. 

#### Arguments
* Each argument is denoted by a single `-`
	* `-b` Twitch Name
	* `-o` Twitch OAuth Key
		* Again, make sure to include `oauth:` when entering
	* `-t` Target Channel
	* `-m` Mixer Channel
	* `-c` Quote Format
		* __If entering the quote format with runtime arguments, it must be wrapped in quotation marks__
		* Ex. `"!addquote %u %m %d %g"`
