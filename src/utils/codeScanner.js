// Client-side intelligent code scanner and technology validator

const PATTERNS = [
  {
    id: "react",
    lang: "React (JSX)",
    type: "frontend",
    techs: ["react", "nextjs", "jsx", "frontend"],
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
    id: "html",
    lang: "HTML",
    type: "frontend",
    techs: ["html", "markup", "frontend"],
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
    id: "css",
    lang: "CSS",
    type: "frontend",
    techs: ["css", "styling", "tailwind", "sass", "scss", "frontend"],
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
    id: "node",
    lang: "Node.js / Express (Backend)",
    type: "backend",
    techs: ["node", "express", "backend", "api", "server"],
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
    id: "python",
    lang: "Python (Backend / Scripting)",
    type: "backend",
    techs: ["python", "django", "flask", "ai", "fastapi", "backend"],
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
    id: "sql",
    lang: "SQL (Database / Backend)",
    type: "backend",
    techs: ["sql", "database", "postgres", "mysql", "mongodb", "backend"],
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
    id: "js",
    lang: "JavaScript / TypeScript",
    type: "code",
    techs: ["javascript", "typescript", "js", "ts", "frontend", "backend"],
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
    id: "git",
    lang: "Git / Shell (Tools)",
    type: "tools",
    techs: ["tools", "git", "github", "bash", "shell", "docker"],
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
      message: "Generic syntax detected. Verified for submission.",
      detectedLang: "Plain Text / Code",
      confidence: 50,
      matches: true,
      keywordsFound: [],
    };
  }

  const confidence = Math.min(99, Math.round(50 + highestScore * 6));

  // 1. SPECIFIC SKILL DISQUALIFICATIONS:
  // If the user specifies a specific technology name, prevent cross-language mismatch!
  let mismatchReason = null;

  // Specific check for HTML
  if (normalizedSkill.includes("html") && bestMatch.id !== "html") {
    mismatchReason = `Skill "HTML" select ki hai lekin code ${bestMatch.lang} ka hai.`;
  }
  // Specific check for CSS
  else if (normalizedSkill.includes("css") && bestMatch.id !== "css") {
    mismatchReason = `Skill "CSS" select ki hai lekin code ${bestMatch.lang} ka hai.`;
  }
  // Specific check for Python
  else if (normalizedSkill.includes("python") && bestMatch.id !== "python") {
    mismatchReason = `Skill "Python" select ki hai lekin code ${bestMatch.lang} ka hai.`;
  }
  // Specific check for SQL
  else if (normalizedSkill.includes("sql") && bestMatch.id !== "sql") {
    mismatchReason = `Skill "SQL" select ki hai lekin code ${bestMatch.lang} ka hai.`;
  }
  // Specific check for Git / GitHub
  else if ((normalizedSkill.includes("git") || normalizedSkill.includes("github")) && bestMatch.id !== "git") {
    mismatchReason = `Skill "${skillName}" select ki hai lekin code ${bestMatch.lang} ka hai.`;
  }
  // Specific check for React
  else if (normalizedSkill.includes("react") && !["react", "js"].includes(bestMatch.id)) {
    mismatchReason = `Skill "React" select ki hai lekin code ${bestMatch.lang} ka hai.`;
  }
  // Category-level mismatches:
  // Backend category with Frontend-only code (CSS or pure HTML)
  else if (normalizedCat === "backend" && ["css", "html"].includes(bestMatch.id)) {
    mismatchReason = `Category "Backend" select ki hai jabke code ${bestMatch.lang} ka hai.`;
  }
  // Frontend category with Backend-only code (Python or SQL)
  else if (normalizedCat === "frontend" && ["python", "sql"].includes(bestMatch.id)) {
    mismatchReason = `Category "Frontend" select ki hai jabke code ${bestMatch.lang} ka hai.`;
  }

  const isMatch = !mismatchReason;

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
      message: `Mismatch Alert: ${mismatchReason} Ye code submit nahi ho sakta.`,
      keywordsFound: matchedKeywords,
    };
  }
}
