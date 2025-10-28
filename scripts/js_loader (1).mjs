// Run with: node scripts/js_loader.mjs --include Vegan --include "Gluten-Free" --limit 5
import { readFileSync, writeFileSync } from 'node:fs';

function loadDataset(path) {
  const raw = readFileSync(path, 'utf8');
  const data = JSON.parse(raw);
  if (!data || typeof data !== 'object' || !Array.isArray(data.recipes)) {
    throw new Error("Invalid dataset: expected top-level { _meta, recipes }");
  }
  return data;
}

function filterByDietary(recipes, include = [], exclude = []) {
  const inc = new Set(include.map(s => s.trim()).filter(Boolean));
  const exc = new Set(exclude.map(s => s.trim()).filter(Boolean));
  return recipes.filter(r => {
    const tags = new Set((r.dietary_tags || []));
    if (inc.size && ![...inc].every(t => tags.has(t))) return false;
    if ([...exc].some(t => tags.has(t))) return false;
    return true;
  });
}

function parseArgs(argv) {
  const args = { dataset: 'all_recipes_4000.json', include: [], exclude: [], limit: 10, out: '' };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dataset') args.dataset = argv[++i];
    else if (a === '--include') args.include.push(argv[++i]);
    else if (a === '--exclude') args.exclude.push(argv[++i]);
    else if (a === '--limit') args.limit = parseInt(argv[++i], 10);
    else if (a === '--out') args.out = argv[++i];
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv);
  const data = loadDataset(args.dataset);
  const filtered = filterByDietary(data.recipes, args.include, args.exclude);

  console.log(`Total recipes: ${data.recipes.length} | Filtered: ${filtered.length}`);
  for (const r of filtered.slice(0, args.limit)) {
    console.log(`- ${r.title}  |  tags: ${(r.dietary_tags || []).join(', ')}`);
  }

  if (args.out) {
    writeFileSync(args.out, JSON.stringify({ _meta: data._meta, recipes: filtered }, null, 2));
    console.log(`\nSaved filtered subset -> ${args.out}`);
  }
}

main();
