const { Client, Message, MessageEmbed } = require('discord.js')
const coreZayyken = require('./../../core/zayyken.js')

module.exports = {
    name: 'thanks',
    aliases: ['thx'],

    /**
     * THX Zayyken command
     * @param {Client} client 
     * @param {Message} msg 
     * @param {Array} args 
     */
    execute: async function(client, msg ,args) {
        let zayyken = await coreZayyken.init(client)

        if (msg.author != zayyken.user) return msg.channel.send('Only Zayyken can use this command')
        if (zayyken.wishes.length < 1) return msg.channel.send('No one to thank')

        for (let user of zayyken.wishes) {
            await msg.channel.send({
                embed: new MessageEmbed()
                    .setDescription(`Thank you ${user} for wishing ${zayyken.user} a happy birthday!`)
                    .setColor('YELLOW')
            })
        }

        zayyken.wishes.splice(0, zayyken.wishes.length)
    }
}