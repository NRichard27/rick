const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { languages, transformArray, logger } = require('../utils')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(languages.en.commands.list.command)
        .setNameLocalizations({
            hu: languages.hu.commands.list.command,
            ru: languages.ru.commands.list.command,
        })
        .setDescription(languages.en.commands.list.hint)
        .setDescriptionLocalizations({
            hu: languages.hu.commands.list.hint,
            ru: languages.ru.commands.list.hint,
        })
        .setDMPermission(false),
    execute: async (interaction, playlist, lang) => {
        logger.info({
            guild: interaction.guild.id,
            user: interaction.member.user.tag,
            place: 'commands',
            command: 'list',
        })
        const command = lang.commands.list

        let embeds = []
        let lists = transformArray(playlist.list, 7)

        let mainEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`**${command.messages.m1}**`)
            .setThumbnail(interaction.guild.iconURL())
            .addFields({
                name: command.messages.m2,
                value: playlist.looping
                    ? command.messages.m3
                    : command.messages.m4,
            })
            .addFields({
                name: command.messages.m5,
                value: playlist.paused
                    ? command.messages.m6
                    : command.messages.m7,
            })
        embeds.push(mainEmbed)

        lists.forEach((list) => {
            let embed = new EmbedBuilder()
            let songs = ''
            let authors = ''

            list.forEach((song) => {
                authors += `${
                    playlist.current == playlist.list.indexOf(song) ? '**' : ''
                }${song.author}${
                    playlist.current == playlist.list.indexOf(song) ? '**' : ''
                }\n`
                songs += `${
                    playlist.current == playlist.list.indexOf(song)
                        ? ':notes: **'
                        : ''
                }${playlist.list.indexOf(song)}. [${song.title
                    .substring(0, 30)
                    .trim()}${song.title.length > 30 ? '...' : ''}](${
                    song.link
                })${
                    playlist.current == playlist.list.indexOf(song) ? '**' : ''
                }\n`
            })

            embed.setColor(0x0099ff)
            embed.addFields(
                {
                    name: command.messages.m8,
                    value: songs,
                    inline: true,
                },
                {
                    name: command.messages.m9,
                    value: authors,
                    inline: true,
                }
            )
            embeds.push(embed)
        })

        interaction.reply({ embeds, ephemeral: playlist.controller })
    },
}
