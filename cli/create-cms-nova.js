#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// --- ANSI Colors ---
const s = {
    reset: "\x1b[0m", bright: "\x1b[1m", dim: "\x1b[2m",
    red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m",
    blue: "\x1b[34m", magenta: "\x1b[35m", cyan: "\x1b[36m",
    bgBlue: "\x1b[44m",
};

const c = {
    success: (m) => `${s.green}${m}${s.reset}`,
    error: (m) => `${s.red}${m}${s.reset}`,
    warn: (m) => `${s.yellow}${m}${s.reset}`,
    info: (m) => `${s.cyan}${m}${s.reset}`,
    bold: (m) => `${s.bright}${m}${s.reset}`,
    dim: (m) => `${s.dim}${m}${s.reset}`,
    banner: (m) => `${s.bgBlue}${s.bright} ${m} ${s.reset}`,
    primary: (m) => `${s.magenta}${s.bright}${m}${s.reset}`,
};

// --- CMS CORE PATHS: Only files inside these paths are eligible for upgrade ---
// Everything else (project-specific pages, branding, docs) is NEVER touched.
// This intentionally excludes academic/research docs and readmes.
const CMS_CORE_PATHS = [
    // Root metadata (manual merge; shown during upgrade)
    'package.json',
    'package-lock.json',

    // Next.js surfaces
    'src/app/admin/',           // Admin dashboard pages
    'src/app/api/',             // API routes
    'src/app/actions/',         // Server actions
    'src/app/[typePath]/',      // Public headless routes

    // UI + components
    'src/components/admin/',    // Admin UI components
    'src/components/cms/',      // CMS components
    'src/components/layout/',   // Public layout components (navbar, etc.)
    'src/components/public/',   // Public UI components
    'src/components/templates/',// Templates UI
    'src/components/ui/',       // Shared UI primitives (shadcn)
    'src/components/NovaAdminProvider.tsx',

    // Architecture layers
    'src/server/',              // Privileged runtime logic (auth/policy/logging)
    'src/modules/',             // Reusable CMS domains
    'src/shared/',              // Cross-project helpers
    'src/verticals/',           // Business-specific packs

    // Supporting code
    'src/config/',
    'src/contexts/',
    'src/hooks/',
    'src/i18n/',
    'src/prisma/',
    'src/schemas/',
    'src/services/',
    'src/types/',
    'src/utils/',
    'src/lib/',                 // Legacy compatibility layer (migration)
    'src/proxy.ts',

    // Tooling / data
    'scripts/security/',        // Security guardrails (policy checks)
    'prisma/',                  // Database schema & migrations
    'messages/',                // i18n translations
    'cli/',                     // CLI tool itself
];

// --- Files that need special merge handling (warn user, never auto-apply) ---
const MERGE_CAREFULLY = new Set([
    'package.json',
    'package-lock.json',
    'prisma/schema.prisma',
]);

// Check if a file is within a CMS core path
function isCmsCorePath(filePath) {
    return CMS_CORE_PATHS.some(corePath => filePath.startsWith(corePath));
}

const TEMPLATE_REPO = 'https://github.com/danielcadev/cms-nova-template.git';

// --- Args parser ---
function parseArgs(argv) {
    const args = { _: [] };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a.startsWith('--')) {
            const key = a.replace(/^--/, '');
            const next = argv[i + 1];
            if (!next || next.startsWith('--')) {
                args[key] = true;
            } else {
                args[key] = next;
                i++;
            }
        } else {
            args._.push(a);
        }
    }
    return args;
}

function ensureGit() {
    try {
        execSync('git --version', { stdio: 'ignore' });
    } catch {
        console.log(c.error('\n❌ Git is not installed or not in PATH.'));
        console.log(c.info('🔗 Install: https://git-scm.com/downloads\n'));
        process.exit(1);
    }
}

