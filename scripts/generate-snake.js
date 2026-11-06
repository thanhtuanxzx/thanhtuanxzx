const mod = require("generate-snake-animation");
const fs = require("fs");
const path = require("path");

// 7 rows x 53 cols matrix
const grid = Array.from({ length: 7 }, () => Array(53).fill(" "));

// T (width 8) at cols 7..14
const T = [
  "████████",
  "████████",
  "   ██   ",
  "   ██   ",
  "   ██   ",
  "   ██   ",
  "   ██   "
];
T.forEach((row, r) => {
  for (let c = 0; c < row.length; c++) {
    if (row[c] !== " ") grid[r][7 + c] = row[c];
  }
});

// Heart (width 9) at cols 22..30
const Heart = [
  " ██   ██ ",
  "████ ████",
  "█████████",
  "█████████",
  " ███████ ",
  "  █████  ",
  "   ███   "
];
Heart.forEach((row, r) => {
  for (let c = 0; c < row.length; c++) {
    if (row[c] !== " ") grid[r][22 + c] = row[c];
  }
});

// N (width 8) at cols 38..45
const N = [
  "██    ██",
  "███   ██",
  "████  ██",
  "██ ██ ██",
  "██  ████",
  "██   ███",
  "██    ██"
];
N.forEach((row, r) => {
  for (let c = 0; c < row.length; c++) {
    if (row[c] !== " ") grid[r][38 + c] = row[c];
  }
});

// Construct 53 weeks
const weeks = [];
for (let col = 0; col < 53; col++) {
  const contributionDays = [];
  for (let row = 0; row < 7; row++) {
    const isLit = grid[row][col] === "█";
    contributionDays.push({
      contributionCount: isLit ? 20 : 0,
      contributionLevel: isLit ? "FOURTH_QUARTILE" : "NONE",
      weekday: row,
      date: "2025-01-01"
    });
  }
  weeks.push({ contributionDays });
}

// Mock GraphQL response
global.fetch = async () => ({
  ok: true,
  json: async () => ({
    data: {
      user: {
        contributionsCollection: {
          contributionCalendar: { weeks }
        }
      }
    }
  })
});

async function main() {
  const outDir = path.resolve(__dirname, "../dist");
  fs.mkdirSync(outDir, { recursive: true });

  console.log("Generating Snake SVGs with 2-stroke T ❤️ N pattern...");

  const [svgLight, svgDark] = await mod.generateSnakeAnimation(
    { platform: "github", username: "thanhtuanxzx", githubToken: "mock" },
    [
      {
        format: "svg",
        drawOptions: {
          colorBackground: "#ffffff",
          colorDotBorder: "#1b1f230a",
          colorDots: {
            1: "#9be9a8",
            2: "#40c463",
            3: "#30a14e",
            4: "#216e39"
          },
          colorEmpty: "#ebedf0",
          colorSnake: "purple",
          sizeCell: 16,
          sizeDot: 12,
          sizeDotBorderRadius: 2
        },
        animationOptions: {
          stepDurationMs: 100,
          frameByStep: 1
        }
      },
      {
        format: "svg",
        drawOptions: {
          colorBackground: "#0c1116",
          colorDotBorder: "#1b1f230a",
          colorDots: {
            1: "#01311f",
            2: "#034525",
            3: "#0f6d31",
            4: "#00c647"
          },
          colorEmpty: "#161b22",
          colorSnake: "purple",
          sizeCell: 16,
          sizeDot: 12,
          sizeDotBorderRadius: 2
        },
        animationOptions: {
          stepDurationMs: 100,
          frameByStep: 1
        }
      }
    ]
  );

  fs.writeFileSync(path.join(outDir, "github-contribution-grid-snake.svg"), svgLight);
  fs.writeFileSync(path.join(outDir, "github-contribution-grid-snake-dark.svg"), svgDark);

  console.log("SVGs successfully generated in dist/!");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
