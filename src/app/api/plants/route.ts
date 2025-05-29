import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { PlantResponse } from "@/Interfaces/plant";
import clientPromise from "@/lib/mongodb";
import OpenAI from "openai";