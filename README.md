# DemoMarket

A Chrome extension for paper trading on Polymarket. Practice trading without risking real money.

## Features

- **Paper Trading**: Simulate buy/sell trades on Polymarket events
- **Portfolio Dashboard**: Track your holdings, P/L, and trading history
- **Real-time Prices**: Uses live market prices for accurate simulations
- **Persistent State**: Your portfolio is saved locally

## Installation

### Development

```bash
bun install
bun run dev
```

### Build for Production

```bash
bun run build
```

Load the `dist/` folder as an unpacked extension in Chrome. [How to load unpacked extensions](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)

## Usage

1. Install the extension
2. Navigate to any Polymarket event page
3. Click the orange **Demo** button to simulate a trade
4. Open the extension popup to view your dashboard

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run lint` | Run ESLint |
| `bun run format` | Check code formatting |
