/**
 * Check that every link to a `#fragment` on this site lands on an element that
 * exists. Run it after docs:build; it reads the built HTML in docs/.vitepress/dist.
 *
 * The VitePress build already fails on a link to a page that does not exist, but it
 * never looks at the part after the `#`. A heading that is renamed or removed leaves
 * every link to it pointing nowhere, and the build stays green. That is how two links
 * on /guide/concepts/sheet-exclusion broke: they pointed at a "Sheet filtering" heading
 * that a restructure of the reference pages had removed, and nothing noticed for
 * eleven weeks.
 *
 * Reading the built HTML rather than the markdown means the ids are the ones VitePress
 * actually generated: heading slugs, custom `{#id}` anchors on headings and on custom
 * containers, all included. Links to other sites are not checked.
 */

import fs from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("./docs/.vitepress/dist");

/** Any origin works; it only gives relative hrefs something to resolve against. */
const SITE_ORIGIN = "https://site.invalid";

const ID_PATTERN = /\sid="([^"]*)"/g;
const HREF_PATTERN = /<a\b[^>]*?\shref="([^"]*)"/g;

const NAMED_ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

/** Attribute values in the built HTML are entity-encoded, e.g. `&amp;` in a query. */
function decodeEntities(value) {
  return value.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (match, name) => {
    if (name[0] === "#") {
      const code =
        name[1] === "x" || name[1] === "X"
          ? parseInt(name.slice(2), 16)
          : parseInt(name.slice(1), 10);
      return String.fromCodePoint(code);
    }
    return NAMED_ENTITIES[name.toLowerCase()] ?? match;
  });
}

/**
 * The URL path a built file is served at: `guide/quick-start.html` as
 * `/guide/quick-start` (the site uses cleanUrls), `guide/index.html` as `/guide/`.
 */
function sitePathOf(relativeFile) {
  const withoutExtension = "/" + relativeFile.replace(/\.html$/, "");
  return withoutExtension.endsWith("/index")
    ? withoutExtension.slice(0, -"index".length)
    : withoutExtension;
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function readSite() {
  let files;
  try {
    files = await fs.readdir(distDir, { recursive: true });
  } catch {
    throw new Error(
      `No built site at ${distDir}. Run npm run docs:build first.`
    );
  }

  const idsByPage = new Map();
  const links = [];
  for (const file of files.filter((f) => f.endsWith(".html"))) {
    const html = await fs.readFile(path.join(distDir, file), "utf8");
    const page = sitePathOf(file.split(path.sep).join("/"));
    idsByPage.set(
      page,
      new Set([...html.matchAll(ID_PATTERN)].map((m) => decodeEntities(m[1])))
    );
    for (const m of html.matchAll(HREF_PATTERN)) {
      links.push({ page, href: decodeEntities(m[1]) });
    }
  }
  return { idsByPage, links };
}

async function main() {
  const { idsByPage, links } = await readSite();

  let checked = 0;
  const broken = [];
  for (const { page, href } of links) {
    let url;
    try {
      url = new URL(href, SITE_ORIGIN + page);
    } catch {
      continue; // Not a URL at all, so not a link this check can judge.
    }
    if (url.origin !== SITE_ORIGIN || url.hash.length <= 1) continue;

    let target = safeDecode(url.pathname).replace(/\.html$/, "");
    if (!idsByPage.has(target) && idsByPage.has(target + "/")) target += "/";
    const id = safeDecode(url.hash.slice(1));

    checked++;
    if (!idsByPage.has(target)) {
      broken.push(`${page}: ${href} (no page ${target})`);
    } else if (!idsByPage.get(target).has(id)) {
      broken.push(`${page}: ${href} (no id "${id}" on ${target})`);
    }
  }

  // The same link usually appears once per page it is on, so list each once.
  const unique = [...new Set(broken)].sort();
  console.log(
    `[bsi-docs] Checked ${checked} fragment links on ${idsByPage.size} pages: ${unique.length} broken`
  );
  for (const line of unique) console.error(`[bsi-docs] Broken: ${line}`);
  if (unique.length > 0) process.exit(1);
}

main().catch((err) => {
  console.error(`[bsi-docs] ${err.message}`);
  process.exit(1);
});
