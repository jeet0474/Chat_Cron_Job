const { MongoClient } = require('mongodb');

// Use the environment variable for the MongoDB URI
const uri = process.env.MONGODB_URI;  // Access the environment variable

const dbName = 'test';
const collectionName = 'users';

async function deleteExpiredUsers() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const currentTime = new Date();

    // Delete users older than 2 minutes
    const result = await collection.deleteMany({
      createdAt: { $lt: new Date(currentTime - 2 * 60 * 1000) },
    });

    console.log(`Deleted ${result.deletedCount} expired users.`);
  } catch (err) {
    console.error('Error deleting expired users:', err);
  } finally {
    await client.close();
  }
}

module.exports = async (req, res) => {
  try {
    await deleteExpiredUsers();
    res.status(200).send('Cleanup completed.');
  } catch (err) {
    res.status(500).send('Error during cleanup.');
  }
};
