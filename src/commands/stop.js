const { SlashCommandBuilder } = require('discord.js')
const { languages, logger } = require('../utils')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(languages.en.commands.stop.command)
        .setNameLocalizations({
            hu: languages.hu.commands.stop.command,
            ru: languages.ru.commands.stop.command,
        })
        .setDescription(languages.en.commands.stop.hint)
        .setDescriptionLocalizations({
            hu: languages.hu.commands.stop.hint,
            ru: languages.ru.commands.stop.hint,
        })
        .setDMPermission(false),
    execute: async (interaction, playlist, lang) => {
        logger.info({
            guild: interaction.guild.id,
            user: interaction.member.user.tag,
            place: 'commands',
            command: 'stop',
        })
        playlist.stop()
        interaction.reply({
            content: lang.commands.stop.messages.m1,
            ephemeral: playlist.controller,
        })
    },
}
