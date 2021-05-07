/*jshint esversion: 6 */

const commando = require('discord.js-commando');
const app = require('../../app.js');
const config = require('../../config.json');
const { Client, Permissions } = require('discord.js');

class DMOnlineCmd extends commando.Command {
    constructor(client){
        super(client, {
            name: `dmonline`,
            group: 'dms',
            memberName: 'dmonline',
            description: 'Sends message provided to all members of the guild with status online.',
            examples: [ `${config.prefix}dmonline Hey everyone! This might reach more people than a mass ping...` ]
        });
    }

    async run(message){
        let dmGuild = message.guild;
        let msg = message.content;
        let OnlineMembers = [];

        let botusr = dmGuild.members.find(o => o.id == this.client.user.id)
        if (!botusr.hasPermission(['ADMINISTRATOR'])) {
            console.log(`WARNING: Bot is not properly configured with administrative permissions.`);
        }

        try {
            msg = msg.substring(msg.indexOf("dmonline") + 8);
        } catch(error) {
            console.log(error);
            return;
        }

        if(!msg || msg.length <= 1) {
            const embed = new Discord.RichEmbed()
                .addField(":x: Failed to send", "Message not specified")
                .addField(":eyes: Listen up!", "Every character past the role mention will be sent,\nand apparently there was nothing to send.");
            message.channel.send({ embed: embed });
            return;
        }


        // First we use fetchMembers to make sure all members are cached

        let memberarray = dmGuild.members.array();
        let membercount = memberarray.length;
        let botcount = 0;
        for (var i = 0; i < membercount; i++) {
            let member = memberarray[i];
            if (member.user.bot) {
                botcount++;
                continue
            }

            if (member.presence.status == 'online') {
                OnlineMembers.push(member);
            }
        }
        console.log(membercount);
        memberarray = OnlineMembers;
        membercount = memberarray.length;
        botcount = 0;
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
                if(i == (membercount-1)) {
                    console.log(`Waited ${timeout}ms.\t\\/\tDMing ${member.user.username}`);
                } else {
                    console.log(`Waited ${timeout}ms.\t|${i + 1}|\tDMing ${member.user.username}`);
                }
                try {
                    member.send(`${msg} \n #${timeout}`);
                    successcount++;
                } catch (error) {
                    console.log(`Failed to send DM! ` + error)
                }
        }
        console.log(`Sent ${successcount} ${(successcount != 1 ? "messages" : "message")} successfully, ` +
                `${botcount} ${(botcount != 1 ? "bots were" : "bot was")} skipped.`);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = DMOnlineCmd;
