// import { GoogleGenerativeAI } from "../node_modules/@google/generative-ai/dist/generative-ai.js";
// import { writeFile } from "fs/promises";

const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = "AIzaSyCXyRSbilB9mKx5Zr2anBiMC3uyLDGgmQ8";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function generateMCQs() {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  let heading = 'How to make communication between two components in angular';
  let prompt = 'Generate 10 mcqs from the topic "'+heading+'"in form of json as given\n{\n    "1":{\n        "ques":"..",\n        "options":["op1","op2","opt3","op4"],\n        "ans":["opt1"]\n\n    },\n    "2":{\n        ...\n    }\n}'

  try {
    const result = await chatSession.sendMessage(prompt);

    const output = result.response.text();
    console.log(output);

    await writeFile("../data/Output.txt", output);
    console.log("File written successfully.");
  } catch (err) {
    console.error("Error generating MCQs or writing file:", err);
  }
}

export default generateMCQs;