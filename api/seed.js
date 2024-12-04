require('dotenv').config();

const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');

const uri = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}?authSource=admin`;
const client = new MongoClient(uri);

function transformData(data) {
    return data.map(item => {
        const transformedItem = { ...item };
        if (item._id && item._id.$oid) {
            transformedItem._id = new ObjectId(item._id.$oid);
        }
        return transformedItem;
    });
}

async function seedDatabase() {
    try {
        if (process.env.NODE_ENV === 'production') {
            console.log('Seed script only runs in development environment');
            process.exit(0);
        }

        
        await client.connect();
        console.log('Connected to MongoDB');
        
        const database = client.db(process.env.DB_DATABASE);
        const collection = database.collection('users');
        
        let data = JSON.parse(fs.readFileSync('/tmp/exported_data.json', 'utf8'));
        data = transformData(data);

        await collection.deleteMany({});
        console.log('Cleared existing data');

        const result = await collection.insertMany(data);
        console.log(`${result.insertedCount} documents inserted`);

        console.log('Data seeding completed successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await client.close();
    }
}

seedDatabase();