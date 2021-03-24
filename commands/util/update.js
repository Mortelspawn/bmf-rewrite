const { Client, Message, GuildMember, MessageEmbed } = require("discord.js");
const core = require('./../../core/main.js')

function msToHMS(ms) {
    let d = new Date(ms)
    return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
}

module.exports = {
    name: 'update',
    description: 'Updates your osu! data and gives your new ranks accordingly',

    /**
     * Update command
     * @param {Client} client 
     * @param {Message} msg 
     * @param {Array} args 
     */
    execute: async function(client, msg, args) {
        
        let user = await core.checkForUser(client, msg.author.id)

        if (user == null) return msg.channel.send('You have to be linked first to use "update", ' + `do \`${process.env.PREFIX}link [profile]\``)
        if (!core.cooldown(user.data.player.last_update, 86400000)) return msg.channel.send('You can only use update every 24h, last update was at ' + msToHMS(user.data.player.last_update))

        let userData = await core.getOsuProfile(msg, user.data.player.user_id, user.data.player.mode)
        if (!userData) return

        user.data.player = userData.player

        /** @type {GuildMember} */
        let member = ''
        if (msg.channel.type == "dm") {
            member = await client.server.members.fetch(msg.author.id, true, true)
        } else {
            member = msg.member
        }

        let remove = []
        for (i=1; i<50; i++) {
            let role = await member.roles.cache.find(r => r.name == `#${i}`)
            if (role) {
                remove.push(role.name)
            }
        }

        msg.channel.send('Updating ...')
            .then(async (sent) => {
                try {
                    await core.removeRoles(client, member, remove)
                    await core.giveRoles(client, member, [`#${userData.player.pp_country_rank}`])
                    await core.updateUser(client, user, msg.author.id)
                    sent.delete()
                    msg.channel.send({
                        embed: new MessageEmbed()
                            .setDescription('Update successful')
                            .setColor('GREEN')
                    })
                } catch (err) {
                    console.log(err)
                    sent.delete()
                    msg.channel.send({
                        embed: new MessageEmbed()
                            .setDescription('An error has occured, blame Mortelspawn_')
                            .setColor('RED')
                    })
                }
            })
    }
}