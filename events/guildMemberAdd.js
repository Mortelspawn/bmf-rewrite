const { MessageEmbed, GuildMember } = require("discord.js")
const prefix = process.env.PREFIX

module.exports = {
    name: 'guildMemberAdd',

    execute: async function (member) {

        let defaultCh = member.guild.channels.cache.find(ch => ch.name === "𝗚𝗲𝗻𝗲𝗿𝗮𝗹") // "𝗚𝗲𝗻𝗲𝗿𝗮𝗹" "test-bmf-bot-spam"
        member.createDM()
            .then(async (dm) => {

                await dm.send({
                    embed: new MessageEmbed()
                        .setTitle(`Welcome ${member.displayName} !\n\u200B`)
                        .setDescription(' - In order to get verified and get access the the rest of the server, please choose one of the following options: \n\u200B')
                        .addField(`
                            1. Link with your osu! profile\n\u200B
                             - You can link your osu! profile with:\n\`${prefix}link [profile-link]\`\n
                            i.e: \`${prefix}link https://osu.ppy.sh/users/5331420\`
                        `)
                        .addField(`
                            2. Not from osu! ?\n\u200B
                            - If you are not an osu! player then do:\n\`${prefix}outsider\`\n
                        `)
                })

                defaultCh.send(
                    `Welcome **${member.displayName}** to the BM&F server !`+
                    "\nPlease check your DMs and follow the intructions to get verified"
                )
            })
    }
}