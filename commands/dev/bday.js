const { Client, Message, MessageEmbed } = require('discord.js')
const coreZayyken = require('./../../core/zayyken.js')

module.exports = {
    name: 'happy-birthday',
    aliases: ['hb', 'zayyken', 'bday'],

    /**
     * HB Zayyken command
     * @param {Client} client 
     * @param {Message} msg 
     * @param {Array} args 
     */
    execute: async function(client, msg ,args) {
        let zayyken = await coreZayyken.init(client)

        await msg.channel.send({
            embed: new MessageEmbed()
                .setDescription(`${msg.author} wishes ${zayyken.user} a happy birthday`)
                .setColor('GREEN')
        })

        zayyken.wishes.push(msg.author)
    }
}