const core = require('../../core/main.js')
const getCountryISO3 = require("country-iso-2-to-3");
const { Client, Message } = require('discord.js');

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
    name: 'link',
    description: 'Links your osu! account to the BM&F Discord server',
    args: true,
    usage: '[profile link]',

    /**
     * Link command
     * @param {Client} client 
     * @param {Message} msg 
     * @param {Array} args 
     * @returns 
     */
    execute: async function(client, msg, args) {

        if (await core.checkForUser(client, msg.author.id) != null) return msg.channel.send('You are already linked!')

        const isUrl = core.urlCheck(args[0])
        if (!isUrl) return msg.channel.send('Please provide a valid profile link (i.e. `https://osu.ppy.sh/users/5331420`)')

        const link = new URL(args[0])

        let osu = {}
        let linkArgsCheck = core.checkLink(link)
        if (!linkArgsCheck.mode) {
            const call = await core.awaitMode(msg)
            if (!call) return
            osu.mode = call
        } else {
            osu.mode = linkArgsCheck.mode
        }
        osu.id = linkArgsCheck.id

        let user = await core.getOsuProfile(msg, osu.id, osu.mode)
        if (!user) return
        
        user.discord = {
            id: msg.author.id,
            username: msg.author.username,
            discriminator: msg.author.discriminator,
            avatar: msg.author.defaultAvatarURL
        }

        let roles = {
            country_rank: user.player.pp_country_rank,
            country: getCountryISO3(user.player.country),
            mode: capitalize(user.player.mode),
            verified: "Verified"
        }

        let member = ""

        if (msg.channel.type == "dm") {
            member = await client.server.members.fetch(msg.author.id, true, true)
        } else {
            member = msg.member
        }
        
        core.link(client, msg, roles, member)
        core.insertUser(client, user, msg.author.id)
    }
}