require('dotenv').config()
const fs = require('node:fs')
const path = require('node:path')
const {
    Client,
    Events,
    Collection,
    GatewayIntentBits,
    ActivityType,
} = require('discord.js')
const { commandHandler } = require('./interactions')
const { logger } = require('./utils')

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
})

client.playlists = new Collection()
client.commands = new Collection()

const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command)
    } else {
        logger.warn(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        )
    }
}

client.once(Events.ClientReady, (c) => {
    client.user.setActivity('/play', { type: ActivityType.Listening })

    logger.info(`Ready! Logged in as ${c.user.tag}`)
})

client.on(Events.InteractionCreate, async (interaction) => {
    logger.info({
        guild: interaction.guild.id,
        user: interaction.member.user.tag,
        place: 'index',
        action: 'interaction',
    })

    if (interaction.isChatInputCommand()) {
        return commandHandler(interaction, client)
    }
})

client.login(process.env.DC_BOT_TOKEN)
