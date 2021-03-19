const testData = require('./../../../BMF-Bot/users/102490915116945408.json')

module.exports = {
    name: 'query',
    dev: true,

    execute: async function(client, msg, args) {
        // let query = args.join(" ").trim()

        // let query = `UPDATE users SET discord -> a[0] = 'test' WHERE discord -> a ->> test = test`

        // let data = testData

        // let query = {
        //     text: 'INSERT INTO users(discord_id, data) VALUES($1, $2)',
        //     values: [msg.author.id, testData]
        // }

        // testData.discord.username = "This_is_a_test"

        // let query = {
        //     text: `UPDATE users SET data = $1 WHERE discord_id = ${msg.author.id}`,
        //     values: [testData]
        // }

        // let query = {
        //     text: `SELECT * FROM users WHERE discord_id = ${msg.author.id}`
        // }

        let test = await client.sql`DELETE FROM users WHERE discord_id = 717016159945228288` 
        console.log(test)
    }
}