import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

// As database is far away
async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to Database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");

    connection.isConnected = db.connections[0].readyState;
    console.log(db.connections[0]);
    console.log("Connected to Database Successfully");
  } catch (err) {
    console.log("DB connection failed", err);
    process.exit(1);
  }
}

export default dbConnect;
