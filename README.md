# detect-console-log

A tiny CLI to **warn about `console.log` in staged changes** during Git commits. Designed to work with [Husky](https://typicode.github.io/husky) pre-commit hooks.

## How to use it

Install packages

```bash
npm install --save-dev detect-console-log husky
npx husky init
```

Add this line to `.husky/pre-commit`

```bash
npm exec detect-console-log
```

Optional flags:

- `--fail-on-found`: always fail commit if console.log is found.

---

**Notes**

- Scans only staged changes (git diff --cached), not your entire repo.
- Ignores files removed from commit
- Compatible with Node.js v14+
