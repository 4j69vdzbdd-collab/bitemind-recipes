import { RecipeDataset } from "./recipes";
import data from "./all_recipes_10000.json" assert { type: "json" };

const dataset: RecipeDataset = data;
console.log(dataset._meta.records);
console.log(dataset.recipes[0].title);
