const commando = require(`discord.js-commando`);
const config = require('./config.json');
const bot = new commando.Client({
    commandPrefix:'!',
    owner: config.id || process.env.CLIENT_ID,
});

bot.on("ready", () => {
    clear();
    console.log('______');
    bot.user.setActivity('from GitHub', { url: "https://github.com/harish551/discord-dm-bot", type: 'PLAYING' })
        .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
        .catch(console.error);
});


bot.on("error", (error) => {
    console.log(error);
    bot.login(config.token);
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

bot.registry.registerGroup('dms', 'help');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + "/commands");

if (process.env.TESTING) process.exit();

try {
    if (process.env.BOT_TOKEN) bot.login(process.env.BOT_TOKEN);
    else bot.login(config.token);
}
catch (e) {
    console.log(e);
    console.log("Failed to login to Discord!");
}



function clear() {
    console.clear();
    console.log("\n\nDiscord DM bot. \n Sends DMs to selected members of guild.\n  Forked and improved by Harish.");
    console.log(`\nRandom send time set @ 0.01-${config.wait}s`);
    console.log(` Type  ${config.prefix}help  in a chat.\n\n`);
}