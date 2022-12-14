const { SlashCommandBuilder } = require('discord.js')
const {
    joinVoiceChannel,
    VoiceConnectionStatus,
    getVoiceConnection,
} = require('@discordjs/voice')
const { languages, getSong, isConnection, logger } = require('../utils')
const Playlist = require('../playlist')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(languages.en.commands.play.command)
        .setNameLocalizations({
            hu: languages.hu.commands.play.command,
            ru: languages.ru.commands.play.command,
        })
        .setDescription(languages.en.commands.play.hint.message)
        .setDescriptionLocalizations({
            hu: languages.hu.commands.play.hint.message,
            ru: languages.ru.commands.play.hint.message,
        })
        .addStringOption((option) =>
            option
                .setName(languages.en.commands.play.hint.options.o1.name)
                .setNameLocalizations({
                    hu: languages.hu.commands.play.hint.options.o1.name,
                    ru: languages.ru.commands.play.hint.options.o1.name,
                })
                .setDescription(
                    languages.en.commands.play.hint.options.o1.description
                )
                .setDescriptionLocalizations({
                    hu: languages.hu.commands.play.hint.options.o1.description,
                    ru: languages.ru.commands.play.hint.options.o1.description,
                })
                .setRequired(true)
        )
        .setDMPermission(false),
    execute: async (interaction, playlist, lang, client) => {
        logger.info({
            guild: interaction.guild.id,
            user: interaction.member.user.tag,
            place: 'commands',
            command: 'play',
        })
        const command = lang.commands.play

        const link = interaction.options.getString(command.hint.options.o1.name)

        if (!interaction.member.voice.channel) {
            logger.info({
                guild: interaction.guild.id,
                user: interaction.member.user.tag,
                place: 'commands',
                command: 'play',
                action: 'need to be in channel',
            })
            return interaction.reply({
                content: command.messages.m1,
                ephemeral: true,
            })
        }

        let song = await getSong(link)
        if (!song) {
            logger.info({
                guild: interaction.guild.id,
                user: interaction.member.user.tag,
                place: 'commands',
                command: 'play',
                action: 'no song',
            })
            return interaction.reply({
                content: command.messages.m2,
                ephemeral: true,
            })
        }
        song.author = interaction.member.user.tag

        if (!isConnection(interaction.guild.id)) {
            logger.info({
                guild: interaction.guild.id,
                user: interaction.member.user.tag,
                place: 'commands',
                command: 'play',
                action: 'no conn',
            })
            if (
                !interaction.member.voice.channel
                    .permissionsFor(client.user)
                    .toArray()
                    .includes('ViewChannel')
            ) {
                logger.info({
                    guild: interaction.guild.id,
                    user: interaction.member.user.tag,
                    place: 'commands',
                    command: 'play',
                    action: 'cant view',
                })
                return interaction.reply({
                    content: lang.errors.e6,
                    ephemeral: false,
                })
            }

            if (
                !interaction.member.voice.channel
                    .permissionsFor(client.user)
                    .toArray()
                    .includes('Connect')
            ) {
                logger.info({
                    guild: interaction.guild.id,
                    user: interaction.member.user.tag,
                    place: 'commands',
                    command: 'play',
                    action: 'cant connect',
                })
                return interaction.reply({
                    content: lang.errors.e7,
                    ephemeral: false,
                })
            }

            if (
                !interaction.member.voice.channel
                    .permissionsFor(client.user)
                    .toArray()
                    .includes('Speak')
            ) {
                logger.info({
                    guild: interaction.guild.id,
                    user: interaction.member.user.tag,
                    place: 'commands',
                    command: 'play',
                    action: 'cant speak',
                })
                return interaction.reply({
                    content: lang.errors.e8,
                    ephemeral: false,
                })
            }

            client.playlists.set(
                interaction.guild.id,
                new Playlist(interaction.guild.id)
            )

            playlist = client.playlists.get(interaction.guild.id)

            const channel = interaction.member.voice.channel

            let connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            })

            connection.on(VoiceConnectionStatus.Disconnected, () => {
                logger.info({
                    guild: interaction.guild.id,
                    user: interaction.member.user.tag,
                    place: 'commands',
                    command: 'play',
                    action: 'manually disconnected',
                })
                playlist.stop()

                let conn = getVoiceConnection(interaction.guild.id)
                conn.destroy()

                playlist.reset()

                client.playlists.delete(playlist.id)
            })

            playlist.play(song)

            logger.info({
                guild: interaction.guild.id,
                user: interaction.member.user.tag,
                place: 'commands',
                command: 'play',
                action: 'playing',
            })

            return interaction.reply({
                content: `${command.messages.m3} ${song.link}`,
                ephemeral: false,
            })
        }

        if (playlist.idle()) {
            playlist.play(song)
        } else {
            playlist.add(song)
        }

        logger.info({
            guild: interaction.guild.id,
            user: interaction.member.user.tag,
            place: 'commands',
            command: 'play',
            action: 'playing2',
        })
        interaction.reply({
            content: `${command.messages.m3} ${song.link}`,
            ephemeral: false,
        })
    },
}
