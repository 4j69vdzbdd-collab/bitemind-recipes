import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";
import chalk from "chalk";
import type { RecipeDataset, Recipe } from "./recipes.d.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAIN_FILE = path.join(__dirname, "all_recipes_10000.json");
const NEW_RECIPES_DIR = path.join(__dirname, "new_recipes");

function loadMain(): RecipeDataset {
  try {
    return JSON.parse(fs.readFileSync(MAIN_FILE, "utf-8"));
  } catch {
    console.error(chalk.red("âŒ Could not load all_recipes_10000.json"));
    process.exit(1);
  }
}

function listNewFiles(): string[] {
  if (!fs.existsSync(NEW_RECIPES_DIR)) {
    console.log(chalk.yellow("ðŸ“ No /new_recipes folder found."));
    return [];
  }
  const files = fs.readdirSync(NEW_RECIPES_DIR).filter((f) => f.endsWith(".json"));
  if (files.length === 0) console.log(chalk.green("âœ… No new recipe files found."));
  return files;
}

function showFileSummary(file: string) {
  const fullPath = path.join(NEW_RECIPES_DIR, file);
  const data = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
  console.log(chalk.cyan(`\nðŸ“‚ ${file}`));
  if (Array.isArray(data)) {
    console.log(chalk.gray(`   ${data.length} recipes`));
    data.slice(0, 3).forEach((r: Recipe) =>
      console.log(`   â€¢ ${chalk.bold(r.title)} (${chalk.magenta(r.cuisine)})`)
    );
  } else {
    console.log(chalk.red("   âš ï¸  Invalid JSON format"));
  }
}

function mergeFile(file: string) {
  const main = loadMain();
  const fullPath = path.join(NEW_RECIPES_DIR, file);
  const data = JSON.parse(fs.readFileSync(fullPath, "utf-8"));

  if (!Array.isArray(data)) {
    console.log(chalk.yellow(`âš ï¸  Skipping ${file}: not a valid recipe array.`));
    return;
  }

  main.recipes.push(...data);
  main._meta.records = main.recipes.length;
  fs.writeFileSync(MAIN_FILE, JSON.stringify(main, null, 2), "utf-8");
  console.log(chalk.green(`âœ… Merged ${data.length} recipes into main dataset.`));

  fs.unlinkSync(fullPath);
  console.log(chalk.red(`ðŸ—‘ï¸  Deleted ${file} after merge.`));
}

function deleteFile(file: string) {
  const fullPath = path.join(NEW_RECIPES_DIR, file);
  fs.unlinkSync(fullPath);
  console.log(chalk.red(`ðŸ—‘ï¸  Deleted ${file}`));
}

// Interactive prompt
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function promptUser() {
  const files = listNewFiles();
  if (files.length === 0) {
    rl.close();
    return;
  }

  console.log(chalk.cyan("\nðŸ“‹ Available files:"));
  files.forEach((f, i) => console.log(`  [${i + 1}] ${f}`));

  rl.question(
    chalk.yellow("\nEnter a number to view, 'm#' to merge, 'd#' to delete, or 'q' to quit: "),
    (answer) => {
      if (answer === "q") {
        rl.close();
        return;
      }

      const action = answer[0];
      const index = parseInt(answer.slice(1) || answer, 10) - 1;
      const file = files[index];

      if (!file) {
        console.log(chalk.red("âŒ Invalid choice."));
        return promptUser();
      }

      if (action === "m") mergeFile(file);
      else if (action === "d") deleteFile(file);
      else showFileSummary(file);

      promptUser();
    }
  );
}

console.log(chalk.bold.cyan("\nðŸ” BiteMind â€” Review New Recipes\n"));
promptUser();

