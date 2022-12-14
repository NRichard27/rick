const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
} = require('discord.js')
const { getVoiceConnection } = require('@discordjs/voice')
const {
    getLanguage,
    isConnection,
    getControllerEmbed,
    getSong,
    checkPermissions,
    logger,
} = require('./utils')

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
            action: 'command: no command found',
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
                action: 'command: rick not in voice',
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
                action: 'command: person not in voice',
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
                action: 'command: person not in same voice',
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

let buttonHandler = async (interaction, client) => {
    logger.info({
        guild: interaction.guild.id,
        user: interaction.member.user.tag,
        place: 'interactions',
        action: 'button',
    })

    const lang = getLanguage(interaction.locale)
    let playlist = client.playlists.get(interaction.guildId)

    const permissions = checkPermissions(
        ['ViewChannel', 'ManageMessages', 'EmbedLinks'],
        interaction.channel,
        client.user,
        [lang.errors.e9, lang.errors.e11, lang.errors.e12]
    )

    if (permissions != true) {
        logger.info({
            guild: interaction.guild.id,
            user: interaction.member.user.tag,
            place: 'interactions',
            action: 'button: permission error',
        })

        return interaction.reply({
            content: permissions,
            ephemeral: false,
        })
    }

    if (!isConnection(interaction.guild.id)) {
        logger.info({
            guild: interaction.guild.id,
            user: interaction.member.user.tag,
            place: 'interactions',
            action: 'button: delete old controller',
        })
        return interaction.message.delete()
    }

    if (!interaction.member.voice.channel) {
        logger.info({
            guild: interaction.guild.id,
            user: interaction.member.user.tag,
            place: 'interactions',
            action: 'button: person not in voice',
        })
        return interaction.reply({
            content: lang.errors.e3,
            ephemeral: true,
        })
    }

    if (
        interaction.guild.members.cache.get(client.user.id).voice.channelId !=
        interaction.member.voice.channelId
    ) {
        logger.info({
            guild: interaction.guild.id,
            user: interaction.member.user.tag,
            place: 'interactions',
            action: 'button: person not in same voice',
        })
        return interaction.reply({
            content: lang.errors.e4,
            ephemeral: true,
        })
    }

    if (interaction.customId == 'play_btn') {
        logger.info({
            guild: interaction.guild.id,
            user: interaction.member.user.tag,
            place: 'interactions',
            action: 'button: play_btn',
        })

        const modal = new ModalBuilder()
            .setCustomId('addSong')
            .setTitle(lang.modals.addModal.title)
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('linkInput')
                        .setLabel(lang.modals.addModal.label)
                        .setPlaceholder(lang.modals.addModal.placeholder)
                        .setStyle(TextInputStyle.Short)
                        .setValue('')
                        .setRequired(true)
                )
            )

        return interaction.showModal(modal)
    }

    await interaction.deferUpdate()

    if (interaction.customId == 'close_btn') {
        logger.info({
            guild: interaction.guild.id,
            user: interaction.member.user.tag,
            place: 'interactions',
            action: 'button: close_btn',
        })

        playlist.controller = false

        interaction.message.edit({
            content: lang.commands.controller.messages.m2,
            components: [],
            embeds: [],
        })

        return
    }

    if (interaction.customId == 'dc_btn') {
        logger.info({
            guild: interaction.guild.id,
            user: interaction.member.user.tag,
            place: 'interactions',
            action: 'button: dc_btn',
        })

        interaction.message.edit({
            content: lang.commands.controller.messages.m2,
            components: [],
            embeds: [],
        })

        playlist.stop()

        let connection = getVoiceConnection(playlist.id)
        connection.destroy()

        playlist.reset()

        client.playlists.delete(playlist.id)

        return
    }

    switch (interaction.customId) {
        case 'prev_btn':
            logger.info({
                guild: interaction.guild.id,
                user: interaction.member.user.tag,
                place: 'interactions',
                action: 'button: prev_btn',
            })

            playlist.prev()
            break
        case 'start_btn':
            logger.info({
                guild: interaction.guild.id,
                user: interaction.member.user.tag,
                place: 'interactions',
                action: 'button: start_btn',
            })

            playlist.start()
            break
        case 'stop_btn':
            logger.info({
                guild: interaction.guild.id,
                user: interaction.member.user.tag,
                place: 'interactions',
                action: 'button: stop_btn',
            })

            playlist.stop()
            break
        case 'skip_btn':
            logger.info({
                guild: interaction.guild.id,
                user: interaction.member.user.tag,
                place: 'interactions',
                action: 'button: skip_btn',
            })

            playlist.skip()
            break
        case 'loop_btn':
            logger.info({
                guild: interaction.guild.id,
                user: interaction.member.user.tag,
                place: 'interactions',
                action: 'button: loop_btn',
            })

            playlist.loop()
            break
    }

    interaction.message.edit({
        embeds: [
            getControllerEmbed(playlist, lang, interaction.guild.iconURL()),
        ],
    })
}

let modalHandler = async (interaction, client) => {
    logger.info({
        guild: interaction.guild.id,
        user: interaction.member.user.tag,
        place: 'interactions',
        action: 'modal',
    })

    const lang = getLanguage(interaction.locale)
    let playlist = client.playlists.get(interaction.guildId)

    if (interaction.customId == 'addSong') {
        logger.info({
            guild: interaction.guild.id,
            user: interaction.member.user.tag,
            place: 'interactions',
            action: 'modal: addSong',
        })
        const link = interaction.fields.getTextInputValue('linkInput')

        let song = await getSong(link)
        if (!song) {
            logger.info({
                guild: interaction.guild.id,
                user: interaction.member.user.tag,
                place: 'interactions',
                action: 'modal: addSong: no song',
            })

            return interaction.reply({
                content: lang.commands.play.messages.m2,
                ephemeral: true,
            })
        }
        song.author = interaction.member.user.tag

        if (playlist.idle()) {
            playlist.play(song)
        } else {
            playlist.add(song)
        }

        interaction.message.edit({
            embeds: [
                getControllerEmbed(playlist, lang, interaction.guild.iconURL()),
            ],
        })

        await interaction.reply({
            content: `${lang.commands.play.messages.m3} ${song.link}`,
            ephemeral: true,
        })
    }
}

module.exports = {
    commandHandler,
    buttonHandler,
    modalHandler,
}
