// Gestión simple de videos del repo.
//   index.html          = el video en el que se está trabajando (preview, check y snapshot solo ven este)
//   videos/<nombre>.html = videos guardados
//
//   npm run video:save   -- <nombre>   copia index.html -> videos/<nombre>.html
//   npm run video:open   -- <nombre>   copia videos/<nombre>.html -> index.html (no pisa trabajo sin guardar; --force para pisar)
//   npm run video:render -- <nombre>   renderiza videos/<nombre>.html a renders/<nombre>.mp4
//   npm run video:list                 lista los videos guardados
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const [cmd, name, ...rest] = process.argv.slice(2);
const force = rest.includes("--force") || name === "--force";
const dir = "videos";
const file = (n) => join(dir, `${n}.html`);
const need = () => {
  if (!name || name.startsWith("--")) {
    console.error("Falta el nombre del video. Ej: npm run video:save -- vaca-demo");
    process.exit(1);
  }
};

// Misma versión de hyperframes que fija package.json, para que los renders sean reproducibles.
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const version = /hyperframes@([\w.\-]+)/.exec(pkg.scripts.render)?.[1] ?? "latest";
const hf = (args) =>
  spawnSync("npx", ["--yes", `hyperframes@${version}`, ...args], { stdio: "inherit", shell: true }).status ?? 1;

const saved = () => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".html")) : []);

if (cmd === "list") {
  const names = saved().map((f) => f.replace(/\.html$/, ""));
  console.log(names.length ? names.join("\n") : "(no hay videos guardados)");
} else if (cmd === "save") {
  need();
  mkdirSync(dir, { recursive: true });
  copyFileSync("index.html", file(name));
  console.log(`index.html -> ${file(name)}`);
} else if (cmd === "open") {
  need();
  if (!existsSync(file(name))) {
    console.error(`No existe ${file(name)}. Videos guardados: ${saved().join(", ") || "ninguno"}`);
    process.exit(1);
  }
  if (existsSync("index.html") && !force) {
    const current = readFileSync("index.html", "utf8");
    const isSaved = saved().some((f) => readFileSync(join(dir, f), "utf8") === current);
    if (!isSaved) {
      console.error("index.html tiene cambios que no están guardados en videos/. Guardalo primero (video:save) o usá --force.");
      process.exit(1);
    }
  }
  copyFileSync(file(name), "index.html");
  console.log(`${file(name)} -> index.html`);
} else if (cmd === "render") {
  need();
  if (!existsSync(file(name))) {
    console.error(`No existe ${file(name)}`);
    process.exit(1);
  }
  process.exit(hf(["render", "-c", file(name), "-o", `renders/${name}.mp4`]));
} else {
  console.error("Uso: node scripts/videos.mjs <save|open|render|list> [nombre] [--force]");
  process.exit(1);
}
