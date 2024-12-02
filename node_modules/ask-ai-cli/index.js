#!/usr/bin/env node

import { program } from "commander";
import { GoogleGenerativeAI } from "@google/generative-ai";
import chalk from "chalk";
import ora from "ora";
import figlet from "figlet";
import dotenv from "dotenv";
import gradient from "gradient-string";  // Import gradient-string
dotenv.config(); // Load environment variables from a .env file

// Initialize Google Generative AI with the API key
const genAI = new GoogleGenerativeAI("AIzaSyBSmYqNgIGt56-NNWwajQ5fyqr969LRLA0"|| process.env.GEMINI_API_KEY);

// Helper function to interact with Gemini AI
const interactWithGeminiAI = async (modelName, prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    if (!model) {
      throw new Error("Model initialization failed.");
    }

    const result = await model.generateContent(prompt);
    if (!result || !result.response) {
      throw new Error("Invalid response from the model.");
    }

    return result.response.text();
  } catch (error) {
    console.error(chalk.red("Error interacting with Gemini AI:"), error.message);
    return null;
  }
};

// Display a styled header with a gradient (called only once)
const displayHeader = () => {
  figlet("Ask-AI CLI", { horizontalLayout: "full" }, (err, data) => {
    if (err) {
      console.log("Something went wrong with figlet.");
      return;
    }

    // Apply gradient effect using gradient-string
    const gradientText = gradient.rainbow(data);  // Apply rainbow gradient
    console.log(gradientText);
    setTimeout(() => {
      console.log(chalk.cyan("Welcome to the AskAI CLI! Powered by Gemini AI"));
      console.log(chalk.yellow("\n Your prompt to get started!"));
    }, 1000);
  });
};

// Set version and description
program
  .version("1.0.0")
  .description(chalk.blue("A CLI app built with Commander.js and Gemini AI"));

// Display the header before prompting user for input (called once here)
displayHeader();

// Define the 'prompt' command
program
  .command("prompt <prompt>")
  .alias("p")
  .description(chalk.green("Generate a response from Gemini AI for your input prompt"))
  .action(async (prompt) => {
    console.log(chalk.cyanBright(`Input Prompt: "${prompt}"`));

    // Show spinner when processing request
    const spinner = ora(chalk.yellow("Processing your request...")).start();

    const aiResult = await interactWithGeminiAI("gemini-1.5-flash", prompt);

    // Stop the spinner after processing
    spinner.stop();

    if (aiResult) {
      console.log(chalk.bold.green("\nAI Result:\n"));
      console.log(chalk.whiteBright(aiResult));
    } else {
      console.error(chalk.redBright("\nFailed to generate a response from Gemini AI."));
    }
  });

// Parse command-line arguments after displaying the welcome message
program.parse(process.argv);
