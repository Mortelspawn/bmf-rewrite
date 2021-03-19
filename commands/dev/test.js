const { MessageEmbed } = require('discord.js')
const prefix = process.env.PREFIX

module.exports = {
    name: 'test',
    dev: true,

    execute: async function(client, msg, args) {
        msg.channel.send({
            embed: new MessageEmbed()
                .setTitle(`Welcome ${msg.author.username} !\n\u200B`)
                .setDescription(' - In order to get verified and get access the the rest of the server, please choose one of the following options: \n\u200B')
                .addField(
                    "1. Link with your osu! profile\n\u200B",
                    ` - You can link your osu! profile with: \`${prefix}link [profile-link]\`\n` +
                    `i.e: \`${prefix}link https://osu.ppy.sh/users/5331420\``
                )
                .addField(
                    "2. Not from osu! ?\n\u200B",
                    `- If you are not an osu! player then do: \`${prefix}outsider\`\n`
                )
                .setColor('GOLD')
        })
    }
}