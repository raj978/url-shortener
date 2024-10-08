import { Db, MongoClient } from "mongodb";
import { formatLog} from "@/lib/utils";

// Create cached connection variable
let cachedDB: Db | null = null;

// If no connection is cached, create a new one
const uri = process.env.ATLAS_URI_PROD as string;

const client = new MongoClient(uri);

// A function for connecting to MongoDB,
export default async function connectToDatabase(): Promise<Db> {
    // If the database connection is cached, use it instead of creating a new connection
    try {
        if (cachedDB) {
            console.info(formatLog("Using cached client!"));
            return cachedDB;
        }
        console.info(formatLog("No client found! Creating a new one."));

        await client.connect();
        const db: Db = client.db(process.env.DB_NAME);
        cachedDB = db;
        return cachedDB;
    } catch (error) {
        console.error(formatLog(`Error connecting to database: ${error}`));
        throw new Error("Failed to connect to the database");
    }
}
