const { Client } = require("discord.js")

/**
 * Initialize the wishes list
 * @param {Client} client 
 * @returns 
 */
module.exports.init = async function(client) {
    if (!client.zayyken) {
        let zayyken = await client.users.fetch("201671692647399424", true, true)
        client.zayyken = {
            user: zayyken,
            wishes: []
        }
    } 
    return client.zayyken
}