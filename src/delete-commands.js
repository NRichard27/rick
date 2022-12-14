require('dotenv').config()
const { REST, Routes } = require('discord.js')

const rest = new REST({ version: '10' }).setToken(process.env.DC_BOT_TOKEN)

function delete_commands(guildId, commandId) {
    if (guildId) {
        if (commandId) {
            // If guildId and commandId are set, delete the command specified by commandId of the guild specified by guildId.
            rest.delete(
                Routes.applicationGuildCommand(
                    process.env.DC_APP_ID,
                    guildId,
                    commandId
                )
            )
                .then(() => console.log('Successfully deleted guild command'))
                .catch(console.error)
        } else {
            // If guildId is set but commandId is not, delete all commands of the guild specified by guildId.
            rest.put(
                Routes.applicationGuildCommands(process.env.DC_APP_ID, guildId),
                { body: [] }
            )
                .then(() =>
                    console.log('Successfully deleted all guild commands.')
                )
                .catch(console.error)
        }
    } else {
        if (commandId) {
            // If guildId is not set but commandId is, delete the command specified by commandId globally.
            rest.delete(
                Routes.applicationCommand(process.env.DC_APP_ID, commandId)
            )
                .then(() =>
                    console.log('Successfully deleted application command')
                )
                .catch(console.error)
        } else {
            // If guildId and commandId are not set, delete all commands globally.
            rest.put(Routes.applicationCommands(process.env.DC_APP_ID), {
                body: [],
            })
                .then(() =>
                    console.log(
                        'Successfully deleted all application commands.'
                    )
                )
                .catch(console.error)
        }
    }
}

// If guildId and commandId are set, delete the command specified by commandId of the guild specified by guildId:
//delete_commands('guildIdHere', 'commandIdHere')

// If guildId is set but commandId is not, delete all commands of the guild specified by guildId:
//delete_commands('guildIdHere')

// If guildId is not set but commandId is, delete the command specified by commandId globally:
//delete_commands(undefined, 'commandIdHere')

// If guildId and commandId are not set, delete all commands globally:
//delete_commands()
