const {
    Client,
    GatewayIntentBits,
    Events,
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    PermissionFlagsBits
} = require('discord.js');

require('dotenv').config();
const moment = require('moment-timezone');

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

async function registerCommands(guild) {
    const guildCommands = guild.commands;

    try {
        // Clear existing commands
        await guildCommands.set([]);

        // Register 'host' command
        await guildCommands.create(
            new SlashCommandBuilder()
                .setName('host')
                .setDescription('Create a patrol announcement')
                .addUserOption(option =>
                    option.setName('host-user')
                        .setDescription('The user who is hosting the patrol')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('time')
                        .setDescription('The time of the patrol (e.g., 10pm PST)')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('image')
                        .setDescription('URL of an image to include in the announcement (optional)')
                )
                .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        );

        console.log(`Commands registered for guild ${guild.name}`);
    } catch (error) {
        console.error(`Failed to register commands for guild ${guild.name}:`, error);
    }
}

// On client ready
client.once(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Fetch the guild by ID
    const guildId = process.env.GUILD_ID; // Replace 'YOUR_GUILD_ID' with your actual guild ID
    const guild = client.guilds.cache.get(guildId);

    if (guild) {
        console.log(`Guild found: ${guild.name}`);
        await registerCommands(guild);
    } else {
        console.error(`Guild with ID ${guildId} not found!`);
        console.log(`Guilds the bot is in: ${client.guilds.cache.map(g => g.id).join(', ')}`);
    }
});

// On interaction
client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isCommand()) {
        const { commandName, options } = interaction;

        if (commandName === 'host') {
            const hostUser = options.getUser('host-user');
            const timeInput = options.getString('time');
            const imageUrl = options.getString('image'); // Get the image URL if provided

            // Parse and format the time
            const timeFormats = [
                'h:mma',     // 10:00pm
                'h:mm A',    // 10:00 PM
                'HH:mm',     // 22:00
            ];
            const timeZone = 'America/Los_Angeles'; // Default to PST, change as needed

            // Assume input is in PST and convert to a timestamp
            let formattedTime;
            try {
                formattedTime = moment.tz(timeInput, timeFormats, timeZone).format('YYYY-MM-DD HH:mm:ss');
            } catch (error) {
                console.error('Error parsing time:', error);
                formattedTime = 'Invalid time format';
            }

            // Create the embed message
            const embed = new EmbedBuilder()
                .setTitle('Patrol Announcement')
                .addFields(
                    { name: 'Host:', value: `<@${hostUser.id}>`, inline: true },
                    { name: 'Time:', value: formattedTime, inline: true },
                    { name: '\u200B', value: 'Please feel free to react to this to show your attendance. Yet you are not required to. Feel free to join @ anytime!' }
                )
                .setColor('#00ec1d')
                .setTimestamp();

            // Add image if provided
            if (imageUrl) {
                embed.setImage(imageUrl);
            }

            // Create the buttons for Attend and Not Attending
            const attendButton = new ButtonBuilder()
                .setCustomId('attend')
                .setLabel('Attend')
                .setStyle(ButtonStyle.Success);

            const notAttendButton = new ButtonBuilder()
                .setCustomId('not_attend')
                .setLabel('Not Attending')
                .setStyle(ButtonStyle.Danger);

            const actionRow = new ActionRowBuilder()
                .addComponents(attendButton, notAttendButton);

            // Send the embed message with buttons
            const message = await interaction.reply({
                embeds: [embed],
                components: [actionRow],
                fetchReply: true, // To get the message object for further interactions
            });

            // Create a collector to handle button interactions
            const filter = i => ['attend', 'not_attend'].includes(i.customId) && i.user.id === interaction.user.id;
            const collector = message.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                if (i.customId === 'attend') {
                    await i.update({ content: 'You have marked yourself as attending.', components: [] });
                    await i.message.react('✅');
                } else if (i.customId === 'not_attend') {
                    await i.update({ content: 'You have marked yourself as not attending.', components: [] });
                    await i.message.react('❌');
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    message.edit({ components: [] }); // Disable buttons after time expires
                }
            });
        }
    }
});

// Login to Discord with your app's token
client.login(process.env.BOT_TOKEN);

