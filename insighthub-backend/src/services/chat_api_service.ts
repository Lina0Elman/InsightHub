import axios from "axios";

const cleanResponse = (response: string): string => {
    return response.replace(/\\boxed{(.*?)}/g, "$1"); // Removes \boxed{}
}

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = process.env.OPENROUTER_API_KEY; // Replace with your actual OpenRouter API key

export const chatWithAI = async (inputUserMessage: string)=> {
    try {

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
                model: "google/gemma-3-27b-it:free",
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
