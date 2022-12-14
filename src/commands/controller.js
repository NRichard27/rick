const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js')
const { languages, getControllerEmbed, checkPermissions } = require('../utils')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(languages.en.commands.controller.command)
        .setNameLocalizations({
            hu: languages.hu.commands.controller.command,
            ru: languages.ru.commands.controller.command,
        })
        .setDescription(languages.en.commands.controller.hint)
        .setDescriptionLocalizations({
            hu: languages.hu.commands.controller.hint,
            ru: languages.ru.commands.controller.hint,
        })
        .setDMPermission(false),
    execute: async (interaction, playlist, lang, client) => {
        const command = lang.commands.controller

        if (playlist.controller) {
            return interaction.reply({
                content: command.messages.m3,
                ephemeral: true,
            })
        }

        const permissions = checkPermissions(
            ['ViewChannel', 'SendMessages', 'ManageMessages', 'EmbedLinks'],
            interaction.channel,
            client.user,
            [lang.errors.e9, lang.errors.e10, lang.errors.e11, lang.errors.e12]
        )

        if (permissions != true) {
            return interaction.reply({
                content: permissions,
                ephemeral: false,
            })
        }

        let playerControls = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('prev_btn')
                .setLabel('⏪')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('start_btn')
                .setLabel('▶️')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('stop_btn')
                .setLabel('⏹️')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('skip_btn')
                .setLabel('⏩')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('loop_btn')
                .setLabel('🔁')
                .setStyle(ButtonStyle.Primary)
        )

        let botControls = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('play_btn')
                .setLabel('➕')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('dc_btn')
                .setLabel('✖️')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('close_btn')
                .setLabel(command.messages.m1)
                .setStyle(ButtonStyle.Secondary)
        )

        playlist.controller = true

        await interaction.reply({
            embeds: [
                getControllerEmbed(playlist, lang, interaction.guild.iconURL()),
            ],
            ephemeral: false,
            components: [playerControls, botControls],
        })
    },
}