// ═══════════════════════════════════════════
//  CREATE PROJECT
// ═══════════════════════════════════════════
function createProject(projectName) {
    console.log('\n');
    console.log(c.banner(' CMS NOVA '));
    console.log(c.dim(' ──────────────────────────────────────────────'));
    console.log(` 📦 Project: ${c.bold(projectName)}`);
    console.log(` 🎯 ${c.info('Next.js + Prisma + Better Auth + Headless CMS')}`);
    console.log(c.dim(' ──────────────────────────────────────────────\n'));

    const projectPath = path.join(process.cwd(), projectName);

    if (fs.existsSync(projectPath)) {
        console.log(c.error(`❌ Directory "${projectName}" already exists.`));
        process.exit(1);
    }

    ensureGit();

    console.log(c.info('📥 Cloning CMS Nova template...'));
    execSync(`git clone ${TEMPLATE_REPO} "${projectName}"`, { stdio: 'inherit' });

    process.chdir(projectPath);

    console.log(c.info('\n🧹 Cleaning up git history...'));
    if (process.platform === 'win32') {
        execSync('rmdir /s /q .git', { stdio: 'inherit' });
    } else {
        execSync('rm -rf .git', { stdio: 'inherit' });
    }

    console.log(c.info('\n📦 Installing dependencies...'));
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });

    console.log('\n' + c.banner(' SUCCESS '));
    console.log(c.success('\n✅ CMS Nova project created!\n'));
    console.log('👉 Next steps:');
    console.log(`   ${c.dim(`cd ${projectName}`)}`);
    console.log(`   ${c.dim('cp .env.example .env')}`);
    console.log(`   ${c.dim('npm run generate && npm run db:push')}`);
    console.log(`   ${c.dim('npm run dev')}\n`);
}

