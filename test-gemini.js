import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Say 'test successful'");
    console.log(`✅ SUCCESS with model: ${modelName} -> ${result.response.text().trim()}`);
  } catch (e) {
    console.error(`❌ FAILED with model: ${modelName} -> ${e.message}`);
  }
}

async function run() {
  console.log("Testing modern flash models...");
  await testModel("gemini-2.5-flash");
  await testModel("gemini-3.5-flash");
  await testModel("gemini-flash-latest");
}

run();
