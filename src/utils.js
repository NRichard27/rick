const playdl = require('play-dl')

const { getVoiceConnection } = require('@discordjs/voice')

const hu = require('../languages/hu.json')
const ru = require('../languages/ru.json')
const en = require('../languages/en.json')

const pino = require('pino')
const logger = pino()

let getSong = async (link) => {
    let youtube = playdl.yt_validate(link)

    if (youtube && youtube != 'search') {
        let info = await playdl.video_info(link)

        return {
            link: info.video_details.url,
            title: info.video_details.title,
        }
    }

    return undefined
}

let transformArray = (arr, mod) => {
    let result = undefined
    if (mod > 0) {
        result = []
        for (let i = 0; i < arr.length; i += mod) {
            result.push(arr.slice(i, i + mod))
        }
    }
    return result
}

let getLanguage = (locale) => {
    if (locale == 'hu') {
        return hu
    }

    if (locale == 'ru') {
        return ru
    }

    return en
}

let isConnection = (guildId) => {
    let connection = getVoiceConnection(guildId)
    return connection ? true : false
}

module.exports = {
    getSong,
    transformArray,
    getLanguage,
    isConnection,
    playdl,
    logger,
    languages: {
        hu,
        ru,
        en,
    },
}
