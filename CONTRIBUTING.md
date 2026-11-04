# Contributing to PrizeBond Matching App 🇧🇩

Thank you for your interest in contributing to PrizeBond Matching App! We welcome contributions from developers, designers, translators, and Bangladesh Prize Bond enthusiasts.

## Code of Conduct

Please read and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) in all project interactions.

## How Can I Contribute?

### Reporting Bugs
- Check the issue tracker before creating a new issue.
- Clearly describe the bug, your environment (Windows version, Node.js version), and steps to reproduce.

### Suggesting Enhancements
- Feature requests should explain the motivation and proposed solution.
- Keep the offline and privacy-first focus of the application in mind.

### Pull Requests
1. Fork the repo and create your branch from `main`:
   ```bash
   git checkout -b feature/amazing-feature
   ```
2. Make your changes and test thoroughly:
   ```bash
   npm.cmd run build
   ```
3. Commit your changes with meaningful messages:
   ```bash
   git commit -m 'feat: Add support for quarterly reminder notifications'
   ```
4. Push to your branch and open a Pull Request.

## Coding Guidelines

- Use clean, modern Vue 3 Composition API (`<script setup>`).
- Respect Tailwind CSS v4 conventions.
- Maintain Electron security practices (contextIsolation, no direct nodeIntegration in renderer).
- Ensure SQLite queries preserve leading zeros for bond numbers.
