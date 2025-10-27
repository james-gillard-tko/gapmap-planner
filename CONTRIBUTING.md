# Contributing to GapMap Planner

Thank you for your interest in contributing to GapMap Planner! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (browser, OS, Node version)

### Suggesting Features

Feature requests are welcome! Please:
- Check existing issues first to avoid duplicates
- Clearly describe the feature and its use case
- Explain why it would benefit the project

### Pull Requests

1. **Fork the repository** and create a new branch from `main`
2. **Make your changes** following the code style guidelines
3. **Test your changes** locally
4. **Update documentation** if needed
5. **Write clear commit messages** describing what and why
6. **Submit a pull request** with a clear description

#### Code Style

- Use TypeScript for type safety
- Follow existing code formatting (Prettier/ESLint)
- Write descriptive variable and function names
- Add comments for complex logic
- Keep functions small and focused

#### Commit Messages

Follow conventional commits format:
```
feat: add export to CSV functionality
fix: resolve polygon closing detection bug
docs: update installation instructions
refactor: simplify tile filtering logic
```

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/gapmap-planner.git
cd gapmap-planner

# Install dependencies
npm install

# Start development server
npm run dev

# Run type checking
npm run build
```

### Testing

Before submitting a PR:
- Ensure the app builds without errors (`npm run build`)
- Test the polygon drawing functionality
- Verify the map loads correctly
- Check browser console for errors

## Project Structure

```
gapmap-planner/
├── src/
│   ├── components/     # React components
│   │   ├── Map/       # Map-related components
│   │   └── ui/        # shadcn/ui components
│   ├── types/         # TypeScript type definitions
│   └── App.tsx        # Main application component
├── public/
│   └── data/          # GeoJSON data files
└── Dockerfile         # EDITO deployment configuration
```

## Areas for Contribution

### High Priority
- Integration with GEBCO/EMODnet APIs
- Real bathymetry data fetching
- Export functionality (CSV, GeoJSON)
- Performance optimization for large datasets

### Medium Priority
- Additional map layers and base maps
- Advanced filtering options
- User authentication for EDITO
- Mobile responsiveness improvements

### Good First Issues
- UI/UX improvements
- Documentation enhancements
- Bug fixes
- Test coverage

## Questions?

If you have questions about contributing, feel free to:
- Open a discussion on GitHub
- Reach out via the issue tracker

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
