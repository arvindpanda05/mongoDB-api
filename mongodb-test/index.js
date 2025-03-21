const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://Admin:Admin@cluster0.r1nwh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB Atlas!");
    } catch (error) {
        console.error("❌ Connection failed:", error);
    } finally {
        await client.close();
    }
}

run();
