const { Client, Message } = require("discord.js")

module.exports = {
    name: 'query',
    dev: true,

    /**
     * Sends a query to the db
     * @param {Client} client 
     * @param {Message} msg 
     * @param {Array} args 
     */
    execute: async function(client, msg, args) {

        switch (args[0]) {

            case 'select':
                let select = await client.sql`SELECT * FROM users WHERE discord_id = ${msg.author.id}`
                console.log(select[0].data)
                break;
            
            case 'insert':
                let user = await client.sql`SELECT * FROM users WHERE discord_id = ${msg.author.id}`

                user[0].data.player.last_update = 1616529600000

                let values = {
                    data: JSON.stringify(user[0].data, null, 0)
                }

                await client.sql`
                    UPDATE users 
                    SET ${client.sql(values, 'data')}
                    WHERE discord_id = ${msg.author.id}
                `
                break;
            
            default:
                let test = await client.sql`DELETE FROM users WHERE discord_id = ${msg.author.id}` 
                console.log(test)

        }
    }
}