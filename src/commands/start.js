const { SlashCommandBuilder } = require('discord.js')
const { languages, logger } = require('../utils')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(languages.en.commands.start.command)
        .setNameLocalizations({
            hu: languages.hu.commands.start.command,
            ru: languages.ru.commands.start.command,
        })
        .setDescription(languages.en.commands.start.hint)
        .setDescriptionLocalizations({
            ru: languages.hu.commands.start.hint,
            hu: languages.ru.commands.start.hint,
        })
        .setDMPermission(false),
    execute: async (interaction, playlist, lang) => {
        logger.info({
            guild: interaction.guild.id,
            user: interaction.member.user.tag,
            place: 'commands',
            command: 'start',
        })
        playlist.start()
        interaction.reply({
            content: lang.commands.start.messages.m1,
            ephemeral: playlist.controller,
        })
    },
}
