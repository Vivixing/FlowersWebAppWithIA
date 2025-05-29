//Esta es la que se guarda en la base de datos
export interface PlantResponse {
    name : string;
    description : string;
    dificultad: "Easy" | "Medium" | "Hard";
    water: string[];
    temperature: number;
    humidity: number;
    light: "Low" | "Medium" |"High";
    image: string;
}