const { SlashCommandBuilder } = require('discord.js')
const { getVoiceConnection } = require('@discordjs/voice')
const { languages, logger, checkPermissions } = require('../utils')

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

        if (playlist.controllerMsg.messageId != '') {
            logger.info({
                guild: interaction.guild.id,
                user: interaction.member.user.tag,
                place: 'commands',
                command: 'dc',
                action: 'deleted controller',
            })

            const channel = interaction.guild.channels.cache.get(
                playlist.controllerMsg.channelId
            )

            const permissions = checkPermissions(
                ['ViewChannel', 'ManageMessages', 'ReadMessageHistory'],
                channel,
                client.user,
                ['', '', '']
            )

            if (permissions == true) {
                let message = await channel.messages.fetch(
                    playlist.controllerMsg.messageId
                )

                message.edit({
                    content: lang.commands.controller.messages.m2,
                    components: [],
                    embeds: [],
                })
            }
        }

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
