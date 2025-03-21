
    import { getClient } from '@botpress/webchat'

    //Add your Client ID here ⬇️
    const clientId = "";

    const client = getClient({ clientId })

    client.on("message", (message) => {
      console.log("Received message", message); // Messages from the bot
    });

    await client.connect(); // Initialize the client

    await client.sendMessage("Hello, Botpress!"); // Send a message to the bot

