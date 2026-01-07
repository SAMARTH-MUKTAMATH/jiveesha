---
description: Deploy Parent Portal Fixes to New Branch
---

This workflow safeguards your deployment by pushing all current work to a new isolated branch, avoiding any potential merge conflicts with the main codebase.

1. Create and switch to a new feature branch
// turbo
2. git checkout -b feature/parent-portal-nav-fix-deploy

3. Stage all changes
// turbo
4. git add .

5. Commit changes
// turbo
6. git commit -m "Fix: Parent Portal navigation and layout glitches"

7. Push to remote
// turbo
8. git push -u origin feature/parent-portal-nav-fix-deploy