// ═══════════════════════════════════════════
//  UPGRADE PROJECT (Simplified — Pure Git Diff)
// ═══════════════════════════════════════════
async function upgradeProject(opts) {
    const dryRun = !!opts.dryRun;
    const interactive = opts.interactive !== false;

    console.log('\n');
    console.log(c.banner(' CMS NOVA UPGRADE '));
    ensureGit();

    // 1) Must be inside a git repo
    try {
        execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    } catch {
        console.log(c.error('\n❌ This is not a Git repository.'));
        console.log(c.warn('💡 Run: git init && git add -A && git commit -m "initial"'));
        process.exit(1);
    }

    // 2) Clean working tree check
    if (!opts.allowDirty) {
        const status = execSync('git status --porcelain').toString().trim();
        if (status) {
            console.log(c.error('\n❌ You have uncommitted changes.'));
            console.log(c.warn('💡 Commit or stash before running upgrade.'));
            process.exit(1);
        }
    }

    // 3) Ensure upstream remote
    try {
        execSync('git remote get-url upstream', { stdio: 'ignore' });
    } catch {
        console.log(c.dim(`🔗 Adding remote upstream → ${TEMPLATE_REPO}`));
        execSync(`git remote add upstream ${TEMPLATE_REPO}`, { stdio: 'inherit' });
    }

    // 4) Fetch upstream
    console.log(c.info('\n📡 Fetching latest template...'));
    execSync('git fetch upstream --tags', { stdio: 'inherit' });

    // 5) Resolve target ref
    let targetRef = opts.tag || '';
    if (!targetRef) {
        try {
            const head = execSync('git symbolic-ref -q --short refs/remotes/upstream/HEAD').toString().trim();
            targetRef = head || 'upstream/main';
        } catch {
            targetRef = 'upstream/main';
        }
    }

    // 6) Detect base ref (for smart diff)
    const baseRef = detectBaseRef(targetRef);

    if (!baseRef) {
        console.log(c.warn('\n⚠️  Could not detect base version. Will compare directly against template.'));
    } else {
        console.log(c.primary(`\n🧠 Smart Update`));
        console.log(c.dim(`   Base: ${baseRef.substring(0, 10)} → Target: ${targetRef}`));
    }

    // 7) Create backup tag
    if (!dryRun) {
        const ts = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
        try {
            execSync(`git tag backup-${ts}`, { stdio: 'ignore' });
            console.log(c.success(`\n🏷️  Backup: backup-${ts}`));
        } catch { /* tag already exists, fine */ }
    }

    // 8) Get ALL changed files via git diff (no hardcoded list!)
    const compareRef = baseRef || 'HEAD';
    let changedFiles = [];

    try {
        const diffOut = execSync(`git diff --name-only ${compareRef} ${targetRef}`).toString().trim();
        changedFiles = diffOut ? diffOut.split('\n').filter(Boolean).map(f => f.trim()) : [];
    } catch {
        console.log(c.error('\n❌ Failed to compute diff.'));
        process.exit(1);
    }

    if (changedFiles.length === 0) {
        console.log(c.success('\n✨ Everything is up to date! No changes in the template.'));
        return;
    }

    // 9) Filter: ONLY include files within CMS core paths
    const filesToProcess = changedFiles.filter(f => isCmsCorePath(f));
    const skippedCount = changedFiles.length - filesToProcess.length;

    if (skippedCount > 0) {
        console.log(c.dim(`\n   ℹ️  Skipped ${skippedCount} project-specific files (not CMS core)`));
    }

    // 10) Further filter: only files that actually differ from local
    const filesToUpdate = [];
    for (const file of filesToProcess) {
        // Check if file exists in template
        try {
            execSync(`git cat-file -e ${targetRef}:${file}`, { stdio: 'ignore' });
        } catch {
            continue; // file doesn't exist in template, skip
        }

        // Check if local file is identical (normalize CRLF)
        const absPath = path.join(process.cwd(), file);
        if (fs.existsSync(absPath)) {
            try {
                const local = fs.readFileSync(absPath).toString().replace(/\r/g, '').trim();
                const remote = execSync(`git show ${targetRef}:${file}`, { stdio: 'pipe' }).toString().replace(/\r/g, '').trim();
                if (local === remote) continue; // identical, skip
            } catch { /* can't compare, include it */ }
        }

        filesToUpdate.push(file);
    }

    if (filesToUpdate.length === 0) {
        console.log(c.success('\n✨ All files are already in sync!'));
        await cleanupDeletedFiles(interactive, baseRef, targetRef);
        return;
    }

    console.log(c.warn(`\n📝 ${filesToUpdate.length} files differ from the new version:\n`));

    // 11) Dry run — just show what would change
    if (dryRun) {
        for (const f of filesToUpdate) {
            const label = MERGE_CAREFULLY.has(f) ? c.warn('⚠️  CAREFUL') : c.info('UPDATE');
            console.log(`   ${label}  ${f}`);
        }
        console.log(c.dim('\n(dry-run — no changes applied)'));
        return;
    }

    // 12) Apply changes
    if (!interactive) {
        // Non-interactive: apply all (except MERGE_CAREFULLY, which get skipped)
        let count = 0;
        for (const file of filesToUpdate) {
            if (MERGE_CAREFULLY.has(file)) {
                console.log(c.warn(`   ⚠️  Skipped (needs manual merge): ${file}`));
                continue;
            }
            try {
                execSync(`git checkout ${targetRef} -- "${file}"`, { stdio: 'inherit' });
                count++;
            } catch { /* skip */ }
        }
        commitChanges(count);
        return;
    }

    // 13) Interactive mode
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = (q) => new Promise((resolve) => rl.question(c.bold(q), (a) => resolve((a || '').trim().toLowerCase())));

    let applyAll = null; // 'y' | 'n'
    let anyChange = false;

    for (const file of filesToUpdate) {
        const isCritical = MERGE_CAREFULLY.has(file);
        const exists = fs.existsSync(path.join(process.cwd(), file));

        // Check local modifications
        let locallyModified = false;
        if (baseRef) {
            try {
                const lDiff = execSync(`git diff --name-only ${baseRef} HEAD -- "${file}"`).toString().trim();
                if (lDiff) locallyModified = true;
            } catch { /* ignore */ }
        }

        // Header
        const statusTag = !exists ? c.success('[NEW]') :
            locallyModified ? c.error('[CONFLICT]') :
                isCritical ? c.warn('[CAREFUL]') : c.info('[UPDATE]');

        console.log(`\n  ${statusTag} ${c.bold(file)}`);

        // Safety: never auto-overwrite critical files. They require manual merge.
        if (isCritical) {
            console.log(c.warn('     ⚠️  Manual merge required. This CLI will NOT overwrite this file.'));
            console.log(c.dim(`     Tip: git diff ${targetRef} -- "${file}"`));

            while (true) {
                const ans = await ask(`     ❓ ${c.info('[D]iff')} / ${c.error('[S]kip')}: `);
                if (ans === 'd') {
                    try { execSync(`git diff ${targetRef} -- "${file}"`, { stdio: 'inherit' }); } catch { /* ignore */ }
                    continue;
                }
                if (ans === 's' || ans === 'skip' || ans === 'n' || ans === 'no') {
                    console.log(c.dim('     − Skipped (manual merge)'));
                    break;
                }
                console.log(c.error('     Invalid option.'));
            }

            continue;
        }

        if (locallyModified) {
            console.log(c.warn('     ⚠️  You modified this file locally AND the template changed it.'));
        }

        // If user already chose "apply all" or "skip all"
        if (applyAll === 'y' && !locallyModified && !isCritical) {
            try {
                execSync(`git checkout ${targetRef} -- "${file}"`, { stdio: 'inherit' });
                anyChange = true;
                console.log(c.success('     ✓ Updated (All Yes)'));
            } catch { /* skip */ }
            continue;
        }
        if (applyAll === 'n') {
            console.log(c.dim('     − Skipped (All No)'));
            continue;
        }

        // Ask user
        while (true) {
            const options = locallyModified || isCritical
                ? `${c.success('[Y]es')} / ${c.error('[N]o')} / ${c.info('[D]iff')}`
                : `${c.success('[Y]es')} / ${c.error('[N]o')} / ${c.info('[D]iff')} / ${c.primary('[A]ll Yes')}`;

            const ans = await ask(`     ❓ ${options}: `);

            if (ans === 'd') {
                try { execSync(`git diff ${targetRef} -- "${file}"`, { stdio: 'inherit' }); } catch { /* ignore */ }
                continue;
            }
            if (ans === 'y' || ans === 'yes') {
                try {
                    execSync(`git checkout ${targetRef} -- "${file}"`, { stdio: 'inherit' });
                    anyChange = true;
                    console.log(c.success('     ✓ Updated'));
                } catch { /* skip */ }
                break;
            }
            if (ans === 'n' || ans === 'no') {
                console.log(c.dim('     − Kept local'));
                break;
            }
            if (ans === 'a' && !locallyModified && !isCritical) {
                applyAll = 'y';
                try {
                    execSync(`git checkout ${targetRef} -- "${file}"`, { stdio: 'inherit' });
                    anyChange = true;
                    console.log(c.success('     ✓ Updated'));
                } catch { /* skip */ }
                break;
            }
            console.log(c.error('     Invalid option.'));
        }
    }

    rl.close();
    commitChanges(anyChange ? 1 : 0);

    // Cleanup deleted files
    await cleanupDeletedFiles(interactive, baseRef, targetRef);
}

