# Dino Donger Discord Bot

A fun Discord bot that automatically generates a unique, dinosaur-themed nickname for every new member joining the server. The nicknames are humorous, following a 'Dino Donger' theme. The bot asks the new member to either accept or reject the generated nickname through a private message.

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/diplodongus/DinoDongers
    ```

2. Navigate into the directory:

    ```bash
    cd dino-donger-discord-bot
    ```

3. Install the required packages:

    ```bash
    npm install
    ```

## Configuration

Create a `.env` file in the root of the project directory and add your bot token like this:

    ```plaintext
    BOT_TOKEN=your-bot-token
    ```

Remember to replace `your-bot-token` with your actual bot token.

## Running the Bot

To start the bot, use:

    ```bash
    node index.js
    ```

## Features

- Generates unique, dinosaur-themed nicknames for every new member.
- Asks the new member to either accept or reject the generated nickname through a private message.
- Regenerates a nickname if the previous one was rejected by the member.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).
