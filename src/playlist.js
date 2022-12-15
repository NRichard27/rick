const {
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    AudioPlayerStatus,
} = require('@discordjs/voice')
const { playdl, logger } = require('./utils')

module.exports = function Playlist(guildId) {
    this.id = guildId
    this.list = []
    this.current = 0
    this.player = createAudioPlayer()
    this.looping = false
    this.paused = false
    this.controller = false
    this.controllerMsg = { messageId: '', channelId: '' }

    this.player.on(AudioPlayerStatus.Idle, async () => {
        if (!this.looping) {
            logger.info({
                place: 'playlist',
                action: 'auto skip',
            })
            this.skip()
        } else {
            logger.info({
                place: 'playlist',
                action: 'auto play',
            })
            this.play()
        }
    })

    this.add = (song) => {
        logger.info({
            place: 'playlist',
            action: 'add',
        })
        this.list.push(song)
    }

    this.play = async (song) => {
        logger.info({
            place: 'playlist',
            action: 'play',
        })
        let connection = getVoiceConnection(this.id)

        this.player.pause()

        if (song) {
            this.list.push(song)
            this.current = this.list.length - 1
        }

        let stream = await playdl.stream(this.list[this.current].link)

        let resource = createAudioResource(stream.stream, {
            inputType: stream.type,
        })

        this.player.play(resource)

        connection.subscribe(this.player)
    }

    this.has_prev = () => {
        return this.list[this.current - 1] != undefined
    }

    this.prev = () => {
        logger.info({
            place: 'playlist',
            action: 'prev',
        })
        if (this.has_prev()) {
            this.current -= 1
            this.play()
            return true
        } else {
            return false
        }
    }

    this.has_next = () => {
        return this.list[this.current + 1] != undefined
    }

    this.skip = () => {
        logger.info({
            place: 'playlist',
            action: 'skip',
        })
        if (this.has_next()) {
            this.current += 1
            this.play()
            return true
        } else {
            return false
        }
    }

    this.start = () => {
        logger.info({
            place: 'playlist',
            action: 'start',
        })
        if (!this.paused) return
        this.player.unpause()
        this.paused = false
    }

    this.stop = () => {
        logger.info({
            place: 'playlist',
            action: 'stop',
        })
        if (this.paused) return
        this.player.pause()
        this.paused = true
    }

    this.loop = () => {
        logger.info({
            place: 'playlist',
            action: 'loop',
        })
        this.looping = !this.looping
        return this.looping
    }

    this.idle = () => {
        return this.player.state.status == 'idle'
    }

    this.reset = () => {
        logger.info({
            place: 'playlist',
            action: 'reset',
        })
        this.list = []
        this.current = 0
        this.player.stop()
        this.player = 0
        this.looping = false
        this.paused = false
        this.controller = false
        this.controllerMsg = { messageId: '', channelId: '' }
    }
}
