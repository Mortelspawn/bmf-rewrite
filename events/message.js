const prefix = process.env.PREFIX

module.exports = {
    name: 'message',
    execute: async function(msg, client) {
        
        if (!msg.content.startsWith(prefix) || msg.author.bot) return;

        const args = msg.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${msg.author}!`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }

            return msg.channel.send(reply);
        }

        if (command.dev && msg.author.id != '716414272715882547') {
            return msg.channel.send('Only Mortelspawn_ can use that command')
        }

        // msg.channel.startTyping()

        try {
            command.execute(client, msg, args);
        } catch (error) {
            console.error(error);
            msg.reply('there was an error trying to execute that command!');
        }

        // msg.channel.stopTyping()
    }
}