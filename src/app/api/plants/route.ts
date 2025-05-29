import { NextResponse } from "next/server";
import { callOpenIA,validateRequest,cleanOpenAIResponse, saveToDataBase} from "@/lib/plantsHooks";
import { PlantResponse } from "@/Interfaces/plant";
import clientPromise from "@/lib/mongodb";

const client = await clientPromise;

interface Plant{
    image: string;
}

export async function POST(request: Request){
    

    const body: Plant = await request.json();
    const {image} = body;

    if(!image){
        return NextResponse.json({
            error: "La imagen es requerida",
        },{status:400});
    }

    
}