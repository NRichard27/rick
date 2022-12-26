const playdl = require('play-dl')

playdl.setToken({
    spotify: {
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
        market: 'US',
    },
})

const { EmbedBuilder } = require('discord.js')
const { getVoiceConnection } = require('@discordjs/voice')

const hu = require('../languages/hu.json')
const ru = require('../languages/ru.json')
const en = require('../languages/en.json')

const pino = require('pino')
const logger = pino()

const getSong = async (link) => {
    if (playdl.is_expired()) {
        await playdl.refreshToken()
    }

    let youtube = playdl.yt_validate(link)

    if (youtube == 'video') {
        let info = await playdl.video_info(link)

        return {
            link: info.video_details.url,
            title: info.video_details.title,
        }
    }

    let spotify = playdl.sp_validate(link)

    if (spotify == 'track') {
        let info = await playdl.spotify(link)

        let searched = await playdl.search(
            `${info.artists[0].name} ${info.name}`,
            {
                limit: 1,
            }
        )

        return {
            link: searched[0].url,
            title: `${info.artists[0].name} ${info.name}`,
        }
    }

    return undefined
}

const transformArray = (arr, mod) => {
    let result = undefined
    if (mod > 0) {
        result = []
        for (let i = 0; i < arr.length; i += mod) {
            result.push(arr.slice(i, i + mod))
        }
    }
    return result
}

const getLanguage = (locale) => {
    if (locale == 'hu') {
        return hu
    }

    if (locale == 'ru') {
        return ru
    }

    return en
}

const isConnection = (guildId) => {
    let connection = getVoiceConnection(guildId)
    return connection ? true : false
}

const getControllerEmbed = (playlist, lang, icon) => {
    let songs = ''
    let authors = ''

    if (playlist.has_prev()) {
        let song = playlist.list[playlist.current - 1]
        songs += `${lang.controller.messages.m1}: [${song.title
            .substring(0, 30)
            .trim()}${song.title.length > 30 ? '...' : ''}](${song.link})\n`
        authors += `${song.author}\n`
    }

    let currentSong = playlist.list[playlist.current]
    songs += `:notes: **${lang.controller.messages.m2}: [${currentSong.title
        .substring(0, 30)
        .trim()}${currentSong.title.length > 30 ? '...' : ''}](${
        currentSong.link
    })**\n`
    authors += `**${currentSong.author}**\n`

    if (playlist.has_next()) {
        let song = playlist.list[playlist.current + 1]
        songs += `${lang.controller.messages.m3}: [${song.title
            .substring(0, 30)
            .trim()}${song.title.length > 30 ? '...' : ''}](${song.link})`
        authors += `${song.author}\n`
    }

    let embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`**${lang.controller.title}**`)
        .setThumbnail(icon)
        .addFields({
            name: lang.commands.list.messages.m2,
            value: playlist.looping
                ? lang.commands.list.messages.m3
                : lang.commands.list.messages.m4,
        })
        .addFields({
            name: lang.commands.list.messages.m5,
            value: playlist.paused
                ? lang.commands.list.messages.m6
                : lang.commands.list.messages.m7,
        })
        .addFields(
            {
                name: lang.commands.list.messages.m8,
                value: songs,
                inline: true,
            },
            {
                name: lang.commands.list.messages.m9,
                value: authors,
                inline: true,
            }
        )

    return embed
}

const checkPermissions = (permissions, channel, user, messages) => {
    for (const perm of permissions) {
        if (!channel.permissionsFor(user).toArray().includes(perm)) {
            return messages[permissions.indexOf(perm)]
        }
    }

    return true
}

module.exports = {
    getSong,
    transformArray,
    getLanguage,
    isConnection,
    getControllerEmbed,
    checkPermissions,
    playdl,
    logger,
    languages: {
        hu,
        ru,
        en,
    },
}
