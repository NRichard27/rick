const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { languages, logger } = require('../utils')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(languages.en.commands.devinfo.command)
        .setNameLocalizations({
            hu: languages.hu.commands.devinfo.command,
            ru: languages.ru.commands.devinfo.command,
        })
        .setDescription(languages.en.commands.devinfo.hint.message)
        .setDescriptionLocalizations({
            hu: languages.hu.commands.devinfo.hint.message,
            ru: languages.ru.commands.devinfo.hint.message,
        })
        .addStringOption((option) =>
            option
                .setName(languages.en.commands.devinfo.hint.options.o1.name)
                .setNameLocalizations({
                    hu: languages.hu.commands.devinfo.hint.options.o1.name,
                    ru: languages.ru.commands.devinfo.hint.options.o1.name,
                })
                .setDescription(
                    languages.en.commands.devinfo.hint.options.o1.description
                )
                .setDescriptionLocalizations({
                    hu: languages.hu.commands.devinfo.hint.options.o1
                        .description,
                    ru: languages.ru.commands.devinfo.hint.options.o1
                        .description,
                })
                .setRequired(false)
        )
        .setDMPermission(false),
    execute: async (interaction, playlist, lang, client) => {
        logger.info({
            guild: interaction.guild.id,
            user: interaction.member.user.tag,
            place: 'commands',
            command: 'devinfo',
        })
        const command = lang.commands.devinfo

        if (interaction.user.id != process.env.DC_DEV_USER_ID) {
            logger.info({
                guild: interaction.guild.id,
                user: interaction.member.user.tag,
                place: 'commands',
                command: 'devinfo',
                action: 'failed',
            })
            return interaction.reply({
                content: command.messages.m1,
                ephemeral: true,
            })
        }

        logger.info({
            guild: interaction.guild.id,
            user: interaction.member.user.tag,
            place: 'commands',
            command: 'devinfo',
            action: 'success',
        })

        let server = interaction.options.getString(command.hint.options.o1.name)

        if (server) {
            let guild = client.guilds.cache.get(server)

            if (!guild)
                return interaction.reply({
                    content: command.messages.m2,
                    ephemeral: true,
                })

            let owner = await guild.fetchOwner()
            let embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(guild.name)
                .setThumbnail(guild.iconURL())
                .addFields({
                    name: command.messages.m3,
                    value: owner.user.tag,
                    inline: true,
                })
                .addFields({
                    name: command.messages.m4,
                    value: guild.ownerId,
                    inline: true,
                })
                .addFields({
                    name: command.messages.m5,
                    value: guild.id,
                    inline: true,
                })
                .addFields({
                    name: command.messages.m6,
                    value: `${guild.createdAt}`,
                    inline: true,
                })
                .addFields({
                    name: command.messages.m7,
                    value: `${guild.joinedAt}`,
                    inline: true,
                })
                .addFields({
                    name: command.messages.m8,
                    value: `${guild.memberCount}`,
                    inline: true,
                })

            interaction.reply({ embeds: [embed] })
        } else {
            let embeds = []

            for (let i = 0; i < client.guilds.cache.size; i++) {
                let guild = client.guilds.cache.at(i)
                let owner = await guild.fetchOwner()
                let embed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle(guild.name)
                    .setThumbnail(guild.iconURL())
                    .addFields({
                        name: command.messages.m3,
                        value: owner.user.tag,
                        inline: true,
                    })
                    .addFields({
                        name: command.messages.m5,
                        value: guild.id,
                        inline: true,
                    })
                embeds.push(embed)
            }

            interaction.reply({ embeds: embeds })
        }
    },
}
