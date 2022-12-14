const { SlashCommandBuilder } = require('discord.js')
const { languages, logger } = require('../utils')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(languages.en.commands.prev.command)
        .setNameLocalizations({
            hu: languages.hu.commands.prev.command,
            ru: languages.ru.commands.prev.command,
        })
        .setDescription(languages.en.commands.prev.hint)
        .setDescriptionLocalizations({
            hu: languages.hu.commands.prev.hint,
            ru: languages.ru.commands.prev.hint,
        })
        .setDMPermission(false),
    execute: async (interaction, playlist, lang) => {
        logger.info({
            guild: interaction.guild.id,
            user: interaction.member.user.tag,
            place: 'commands',
            command: 'prev',
        })
        const command = lang.commands.prev

        interaction.reply({
            content: `${
                playlist.prev() ? command.messages.m1 : command.messages.m2
            }`,
            ephemeral: playlist.controller,
        })
    },
}
