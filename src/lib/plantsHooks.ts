import OpenAI from "openai";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { PlantResponse } from "@/Interfaces/plant";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const client = await clientPromise;

export async function validateRequest() {
     if(!process.env.OPENAI_API_KEY){
        return NextResponse.json({
            error: "OpenAI API Key no está definida",
        },{ status:500 });
    }

    if(!process.env.MONGODB_URI){
        return NextResponse.json({
            error: "MongoDB URI no está definida",
        },{ status:500 });
    }
}

//Expresión regular para formato JSON de la API
export function cleanOpenAIResponse (response: string) {
    let cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "");

    cleaned = cleaned.trim();

    return cleaned;
}

export async function callOpenIA(image:string){

    const prompt = `Analiza esta imagen de planta y proporciona una respuesta detallada en formato JSON con la siguiente
    estructura:
    {
    "name": "Nombre común de la planta",
    "description": "Breve descripción de las características y apariencia de la planta",
    "difficult": "easy/medium/hard - basado en qué tan desafiante es mantenerlo",
    "water": ["lunes", "miércoles", "viernes"] - array de días de la semana en español para el riego recomendado,
    "temperature": number - rango de temperatura óptima en Celsius,
    "humidity": number - porcentaje de humedad requerido,
    "light": "low/medium/high - requisitos de luz"
    } 
    
    Por favor asegúrate de que todos los valores coincidan con el formato especificado y los enums. La respuesta
    debe ser JSON válido.
    Devuelve solo JSON válido sin comentarios o explicaciones adicionales.`;

    //Llamada a Openai
    const completion = await openai.chat.completions.create({
        model:"gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: prompt,
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: image,
                        },
                    },
                ],
            },
        ],
        //Va de 0 a 1, cuanto menor sea la temperatura brinda datos más precisos y cuanti mayor, será más creativo
        temperature: 0.0,
    });

    //retornar la respuesta
    return completion.choices[0].message.content;
}

export async function saveToDataBase(plant:PlantResponse, image:string) {
    
    //Abrir conexión a base de datos
    const db = client.db();

    try{
        const result = {
            ...plant,
            image: image,
            createdAt: new Date(),
        }

        const plantCollection = db.collection("plants");
        await plantCollection.insertOne(result);

        return NextResponse.json(result, {status:201})
    }catch(error) {
        console.error("Error al guardar la planta en base de datos", error);
        throw error;
    }
}