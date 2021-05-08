const commando = require('discord.js-commando');
const config = require('../../config.json');
const Discord = require('discord.js');

class DMallCommand extends commando.Command {
    constructor(client){
        super(client, {
            name: `dmall`,
            group: 'dms',
            memberName: 'dmall',
            description: 'Sends message provided to all members of the guild.',
            examples: [ `${config.prefix}dmall Hey everyone! This might reach more people than a mass ping...` ],
            clientPermissions: ['ADMINISTRATOR'],
            userPermissions: ['ADMINISTRATOR']
        });
    }

    async run(message, args){
        if(message.channel.type === "dm") return;
        let dmGuild = message.guild;
        var msg = message.content;



        try {
            msg = msg.substring(msg.indexOf("dmall") + 5);
        } catch(error) {
            console.log(error);
            return;
        }

        if(!msg || msg.length <= 1) {
            const embed = new Discord.RichEmbed()
                .addField(":x: Failed to send", "Message not specified")
                .addField(":eyes: Listen up!", "Every character past the command will be sent,\nand apparently there was nothing to send.");
            message.channel.send({ embed: embed });
            return;
        }

        let memberarray = dmGuild.members.array();
        let membercount = memberarray.length;
        let botcount = 0;
        let successcount = 0;
        console.log(`Responding to ${message.author.username} :  Sending message to all ${membercount} members of ${dmGuild.name}.`)
        for (var i = 0; i < membercount; i++) {
            let member = memberarray[i];
            if (member.user.bot) {
                console.log(`Skipping bot with name ${member.user.username}`)
                botcount++;
                continue
            }
            let timeout = Math.floor((Math.random() * (config.wait - 0.01)) * 1000) + 10;
            await sleep(timeout);
            if(i === (membercount-1)) {
                console.log(`Waited ${timeout}ms.\t\\/\tDMing ${member.user.username}`);
            } else {
                console.log(`Waited ${timeout}ms.\t|${i + 1}|\tDMing ${member.user.username}`);
            }
            try {
                member.send(`${msg} \n`);
                successcount++;
            } catch (error) {
                console.log(`Failed to send DM! ` + error)
            }
        }
        console.log(`Sent ${successcount} ${(successcount !== 1 ? "messages" : "message")} successfully, ` +
            `${botcount} ${(botcount !== 1 ? "bots were" : "bot was")} skipped.`);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = DMallCommand;
