const { Client, Message, MessageEmbed } = require('discord.js')
const core = require('../../core/main.js')

module.exports = {
    name: 'outsider',

    /**
     * Gives the outsider role to that new user
     * @param {Client} client 
     * @param {Message} msg 
     * @param {Array} args 
     */
    execute: async function(client, msg, args) {

        if (await core.checkForUser(client, msg.author.id)) return msg.channel.send('You are already linked!')

        let user = {
            discord: {
                id: msg.author.id,
                username: msg.author.username,
                discriminator: msg.author.discriminator,
                avatar: msg.author.defaultAvatarURL
            },
            outsider: true
        }

        let roles = ['Verified', 'Outsider']

        let member = ""

        if (msg.channel.type == "dm") {
            member = await client.server.members.fetch(msg.author.id, true, true)
        } else {
            member = msg.member
        }

        try {
            await core.removeRoles(client, member, ['New user'])
            await core.giveRoles(client, member, roles)
            await core.insertUser(client, user, msg.author.id)
            msg.channel.send({
                embed: new MessageEmbed()
                    .setDescription('You are now verified, enjoy your stay o/')
                    .setColor('GREEN')
            })
        } catch (err) {
            console.log(err)
            msg.channel.send({
                embed: new MessageEmbed()
                    .setDescription('An error has occured, blame Mortelspawn_')
                    .setColor('RED')
            })
        }
    }
}