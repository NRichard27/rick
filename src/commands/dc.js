const { SlashCommandBuilder } = require('discord.js')
const { getVoiceConnection } = require('@discordjs/voice')
const { languages, logger } = require('../utils')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(languages.en.commands.dc.command)
        .setNameLocalizations({
            hu: languages.hu.commands.dc.command,
            ru: languages.ru.commands.dc.command,
        })
        .setDescription(languages.en.commands.dc.hint)
        .setDescriptionLocalizations({
            hu: languages.hu.commands.dc.hint,
            ru: languages.ru.commands.dc.hint,
        })
        .setDMPermission(false),
    execute: async (interaction, playlist, lang, client) => {
        logger.info({
            guild: interaction.guild.id,
            user: interaction.member.user.tag,
            place: 'commands',
            command: 'dc',
        })
        playlist.stop()

        let connection = getVoiceConnection(playlist.id)
        connection.destroy()

        playlist.reset()

        client.playlists.delete(playlist.id)

        interaction.reply({
            content: lang.commands.dc.messages.m1,
            ephemeral: false,
        })
    },
}
