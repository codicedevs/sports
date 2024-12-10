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
        const users = database.collection('users');
        const zones = database.collection('zones');
        const sports = database.collection('sports');
        const sportmodes = database.collection('sportmodes');
        const locations = database.collection('locations');

        let data = JSON.parse(fs.readFileSync('/tmp/exported_data.json', 'utf8'));
        let dataUsers = transformData(data.users);
        let dataZones = transformData(data.zones);
        let dataSports = transformData(data.sports);
        let dataSportModes = transformData(data.sportModes);
        let dataLocations = transformData(data.locations);


        await users.deleteMany({});
        await zones.deleteMany({});
        await sports.deleteMany({});
        await sportmodes.deleteMany({});
        await locations.deleteMany({});
        console.log('Cleared existing data');
       
        const resultSports = await sports.insertMany(dataSports);

        console.log(`${resultSports.insertedCount} sports inserted`);

        const resultSportModes = await sportmodes.insertMany(dataSportModes);

        console.log(`${resultSportModes.insertedCount} sport modes inserted`);

        const resultZones = await zones.insertMany(dataZones);

        console.log(`${resultZones.insertedCount} zones inserted`);

        const resultUsers = await users.insertMany(dataUsers);

        console.log(`${resultUsers.insertedCount} users inserted`);

        const resultLocations = await locations.insertMany(dataLocations);

        console.log(`${resultLocations.insertedCount} locations inserted`);

        console.log('Data seeding completed successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await client.close();
    }
}

seedDatabase();