// ═══════════════════════════════════════════
//  CLEANUP DELETED FILES (auto-detected)
// ═══════════════════════════════════════════
async function cleanupDeletedFiles(interactive, baseRef, targetRef) {
    if (!baseRef) return;

    console.log(c.info('\n🧹 Checking for deprecated files...'));

    let deletedInTemplate = [];
    try {
        const diffOut = execSync(`git diff --name-only --diff-filter=D ${baseRef} ${targetRef}`).toString().trim();
        deletedInTemplate = diffOut ? diffOut.split('\n').filter(Boolean).map(f => f.trim()) : [];
    } catch {
        return;
    }

    // Only files that still exist locally AND are CMS core files
    const zombieFiles = deletedInTemplate
        .filter(f => isCmsCorePath(f))
        .filter(f => fs.existsSync(path.join(process.cwd(), f)));

    if (zombieFiles.length === 0) {
        console.log(c.success('   ✨ No deprecated files found.'));
        return;
    }

    console.log(c.warn(`\n   ⚠️  ${zombieFiles.length} files were DELETED in the new template version:`));
    for (const f of zombieFiles.slice(0, 15)) {
        console.log(`      - ${f}`);
    }
    if (zombieFiles.length > 15) {
        console.log(c.dim(`      ... and ${zombieFiles.length - 15} more.`));
    }

    if (!interactive) return;

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = (q) => new Promise((resolve) => rl.question(c.bold(q), (a) => resolve((a || '').trim().toLowerCase())));

    const ans = await ask('\n   Delete these files? [Y]es / [N]o: ');

    if (ans === 'y' || ans === 'yes') {
        let count = 0;
        for (const file of zombieFiles) {
            try {
                fs.unlinkSync(path.join(process.cwd(), file));
                count++;
            } catch (e) {
                console.log(c.error(`   ❌ Failed to delete ${file}: ${e.message}`));
            }
        }

        // Remove empty directories
        const dirs = [...new Set(zombieFiles.map(f => path.dirname(path.join(process.cwd(), f))))];
        dirs.sort((a, b) => b.length - a.length); // deepest first

        for (const dir of dirs) {
            removeEmptyDirChain(dir);
        }

        console.log(c.success(`   ✅ Deleted ${count} deprecated files.`));
    } else {
        console.log(c.dim('   ⏩ Skipped cleanup.'));
    }

    rl.close();
}

