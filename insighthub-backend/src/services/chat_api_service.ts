import axios from "axios";
import {config} from "../config/config";

const cleanResponse = (response: string): string => {
    return response.replace(/\\boxed{(.*?)}/g, "$1"); // Removes \boxed{}
}



export const chatWithAI = async (inputUserMessage: string)=> {
    try {
        const API_URL = config.chatAi.api_url();
        const API_KEY = config.chatAi.api_key();
        const MODEL_NAME = config.chatAi.model_name();

        const systemMessage = {
            role: 'system',
            content: 'You are an AI assistant tasked with providing the first comment on forum posts. Your responses should be relevant, engaging, and encourage further discussion, also must be short, and you must answer if you know the answer. Ensure your comments are appropriate for the content and tone of the post. Also must answer in the language of the user post. answer short answers. dont ask questions to follow up'
        };

        const userMessage = {
            role: 'user',
            content: inputUserMessage
        };


        const response = await axios.post(
            API_URL,
            {
                model: MODEL_NAME,
                messages: [ systemMessage, userMessage ],
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const answer = response.data.choices[0].message.content;
        const cleanedAnswer = cleanResponse(answer);
        return cleanedAnswer;
    } catch (error) {
        console.error("Error communicating with OpenRouter:", error);
        return "Sorry, an error occurred.";
    }
}
