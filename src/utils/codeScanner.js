// Client-side intelligent code scanner and technology validator

const PATTERNS = [
  {
    lang: "React (JSX)",
    family: ["frontend", "react", "nextjs", "javascript"],
    regex: [
      /import\s+.*\s+from\s+['"]react['"]/i,
      /useState\s*\(/,
      /useEffect\s*\(/,
      /useRef\s*\(/,
      /useMemo\s*\(/,
      /<[A-Z][A-Za-z0-9]*(\s+[^>]*)?>/,
      /className=/,
      /export\s+default\s+function/i,
      /<\/[A-Za-z0-9]+>/,
    ],
    keywords: ["useState", "useEffect", "JSX", "component", "props", "className"],
  },
  {
    lang: "HTML",
    family: ["frontend", "html", "markup"],
    regex: [
      /<!DOCTYPE\s+html>/i,
      /<html(\s+[^>]*)?>/i,
      /<head(\s+[^>]*)?>/i,
      /<body(\s+[^>]*)?>/i,
      /<(div|span|section|header|footer|nav|main|h1|h2|p|a)(\s+[^>]*)?>/i,
      /<\/(div|section|main|body|html)>/i,
    ],
    keywords: ["<!DOCTYPE>", "<html>", "<head>", "<body>", "<section>"],
  },
  {
    lang: "CSS",
    family: ["frontend", "css", "styling", "tailwind"],
    regex: [
      /@media\s*\([^)]+\)/i,
      /@keyframes\s+[a-zA-Z0-9_\-]+/i,
      /:\s*(flex|grid|block|none|relative|absolute);/i,
      /[a-z\-]+:\s*[0-9]+(px|rem|em|vh|vw|%);/i,
      /--[a-z0-9\-]+:\s*[^;]+;/i,
      /\{[\s\S]*?(background|color|padding|margin|border|display):\s*[^;]+;[\s\S]*?\}/i,
    ],
    keywords: ["keyframes", "flexbox", "grid", "vars", "media-query"],
  },
  {
    lang: "Node.js / Express (Backend)",
    family: ["backend", "node", "express", "api", "server"],
    regex: [
      /require\s*\(\s*['"]express['"]\s*\)/i,
      /express\s*\(\s*\)/i,
      /app\.(get|post|put|delete|use|listen)\s*\(/i,
      /res\.(send|json|status|render)\s*\(/i,
      /module\.exports\s*=/i,
      /process\.env\./i,
      /mongoose\.(connect|Schema|model)/i,
    ],
    keywords: ["express()", "app.use", "res.json", "middleware", "mongoose"],
  },
  {
    lang: "Python (Backend / Scripting)",
    family: ["backend", "python", "django", "flask", "ai", "fastapi"],
    regex: [
      /def\s+[a-zA-Z0-9_]+\s*\([^)]*\):/,
      /class\s+[a-zA-Z0-9_]+(\([^)]*\))?:/,
      /import\s+[a-zA-Z0-9_]+/,
      /from\s+[a-zA-Z0-9_]+\s+import/,
      /if\s+__name__\s*==\s*['"]__main__['"]:/,
      /elif\s+/,
      /print\s*\(/,
      /self\.[a-zA-Z0-9_]+/,
      /@app\.(get|post|route)\s*\(/i,
    ],
    keywords: ["def", "import", "class", "self", "elif", "@app.route"],
  },
  {
    lang: "SQL / Database",
    family: ["backend", "database", "sql", "postgres", "mysql", "mongodb"],
    regex: [
      /SELECT\s+.*?\s+FROM\s+/i,
      /INSERT\s+INTO\s+/i,
      /UPDATE\s+.*?\s+SET\s+/i,
      /DELETE\s+FROM\s+/i,
      /CREATE\s+TABLE\s+/i,
      /WHERE\s+[a-zA-Z0-9_]+\s*=/i,
      /JOIN\s+[a-zA-Z0-9_]+\s+ON/i,
    ],
    keywords: ["SELECT", "FROM", "WHERE", "JOIN", "TABLE"],
  },
  {
    lang: "JavaScript / TypeScript",
    family: ["frontend", "backend", "javascript", "typescript", "js", "ts"],
    regex: [
      /const\s+[a-zA-Z0-9_]+\s*=\s*/,
      /let\s+[a-zA-Z0-9_]+\s*=\s*/,
      /function\s+[a-zA-Z0-9_]*\s*\(/,
      /\([a-zA-Z0-9_,\s]*\)\s*=>/,
      /async\s+(function|\()/,
      /await\s+[a-zA-Z0-9_]/,
      /interface\s+[A-Z][a-zA-Z0-9_]*/,
      /type\s+[A-Z][a-zA-Z0-9_]*\s*=/,
      /console\.(log|warn|error)\s*\(/,
    ],
    keywords: ["const", "let", "async/await", "arrow function", "interface"],
  },
  {
    lang: "Git / Shell (Tools)",
    family: ["tools", "git", "github", "bash", "shell", "docker"],
    regex: [
      /git\s+(commit|add|push|pull|status|checkout|branch|merge|clone)/i,
      /npm\s+(run|install|i|start|build)/i,
      /docker\s+(run|build|compose)/i,
      /sudo\s+/,
      /export\s+[A-Z_]+=/i,
    ],
    keywords: ["git commit", "git push", "npm run", "docker", "branch"],
  },
];

/**
 * Scan code and check alignment with skillName and category
 */
export function scanCode(code, skillName = "", category = "") {
  if (!code || !code.trim()) {
    return {
      status: "empty",
      message: "Coding snippet likhein taake scanner verify kare.",
      detectedLang: null,
      confidence: 0,
      matches: false,
      keywordsFound: [],
    };
  }

  const normalizedCode = code.trim();
  const normalizedSkill = skillName.trim().toLowerCase();
  const normalizedCat = category.trim().toLowerCase();

  let bestMatch = null;
  let highestScore = 0;
  let matchedKeywords = [];

  for (const pattern of PATTERNS) {
    let score = 0;
    const foundKw = [];

    // Check regex hits
    for (const rx of pattern.regex) {
      if (rx.test(normalizedCode)) {
        score += 2;
      }
    }

    // Check keyword hits
    for (const kw of pattern.keywords) {
      if (normalizedCode.toLowerCase().includes(kw.toLowerCase())) {
        score += 1;
        foundKw.push(kw);
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = pattern;
      matchedKeywords = foundKw;
    }
  }

  if (!bestMatch || highestScore === 0) {
    return {
      status: "neutral",
      message: "Generic code syntax detected. Skill name ke saath verify kiya ja raha hai.",
      detectedLang: "Plain Text / Code",
      confidence: 50,
      matches: true,
      keywordsFound: [],
    };
  }

  const confidence = Math.min(99, Math.round(50 + highestScore * 6));

  // Determine if code matches the user's skill or category
  const familyMatches = bestMatch.family.some(
    (f) =>
      normalizedSkill.includes(f) ||
      f.includes(normalizedSkill) ||
      normalizedCat.includes(f)
  );

  // Special checks:
  // If user says category is "Backend" and code is Python, Node, Express, SQL => match!
  const isBackendCategory = normalizedCat === "backend";
  const isBackendCode =
    bestMatch.lang.includes("Backend") ||
    bestMatch.lang.includes("Python") ||
    bestMatch.lang.includes("SQL") ||
    bestMatch.lang.includes("Node");

  // If user says category is "Frontend" and code is CSS, HTML, React, JS => match!
  const isFrontendCategory = normalizedCat === "frontend";
  const isFrontendCode =
    bestMatch.lang.includes("Frontend") ||
    bestMatch.lang.includes("React") ||
    bestMatch.lang.includes("CSS") ||
    bestMatch.lang.includes("HTML") ||
    bestMatch.lang.includes("JavaScript");

  const categoryMatches =
    (isBackendCategory && isBackendCode) ||
    (isFrontendCategory && isFrontendCode);

  const isMatch = familyMatches || categoryMatches;

  if (isMatch) {
    return {
      status: "success",
      detectedLang: bestMatch.lang,
      confidence,
      matches: true,
      message: `Verified: Code syntax (${bestMatch.lang}) matches skill "${skillName || "Untitled"}"!`,
      keywordsFound: matchedKeywords,
    };
  } else {
    return {
      status: "warning",
      detectedLang: bestMatch.lang,
      confidence,
      matches: false,
      message: `Scanner Alert: Code ${bestMatch.lang} lag raha hai, jabke skill "${skillName || category}" select ki hai.`,
      keywordsFound: matchedKeywords,
    };
  }
}
