require('dotenv').config()
const { REST, Routes } = require('discord.js')
const fs = require('node:fs')
const path = require('node:path')

const commands = []

const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    commands.push(command.data.toJSON())
}

const rest = new REST({ version: '10' }).setToken(process.env.DC_BOT_TOKEN)

function deploy_commands(guildId) {
    if (guildId) {
        // If guildId is set, deploy all commands only to the guild specified by guildId.
        rest.put(
            Routes.applicationGuildCommands(process.env.DC_APP_ID, guildId),
            { body: commands }
        )
            .then(() =>
                console.log('Successfully deployed all guild commands.')
            )
            .catch(console.error)
    } else {
        // If guildId is not set, deploy all commands globally.
        rest.put(Routes.applicationCommands(process.env.DC_APP_ID), {
            body: commands,
        })
            .then(() =>
                console.log('Successfully deployed all application commands.')
            )
            .catch(console.error)
    }
}

// If guildId is set, deploy all commands only to the guild specified by guildId:
//deploy_commands('guildIdHere')

// If guildId is not set, deploy all commands globally:
deploy_commands()
