# GitHub Branch Protection Configuration Guide

## Overview

This guide explains how to configure GitHub branch protection rules to enforce CI checks and prevent merging of failing pull requests.

---

## Required GitHub Actions Workflows

The following workflows are configured in `.github/workflows/`:

1. **`ci.yml`** - Main CI pipeline with 6 jobs:
   - Code Quality (ESLint + Prettier)
   - TypeScript Type Checking
   - Unit & Integration Tests
   - Build Verification
   - Security Audit
   - CI Success Check (final status)

2. **`test-coverage.yml`** - Test coverage reporting:
   - Generates coverage reports
   - Enforces minimum 70% coverage threshold
   - Posts coverage summary on PRs
   - Optional Codecov integration

---

## Branch Protection Setup

### Step 1: Access Branch Protection Settings

1. Go to your GitHub repository
2. Click **Settings** → **Branches**
3. Under "Branch protection rules", click **Add rule**

### Step 2: Configure Protection for `main` Branch

**Branch name pattern:** `main`

#### Required Settings

✅ **Require a pull request before merging**

- Require approvals: 1 (recommended)
- Dismiss stale pull request approvals when new commits are pushed: ✅
- Require review from Code Owners: ✅ (if CODEOWNERS file exists)

✅ **Require status checks to pass before merging**

- Require branches to be up to date before merging: ✅

**Required status checks (select all):**

- ✅ `Code Quality`
- ✅ `TypeScript Type Check`
- ✅ `Tests`
- ✅ `Build`
- ✅ `Security Audit`
- ✅ `CI Success` (most important - this is the final gate)

✅ **Require conversation resolution before merging**

- All review comments must be resolved: ✅

✅ **Require linear history** (optional, recommended)

- Prevents merge commits, enforces rebase/squash: ✅

✅ **Do not allow bypassing the above settings**

- Include administrators: ✅ (recommended for strict enforcement)

#### Optional but Recommended Settings

⚠️ **Require deployments to succeed before merging** (if you have staging)
⚠️ **Lock branch** - Prevents any direct pushes (even from admins)
⚠️ **Restrict who can push to matching branches** - Limit to specific users/teams

### Step 3: Configure Protection for `develop` Branch

Repeat Step 2 with the following adjustments:

**Branch name pattern:** `develop`

**Recommended differences from `main`:**

- Require approvals: 0 or 1 (more flexible for active development)
- Include administrators: ❌ (allow admins to bypass for hotfixes)
- Same required status checks as `main`

### Step 4: Save and Test

1. Click **Create** to save the branch protection rule
2. Test by creating a pull request that:
   - ✅ Passes all checks → Should allow merge
   - ❌ Fails any check → Should block merge

---

## Verifying Branch Protection

### Test Scenario 1: Failing Tests

1. Create a new branch: `git checkout -b test/failing-tests`
2. Break a test intentionally
3. Commit and push: `git push origin test/failing-tests`
4. Create a PR to `main`
5. **Expected:** CI fails, merge is blocked with message:
   ```
   Merging is blocked
   Required status check "CI Success" has not succeeded
   ```

### Test Scenario 2: TypeScript Errors

1. Create a new branch: `git checkout -b test/ts-error`
2. Introduce a TypeScript error
3. Commit and push
4. Create a PR to `main`
5. **Expected:** TypeScript Type Check fails, merge is blocked

### Test Scenario 3: Linting Errors

1. Create a new branch: `git checkout -b test/lint-error`
2. Add code that violates ESLint rules (e.g., `console.log()`)
3. Commit and push
4. Create a PR to `main`
5. **Expected:** Code Quality check fails, merge is blocked

---

## CI Job Details

### Job 1: Code Quality

**Checks:** ESLint + Prettier formatting  
**Fails if:** Linting errors or formatting issues exist  
**Fix:** Run `npm run lint` and `npx prettier --write .`

### Job 2: TypeScript Type Check

**Checks:** TypeScript compilation without emitting files  
**Fails if:** Any TypeScript errors exist  
**Fix:** Run `npx tsc --noEmit` and fix errors

### Job 3: Tests

**Checks:** All unit and integration tests  
**Fails if:** Any test fails or times out  
**Fix:** Run `npm test` locally and fix failing tests

### Job 4: Build

**Checks:** Production build completes successfully  
**Fails if:** Build errors or dist/ directory missing  
**Fix:** Run `npm run build` and fix build errors

### Job 5: Security Audit

**Checks:** High/critical npm vulnerabilities  
**Fails if:** High or critical vulnerabilities found  
**Fix:** Run `npm audit fix` or update vulnerable packages

### Job 6: CI Success

**Checks:** All previous jobs succeeded  
**Fails if:** Any previous job failed  
**Purpose:** Single required check that represents overall CI status

---

## Status Check Labels

When viewing a PR, you'll see these status checks:

| Status                                              | Meaning                     |
| --------------------------------------------------- | --------------------------- |
| ✅ **All checks have passed**                       | Ready to merge              |
| 🟡 **Some checks haven't completed yet**            | Wait for CI to finish       |
| ❌ **Some checks were not successful**              | Fix failures before merging |
| ⚪ **Expected — Waiting for status to be reported** | CI hasn't started yet       |

---

## Troubleshooting

### Issue: "Required status check 'CI Success' is not present"

**Cause:** The workflow hasn't run yet or the job name changed  
**Solution:**

