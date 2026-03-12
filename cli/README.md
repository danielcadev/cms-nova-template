# create-cms-nova

CLI to create and upgrade CMS Nova projects.

## Create a New Project

```bash
npx create-cms-nova my-app
```

Alternative (npm will resolve `create-cms-nova`):

```bash
npm create cms-nova@latest my-app
```

What it does:

- Clones the template repo.
- Removes the template `.git` history.
- Installs dependencies.

## Upgrade an Existing Project

From your project root (must be a git repo):

```bash
npx create-cms-nova upgrade
```

Options:

```bash
npx create-cms-nova upgrade --dry-run
npx create-cms-nova upgrade --tag v6.1.0
npx create-cms-nova upgrade --allow-dirty
npx create-cms-nova upgrade --no-interactive
```

Upgrade behavior:

- Adds (or reuses) an `upstream` remote pointing to the template repository.
- Computes a diff from a detected base ref to the target ref (default: `upstream/main`).
- Only updates files inside the CLI-defined CMS core paths.
- Intentionally does **not** upgrade documentation/readmes (including research/academic docs).
- Skips files that require manual merge (e.g. `package.json`, `package-lock.json`, `prisma/schema.prisma`).
- Creates a local git backup tag before applying changes.

## License

MIT (see `LICENSE`).