// ═══════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════

function detectBaseRef(targetRef) {
    // 1. Try version tag
    try {
        const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
        if (pkg.version) {
            for (const tag of [`v${pkg.version}`, pkg.version]) {
                try {
                    execSync(`git rev-parse --verify ${tag}`, { stdio: 'ignore' });
                    return tag;
                } catch { /* try next */ }
            }
        }
    } catch { /* no package.json */ }

    // 2. Try merge-base
    try {
        const mergeBase = execSync(`git merge-base HEAD ${targetRef}`).toString().trim();
        if (mergeBase) return mergeBase;
    } catch { /* no common ancestor */ }

    return null;
}

function commitChanges(changeCount) {
    if (changeCount === 0) {
        console.log(c.info('\n   ℹ️  No changes were applied.'));
        return;
    }

    try {
        execSync('git add -A', { stdio: 'inherit' });
        execSync('git commit -m "chore(upgrade): sync with cms-nova template"', { stdio: 'inherit' });
        console.log(c.success('\n✅ Upgrade completed!'));
    } catch {
        console.log(c.warn('\n   ℹ️  Changes applied (no auto-commit).'));
    }
    console.log(c.info('🔧 Tip: If package.json changed, run: npm install'));
}

function removeEmptyDirChain(dir) {
    if (!fs.existsSync(dir)) return;
    try {
        const files = fs.readdirSync(dir);
        if (files.length === 0) {
            fs.rmdirSync(dir);
            removeEmptyDirChain(path.dirname(dir));
        }
    } catch { /* ignore */ }
}

function showHelp() {
    console.log(`
${c.banner(' CMS NOVA CLI ')}

${c.bold('Usage:')}

  ${c.info('Create new project:')}
    npx create-cms-nova my-project

  ${c.info('Upgrade existing project:')}
    npm run nova:upgrade                    Interactive upgrade
    npm run nova:upgrade -- --dry-run       Preview changes
    npm run nova:upgrade -- --tag v2.0.0    Upgrade to specific version

${c.bold('Upgrade options:')}
    --dry-run        Show what would change without applying
    --tag <ref>      Target a specific tag/branch
    --allow-dirty    Allow upgrade with uncommitted changes
    --no-interactive Apply all changes automatically
`);
}

// ═══════════════════════════════════════════
//  ENTRY POINT
// ═══════════════════════════════════════════
const argv = process.argv.slice(2);
const args = parseArgs(argv);
const subcmd = args._[0];

if (args.help || args.h) {
    showHelp();
    process.exit(0);
}

if (subcmd === 'upgrade') {
    (async () => {
        await upgradeProject({
            tag: args.tag,
            dryRun: args['dry-run'],
            interactive: args['no-interactive'] ? false : true,
            allowDirty: !!args['allow-dirty'],
        });
        process.exit(0);
    })();
} else if (subcmd && subcmd !== 'upgrade') {
    if (subcmd === '--help' || subcmd === '-h') {
        showHelp();
    } else {
        createProject(subcmd);
    }
} else {
    showHelp();
}
