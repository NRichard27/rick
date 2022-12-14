const { getLanguage, isConnection, logger } = require('./utils')

let commandHandler = async (interaction, client) => {
    logger.info({
        guild: interaction.guild.id,
        user: interaction.member.user.tag,
        place: 'interactions',
        action: 'command',
    })

    const command = interaction.client.commands.get(interaction.commandName)
    const lang = getLanguage(interaction.locale)

    let playlist = client.playlists.get(interaction.guildId)

    if (!command) {
        logger.info({
            guild: interaction.guild.id,
            user: interaction.member.user.tag,
            place: 'interactions',
            action: 'no command found',
        })
        return interaction.reply({
            content: lang.errors.e1,
            ephemeral: true,
        })
    }

    if (
        command.data.name !== lang.commands.play.command &&
        command.data.name !== lang.commands.devinfo.command
    ) {
        if (!isConnection(interaction.guild.id)) {
            logger.info({
                guild: interaction.guild.id,
                user: interaction.member.user.tag,
                place: 'interactions',
                action: 'rick not in voice',
            })
            return interaction.reply({
                content: lang.errors.e2,
                ephemeral: true,
            })
        }

        if (!interaction.member.voice.channel) {
            logger.info({
                guild: interaction.guild.id,
                user: interaction.member.user.tag,
                place: 'interactions',
                action: 'person not in voice',
            })
            return interaction.reply({
                content: lang.errors.e3,
                ephemeral: true,
            })
        }

        if (
            interaction.guild.members.cache.get(client.user.id).voice
                .channelId != interaction.member.voice.channelId
        ) {
            logger.info({
                guild: interaction.guild.id,
                user: interaction.member.user.tag,
                place: 'interactions',
                action: 'person not in same voice',
            })
            return interaction.reply({
                content: lang.errors.e4,
                ephemeral: true,
            })
        }
    }

    try {
        await command.execute(interaction, playlist, lang, client)
    } catch (error) {
        await interaction.reply({
            content: lang.errors.e1,
            ephemeral: true,
        })
    }
}

module.exports = {
    commandHandler,
}
