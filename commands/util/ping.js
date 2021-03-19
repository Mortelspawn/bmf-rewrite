const Discord = require('discord.js')

module.exports = {
    name: 'ping',
    description: "Ping!",

    execute(client, msg, args) {

        const masterMsg = msg
        
        msg.channel.send("Pinging...")
                .then(async (msg) => {
                    msg.delete({timeout: 1000})
                    let ping = msg.createdTimestamp - masterMsg.createdTimestamp
                    await msg.channel.send({
                        embed: new Discord.MessageEmbed()
                            .setTitle("🏓Pong!")
                            .setDescription(`**Bot**\n${ping}ms.\n**API**\n${Math.round(msg.client.ws.ping)}ms.`)
                            .setColor("RANDOM")
                    });
                })
    }

}