import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.join(__dirname, "../src/content/posts/dummy-post");

const frontmatter = `---
draft: false
title: "Dummy Post for CI Build"
category: "test"
tags: ["ci"]
summary: "This is a dummy post for CI build testing"
author: ["CI"]
heroImage: null
publishedAt: 2024-01-01
createdAt: 2024-01-01
updatedAt: null
---

# Dummy Post

This post is created for CI build testing.
`;

fs.mkdirSync(postsDir, { recursive: true });
fs.writeFileSync(path.join(postsDir, "index.md"), frontmatter);

console.log("Dummy post created for CI build");
