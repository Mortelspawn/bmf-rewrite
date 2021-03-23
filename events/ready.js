const prefix = process.env.PREFIX

async function addRole(client, name) {
    let role = await client.server.roles.cache.find(r => r.name == name)
    client.roles.set(name, role)
    console.log(`Found role: ${name} - ${role}`)
}

module.exports = {
    name: 'ready',
    once: true,
    execute: async function (client) {
        
        client.server = await client.guilds.fetch('716414272715882547', true, true)
        client.server.roles.cache.each(r => addRole(client, r.name))

        client.user.setActivity(`Use !!help`, {type: 'PLAYING'})
        let myself = await client.users.fetch("102490915116945408", true, true)
        myself.createDM()
            .then((dm) => {
                dm.send(`The bot has successfully rebooted [${Math.random().toString(36).substring(7)}]`)
            })
        console.log(`Logged in with ${client.user.tag}`)
    }
}