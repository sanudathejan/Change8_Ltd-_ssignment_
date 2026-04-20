# Branch Strategy Guide

## Main Branches

### `main` (Production)
- **Protected**: No direct pushes
- **Deployment**: Automatic deployment on merge
- **Merge From**: `release/*` branches only
- **Version**: Follows Semantic Versioning

### `develop` (Development)
- **Base branch**: Feature branches originate here
- **Testing**: Continuous integration tests run
- **Merge From**: Completed feature branches

## Feature Branches

### Naming Convention: `feature/<feature-name>`

Examples:
- `feature/user-authentication`
- `feature/product-management`
- `feature/order-processing`
- `feature/admin-dashboard`

**Workflow:**
1. Create branch from `develop`: `git checkout -b feature/your-feature develop`
2. Make commits with clear messages
3. Create Pull Request to `develop`
4. Require code review before merge
5. Delete branch after merge

## Bug Fix Branches

### Naming Convention: `bugfix/<bug-name>`

Examples:
- `bugfix/login-validation`
- `bugfix/product-filter`

**Workflow:** Same as feature branches

## Release Branches

### Naming Convention: `release/v<version>`

Examples:
- `release/v1.0.0`
- `release/v1.1.0`

**Workflow:**
1. Create from `develop`
2. Final testing and fixes
3. Merge to `main`
4. Tag with version: `git tag -a v1.0.0 -m "Version 1.0.0"`
5. Merge back to `develop`

## Commit Message Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

### Examples:
```
feat(auth): implement JWT token refresh
fix(product): resolve stock calculation bug
docs(readme): update setup instructions
```

## Development Workflow

```
main (production)
  ↑
  └─ release/v1.0.0 (hot fixes)
         ↑
         └─ develop
              ↑
              ├─ feature/user-mgmt
              ├─ feature/products
              ├─ bugfix/login-issue
              └─ feature/orders
```

## Commands Cheatsheet

```bash
# Create feature branch
git checkout -b feature/your-feature develop

# Push feature branch
git push origin feature/your-feature

# Create Pull Request (PR)
# Done on GitHub/GitLab

# After PR approved and merged to develop
git checkout develop
git pull origin develop
git branch -d feature/your-feature

# Create release branch
git checkout -b release/v1.0.0 develop
git push origin release/v1.0.0

# After final testing, merge to main
git checkout main
git pull origin main
git merge --no-ff release/v1.0.0
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin main --tags

# Merge back to develop
git checkout develop
git merge --no-ff release/v1.0.0
git push origin develop
```
