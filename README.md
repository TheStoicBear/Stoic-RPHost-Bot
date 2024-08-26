# Stoic-RPHost-Bot
A Simple Roll call bot

This Discord bot allows you to create patrol announcements with a customizable time and image. It includes interactive buttons to mark attendance and is designed for use with Discord's Slash Commands.

## Features

- **Patrol Announcements:** Create announcements for patrols with a specified time and optional image.
- **Interactive Buttons:** Users can mark themselves as attending or not attending.
- **Time Conversion:** Automatically formats and displays the patrol time based on user input.

## Prerequisites

1. **Node.js:** Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).

2. **Discord Bot Token:** You need a bot token from Discord's developer portal. Follow [these instructions](https://discordjs.guide/preparations/setting-up-a-bot-application.html) to create and obtain a token.

3. **Permissions:** Ensure your bot has the following permissions:
   - `MESSAGE_CONTENT` for reading and sending message content.
   - `MESSAGE_MANAGE` for managing messages and interactions.

## Setup

### 1. Clone the Repository/Download ZIP

First, clone the repository to your local machine or Download ZIP:

`git clone https://github.com/TheStoicBear/Stoic-RPHost-Bo.git`
`cd Stoic-RPHost-Bo`

### 2. Install Dependencies

Navigate to the project directory and install the required dependencies:

`npm install`

### 3. Create a `.env` File

Create a `.env` file in the root of the project directory and add the following content:

`BOT_TOKEN=your-discord-bot-token`
`GUILD_ID=your-guild-id
Replace `your-discord-bot-token` with the actual token you obtained from Discord's developer portal.
Replace `your-guild-i` with the actual GuildID you obtained from your discord server.
### 4. Run the Bot

Start the bot using Node.js:

`node index.js`

The bot should now be running and logged into Discord. You should see a message confirming that the bot is logged in.

## Usage

### Register Commands

When the bot starts, it will automatically register the `/host` command for the specified guild. You can modify the `guildId` in the `index.js` file to target a different guild.

### Using the `/host` Command

1. **Command Syntax:**

   `/host`

   **Options:**
   - `host-user`: The user who is hosting the patrol.
   - `time`: The time of the patrol (e.g., 10pm PST).
   - `image` (optional): URL of an image to include in the announcement.

2. **Example Usage:**

   `/host host-user:@User time:10pm PST image:https://example.com/image.png`

   This command will create a patrol announcement with the specified user, time, and image.

### Interaction

Once the `/host` command is executed, an embed message with the following features will be sent to the channel:

- **Host:** Displays the user who is hosting the patrol.
- **Time:** Shows the formatted patrol time.
- **Image:** Displays the provided image if a URL is included.
- **Buttons:**
  - **Attend:** Mark yourself as attending the patrol.
  - **Not Attending:** Mark yourself as not attending.

Users can interact with the buttons to indicate their attendance. The bot will react with check or cross emojis based on their choice and update the message accordingly.

## Troubleshooting

- **No Buttons:** Ensure the bot has the required permissions and is properly registered in the guild.
- **Invalid Time Format:** Verify that the time format provided matches the expected formats (`h:mma`, `h:mm A`, `HH:mm`).

e!

## License

This project is licensed under [CRClaim:](https://github.com/TheStoicBear/crclaim)
