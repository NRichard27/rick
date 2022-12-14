const { SlashCommandBuilder } = require('discord.js')
const { languages, logger } = require('../utils')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(languages.en.commands.skip.command)
        .setNameLocalizations({
            hu: languages.hu.commands.skip.command,
            ru: languages.ru.commands.skip.command,
        })
        .setDescription(languages.en.commands.skip.hint)
        .setDescriptionLocalizations({
            hu: languages.hu.commands.skip.hint,
            ru: languages.ru.commands.skip.hint,
        })
        .setDMPermission(false),
    execute: async (interaction, playlist, lang) => {
        logger.info({
            guild: interaction.guild.id,
            user: interaction.member.user.tag,
            place: 'commands',
            command: 'skip',
        })
        const command = lang.commands.skip

        interaction.reply({
            content: `${
                playlist.skip() ? command.messages.m1 : command.messages.m2
            }`,
            ephemeral: playlist.controller,
        })
    },
}