1. Push a commit to trigger the workflow
2. Wait for workflow to complete
3. The status check will appear in branch protection settings
4. Select it as required

### Issue: "Merge blocked but all checks show green"

**Cause:** Branch is not up to date with base branch  
**Solution:**

1. Pull latest changes: `git pull origin main`
2. Rebase your branch: `git rebase main`
3. Force push: `git push --force-with-lease`

### Issue: "CI takes too long to run"

**Current timeouts:**

- Code Quality: 10 minutes
- Type Check: 10 minutes
- Tests: 15 minutes
- Build: 15 minutes
- Security: 10 minutes

**Optimization:**

1. Use `npm ci` instead of `npm install` (already implemented)
2. Cache node_modules (already implemented)
3. Run jobs in parallel (already implemented)
4. Consider splitting large test suites

### Issue: "Security audit fails for acceptable vulnerabilities"

**Solution 1 (Temporary):** Acknowledge vulnerability

```bash
npm audit fix
# or for breaking changes
npm audit fix --force
```

**Solution 2 (Permanent):** Update package

```bash
npm update package-name
# or
npm install package-name@latest
```

**Solution 3 (Override):** If vulnerability is acceptable, modify `.github/workflows/ci.yml`:

```yaml
- name: Run npm audit
  run: npm audit --audit-level=critical # Only fail on critical
```

---

## Emergency Bypass Procedures

### Scenario: Critical hotfix needed immediately

**Option 1: Temporary disable protection (NOT RECOMMENDED)**

1. Settings → Branches → Edit rule
2. Uncheck "Include administrators"
3. Admin can force merge
4. Re-enable protection immediately after

**Option 2: Create hotfix PR with fast track**

1. Create `hotfix/*` branch
2. Fix the critical issue
3. Request expedited review
4. Ensure all CI checks still pass
5. Merge as soon as checks complete

**Option 3: Branch-specific exception**

1. Create exception rule for `hotfix/*` branches
2. Less strict requirements (e.g., 0 reviewers)
3. Still require CI to pass

---

## Best Practices

### ✅ DO:

- Always wait for CI to complete before requesting review
- Fix failing checks immediately
- Keep PRs small (easier to pass CI quickly)
- Run tests locally before pushing: `npm test`
- Run linting locally: `npm run lint`
- Test build locally: `npm run build`

### ❌ DON'T:

- Force push to `main` or `develop` directly
- Bypass CI checks unless absolute emergency
- Ignore failing tests
- Commit with linting errors
- Merge PRs with unresolved conversations
- Disable branch protection permanently

---

## CI Pipeline Diagram

```
┌─────────────────────────────────────────┐
│         Pull Request Created            │
└─────────────┬───────────────────────────┘
              │
              ▼
    ┌─────────────────────┐
    │  Trigger CI Pipeline │
    └─────────┬───────────┘
              │
              ├────────────────────────────────┐
              │                                │
              ▼                                ▼
    ┌──────────────────┐          ┌──────────────────┐
    │  Code Quality    │          │  Type Check      │
    │  (ESLint+Prettier)│          │  (TypeScript)    │
    └────────┬─────────┘          └────────┬─────────┘
              │                                │
              │                                │
              ├────────────┬───────────────────┤
              │            │                   │
              ▼            ▼                   ▼
    ┌──────────────┐ ┌──────────┐  ┌──────────────┐
    │    Tests     │ │  Build   │  │   Security   │
    └──────┬───────┘ └─────┬────┘  └──────┬───────┘
           │               │               │
           └───────────────┴───────────────┘
                           │
                           ▼
                ┌────────────────────┐
                │    CI Success      │
                │  (Final Gate)      │
                └─────────┬──────────┘
                          │
                ┌─────────┴──────────┐
                │                    │
                ▼                    ▼
        ┌──────────────┐    ┌──────────────┐
        │  ✅ PASSED   │    │  ❌ FAILED   │
        │  Can Merge   │    │ Blocked      │
        └──────────────┘    └──────────────┘
```

---

## Monitoring CI Performance

### View CI Metrics

1. Go to **Actions** tab in GitHub
2. Click on **CI Pipeline** workflow
3. View recent runs and success rate

### Key Metrics to Monitor

- **Success Rate:** Should be > 95%
- **Average Duration:** Target < 10 minutes total
- **Queue Time:** Should be < 1 minute
- **Failure Rate by Job:** Identify problematic jobs

### Improving CI Speed

1. **Parallelize jobs:** Already implemented ✅
2. **Cache dependencies:** Already implemented ✅
3. **Optimize tests:** Remove slow/flaky tests
4. **Use matrix builds:** For multiple Node versions (optional)

---

## Summary Checklist

Setup complete when:

- [ ] `.github/workflows/ci.yml` exists and is configured
- [ ] `.github/workflows/test-coverage.yml` exists
- [ ] Branch protection enabled for `main`
- [ ] Branch protection enabled for `develop`
- [ ] Required status checks selected:
  - [ ] Code Quality
  - [ ] TypeScript Type Check
  - [ ] Tests
  - [ ] Build
  - [ ] Security Audit
  - [ ] CI Success
- [ ] Test PR created and verified:
  - [ ] Passing PR can merge
  - [ ] Failing PR is blocked
- [ ] Team notified of new requirements
- [ ] Documentation updated in README

---

## Additional Resources

- [GitHub Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Status Checks API](https://docs.github.com/en/rest/commits/statuses)

---

**Last Updated:** October 7, 2025  
**Maintained by:** Development Team
