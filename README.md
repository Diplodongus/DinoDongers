# Dino Dongers Discord Bot

The Dino Dongers bot is a fun addition to your Discord server. This bot has been designed to automatically assign unique and hilarious "Dino Donger" nicknames to new members when they join the server.

## Features

- **Auto-generated Nicknames:** The bot will generate a random dinosaur-themed nickname for each new member.
- **Nickname Confirmation:** When assigned a nickname, the bot sends a private message to the new member asking for confirmation. The user can react with an 'accept' emoji or a 'deny' emoji. 
- **Nickname Regeneration:** If the user hits 'deny,' the bot will generate a new nickname for the user to approve.
- **Public Announcement:** The bot will post the proposed nickname in a dedicated channel on the server, allowing all members to welcome the new member.
- **Nickname Change Command:** Existing members can use the '/dinoname' command to have a new Dino Donger name generated for them.

## Setup

1. Clone this repository.
2. Install the necessary dependencies using `npm install`.
3. Create a `.env` file and set `BOT_TOKEN` to your bot's token, `GUILD_ID` to your Server ID.
4. Choose a dedicated channel to receive bot messages and update `CHANNEL_ID` in the `.env` file with the correct Channel ID.
5. Run the bot using `node index.js`.

## Troubleshooting

If you encounter any errors or issues while setting up or running the bot, please check the following:

- Make sure that the bot has the necessary permissions in your Discord server. The bot needs permissions to read and send messages, react to messages, manage nicknames, and read message history.
- Ensure your Node.js version is up to date. This bot was built and tested on Node.js v18.16.0.
- If you are experiencing issues with the nickname change command, remember that the bot cannot change the nickname of a user who has a higher role in the server. In such a case, the bot will send a PM to the user with the generated nickname and a description of why it couldn't be applied.

## Contributing

We welcome contributions to the Dino Dongers bot. Feel free to submit pull requests or open issues if you have any suggestions or improvements.

## License

This project is licensed under the MIT License.
