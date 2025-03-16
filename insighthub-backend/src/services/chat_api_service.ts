import axios from 'axios';


const API_TOKEN = "your_hugging_face_api_token_here";
const API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-large"; // Use flan-t5-large or falcon-7b-instruct

// Define the pre-context
const preContext = `You are a helpful assistant on a question-and-answer forum. Your goal is to provide clear, concise, and accurate answers to user questions. If you don't know the answer, politely admit it and encourage other users to contribute. Keep your responses friendly and professional.`;

// Define the user's post (this would come from your app's input)
const userPost = "What are some good tips for improving productivity?";

// Combine the pre-context and user's post
const inputText = `${preContext}\n\nUser: ${userPost}`;

// Define the payload for the API request
const payload = {
    inputs: inputText,
};

// Define the headers with your API token
const headers = {
    Authorization: `Bearer ${API_TOKEN}`,
};

// Make the API request
axios.post(API_URL, payload, { headers })
    .then((response) => {
        const generatedText = response.data[0]?.generated_text || "No response generated.";
        console.log("Chatbot Response:", generatedText);
    })
    .catch((error) => {
        console.error("Error:", error.response ? error.response.data : error.message);
    });