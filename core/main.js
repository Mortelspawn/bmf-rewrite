const { MessageEmbed, ClientUser, ClientApplication, BaseClient, Client, GuildMember, Message } = require('discord.js')
const Nodesu = require('nodesu')
const osu = new Nodesu.Client(process.env.KEY)

module.exports.checkForUser = async function(client, id) {
    let data = await client.sql`
        SELECT * FROM users WHERE discord_id = ${id}
    `
    if (data.count > 0) {
        data = data[0]
    } else {
        data = null
    }
    return data
}

module.exports.insertUser = async function(client, user, id) {

    const values = {
        discord_id: id,
        data: JSON.stringify(user, null, 0)
    }

    client.sql`
        INSERT INTO users ${
            client.sql(values, 'discord_id', 'data')
        }
    `
}

module.exports.urlCheck = function(arg) {
    let testURL = true
    try {
        let url = new URL(arg)
        testURL = /osu.ppy.sh\/users\/[0-9]{1,}/gi.test(url)
    } catch (err) {
        testURL = false
    }
    return testURL
}

module.exports.checkLink = function(link) {
    let result = {}

    let modes = ['osu', 'taiko', 'fruits', 'mania']

    for (i=0; i<modes.length; i++) {
        if (link.pathname.endsWith(modes[i])) {
            result.mode = modes[i]
        }
    }
    let path = link.pathname
    result.id = path.replace(/[^0-9]/gi, '')
    return result
}

module.exports.awaitMode = async function(msg, embed) {
    return new Promise(async (resolve) => {
        let m = await msg.channel.send({
            embed: new MessageEmbed()
                .setTitle('Mode picker')
                .setDescription('Please react with the gamemode you want to be linked with')
                .addFields({name: '\u200B', value: ':musical_keyboard: Mania\n:blue_circle: Standard\n:drum: Taiko\n:apple: Catch\n'})
                .setFooter('Wait for all 4 reactions to come up otherwise it won\'t register your choice')
                .setColor('ORANGE')
        })
        await m.react('🎹').then(() => {m.react('🔵')}).then(() => {m.react('🥁')}).then(() => {m.react('🍎')})

        const filter = (reaction, user) => {
            return ['🎹', '🔵', '🥁', '🍎'].includes(reaction.emoji.name) && user.id === msg.author.id;
        };

        let choice = undefined
        let collector = m.createReactionCollector(filter, {max: 1, time: 15000})

        collector.on('collect', (reaction) => {
            switch (reaction.emoji.name) {
                case '🎹':
                    choice = "mania"
                    break;
                case '🔵':
                    choice = "osu"
                    break;
                case '🥁':
                    choice = "taiko"
                    break;
                case '🍎':
                    choice = "catch"
                    break;
            }
            collector.stop(true)
        })

        collector.on('end', () => {
            if (choice == undefined) {
                msg.channel.send('You didn\'t pick any gamemode during the 15sec time limit, please try again')
                resolve(choice = false)
            }
            resolve(choice)
            m.delete()
        })
        
    })
}

module.exports.getOsuProfile = async function (msg, id, mode) {

    let gamemode = ''
    switch (mode) {
        case 'mania':
            gamemode = 3
            break;
        case 'osu':
            gamemode = 0
            break;
        case 'taiko':
            gamemode = 1
            break;
        case 'catch':
            gamemode = 2
            break;
    }

    return osu.user.get(id, gamemode)
        .then((data) => {
            if (!data) return msg.channel.send('No players found with id: ' + id + '\nCheck if the profile link you provided is correct')
            return user = {
                player: {
                    mode: mode,
                    user_id: data.user_id,
                    username: data.username,
                    pp_rank: data.pp_rank,
                    level: data.level,
                    pp_raw: data.pp_raw,
                    accuracy: data.accuracy,
                    count_rank_ss: data.count_rank_ss,
                    count_rank_s: data.count_rank_s,
                    count_rank_a: data.count_rank_a,
                    country: data.country,
                    pp_country_rank: data.pp_country_rank,
                    last_update: Date.now()
                }
            }
        })
        .catch((err) => {
            console.log(err)
            msg.channel.send('An error has occured while fetching your data on the osu API, blame peppy')
        })
}

/**
 * Adds the roles to that member
 * @param {Client} client 
 * @param {GuildMember} gm 
 * @param {Array} roles 
 * @param {String} reason 
 */
module.exports.giveRoles = async function(client, gm, roles) {
    let addRoles = []

    for (i=0; i<roles.length; i++) {
        addRoles.push(await client.roles.get(roles[i]))
    }

    await gm.roles.add(addRoles)
        .catch((err) => {
            console.log("An error has occured when giving roles to: " + gm.user.username + '\n' + err)
        })
}

/**
 * Removes the roles from that member
 * @param {Client} client 
 * @param {GuildMember} gm 
 * @param {Array} roles 
 * @param {String} reason 
 */
module.exports.removeRoles = async function(client, gm, roles) {
    let removeRoles = []

    for (i=0; i<roles.length; i++) {
        removeRoles.push(await client.roles.get(roles[i]))
    }

    await gm.roles.remove(removeRoles)
        .catch((err) => {
            console.log("An error has occured when removing roles to: " + gm.user.username + '\n' + err)
        })
}

/**
 * Adds a new country role
 * @param {Client} client 
 * @param {Message} msg 
 * @param {String} country 
 */
module.exports.addCountryRole = async function(client, msg, country) {
    let template = client.roles.get('BEL')
    
    let infoCh = client.server.channels.cache.find(ch => ch.name = "𝗕𝗼𝘁-𝗜𝗻𝗳𝗼")

    await msg.guild.roles.create({
        data: {
            name: country,
            color: "RANDOM",
            position: 75,
            permissions: template.permissions,
            mentionable: false
        },
        reason: 'A member from a new country has joined'
    })
        .then((data) => {
            client.roles.set(data.name, data)
            console.log("Created role: " + data.name)
            infoCh.send(`A new country role was created: ${data}, please make sure it is correctly set up`)
        })
        .catch((err) => {
            let mod = client.roles.get('Mod')
            console.log(`An error has occured when trying to make "${country}" role: ` + err)
            infoCh(`There was an error when trying to create a new country role (${country}), please make it when you can ${mod}`)
        })

}

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {Object} roles
 * @param {String} roles.country_rank
 * @param {String} roles.country
 * @param {String} roles.mode
 * @param {String} roles.verified
 * @param {GuildMember} member
 */
module.exports.link = async function (client, msg, roles, gm) {

    let currentRoles = []
    gm.roles.cache.each(r => currentRoles.push(r.name))

    if (currentRoles.includes('New user')) {
        await this.removeRoles(client, gm, ['New user'])
    }

    let addRoles = [roles.country, `#${roles.country_rank}`, roles.mode, roles.verified]

    if (roles.country_rank > 50) {
        addRoles.splice(1, 1)
    }

    if (!client.roles.get(roles.country)) {
        await this.addCountryRole(client, msg, roles.country)
    }

    await this.giveRoles(client, gm, addRoles)
    msg.channel.send({
        embed: new MessageEmbed()
            .setDescription('You are now linked and verified, enjoy your stay!')
            .setColor('GREEN')
    })
}