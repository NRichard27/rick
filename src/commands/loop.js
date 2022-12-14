const { SlashCommandBuilder } = require('discord.js')
const { languages, logger } = require('../utils')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(languages.en.commands.loop.command)
        .setNameLocalizations({
            hu: languages.hu.commands.loop.command,
            ru: languages.ru.commands.loop.command,
        })
        .setDescription(languages.en.commands.loop.hint)
        .setDescriptionLocalizations({
            hu: languages.hu.commands.loop.hint,
            ru: languages.ru.commands.loop.hint,
        })
        .setDMPermission(false),
    execute: async (interaction, playlist, lang) => {
        logger.info({
            guild: interaction.guild.id,
            user: interaction.member.user.tag,
            place: 'commands',
            command: 'loop',
        })
        const command = lang.commands.loop

        interaction.reply({
            content: `${
                playlist.loop() ? command.messages.m1 : command.messages.m2
            }`,
            ephemeral: false,
        })
    },
}
