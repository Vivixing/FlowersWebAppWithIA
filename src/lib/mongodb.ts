import { MongoClient } from "mongodb";

//validar si se encuentra variable de entorno MONGODB_URI
if (!process.env.MONGODB_URI){
    throw new Error("MONGODB_URI no está definida")
}

//Declarar variables
const uri = process.env.MONGODB_URI;
let client : MongoClient;
//Promise para mantener abierta la promesa en el tiempo
let clientPromise : Promise<MongoClient>;


if (process.env.NODE_ENV === "development"){
    const globalWithMongo = global as typeof globalThis &{
        _mongoClientPromise: Promise<MongoClient>;
    };

    if(!globalWithMongo._mongoClientPromise){
        client = new MongoClient(uri);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
}else{
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export default clientPromise;