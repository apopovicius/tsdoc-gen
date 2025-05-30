import { execSync } from "child_process";

const increment = process.argv[2];

if (!["patch", "minor", "major"].includes(increment)) {
  console.error("❌ Usage: npm run promote patch|minor|major");
  process.exit(1);
}

try {
  console.log(`🔧 Bumping version (${increment})...`);
  const version = execSync(`npm version ${increment} --no-git-tag-version`, {
    encoding: "utf8",
  }).trim();

  console.log(`📦 New version: ${version}`);

  execSync("git add package.json package-lock.json", { stdio: "inherit" });
  execSync(`git commit -m "chore: release ${version}"`, { stdio: "inherit" });
  execSync("git push origin main", { stdio: "inherit" });

  // ✅ Tag and push the tag
  const tag = `v${version}`;
  execSync(`git tag ${tag}`, { stdio: "inherit" });
  execSync(`git push origin ${tag}`, { stdio: "inherit" });

  console.log(`🚀 Promotion triggered for version ${version} via tag ${tag}`);
} catch (error: any) {
  console.error("❌ Promotion failed:", error.message);
  process.exit(1);
}
