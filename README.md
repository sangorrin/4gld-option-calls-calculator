# GoldRent Assistant — 4GLD Covered Call Income Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](./LICENSE)
[![Deploy to GitHub Pages](https://github.com/actions/workflows/deploy.yml/badge.svg)](../../actions)

An automated Covered Call strategy planner, probability engine, and historical backtester for **Xetra-Gold (4GLD:XETR)**. Designed to turn physical gold holdings into a recurring monthly cash income stream without taking on unlimited risk.

---

## ⚠️ Important Disclaimer

> **Disclaimer:** This software is for educational and informational purposes only and does not constitute financial, investment, or trading advice. Options trading involves substantial risk of loss and is not suitable for every investor. The author accepts no liability for any financial losses incurred from using this tool or its models.

---

## What is 4GLD Covered Call Strategy?

- **4GLD (ISIN: DE000A0S9GB0):** Exchange-traded commodity listed on Deutsche Börse Xetra (Frankfurt). Each share represents **1 gram of 99.99% pure physical gold** stored in Clearstream Banking vaults in Frankfurt.
- **The Covered 100-Share Rule:** 1 European option contract equals exactly 100 shares (100 grams of physical gold). A Call option is strictly *Covered* when you own the 100 shares in your portfolio before selling the Call. Because you own the underlying physical asset, there is **zero unlimited risk**.
- **Recurring Cash Income ("Gold Rent"):** You sell out-of-the-money (OTM) Call options 15 to 30 days out. You receive an upfront, non-refundable cash premium credited immediately to your brokerage account. If gold stays below the agreed strike price, you keep 100% of the cash and keep your gold, repeating month after month for an annualized yield of 10%–20%.

---

## Key Features

1. **Dual Algorithmic Models (Always Displayed Side-by-Side):**
   - **Algorithm 1: José Luis Cava Model (Trend & Resistance):** Uses SMA 20 and SMA 50 to classify the market regime (Bullish, Neutral, Bearish). In bull markets, it selects short durations (15 DTE) and strikes above major swing-high resistance (R1) to avoid early assignment. In neutral/bear markets, it targets 30 DTE above resistance R2.
   - **Algorithm 2: Quantitative Delta Model (~0.16 Delta, ~84% Probability):** Uses 30-day Annualized Historical Volatility ($\text{HV}$) of log returns and the Black-Scholes Gaussian normal distribution to target a $\approx 0.16\text{ Delta}$ strike ($\approx 1\text{ standard deviation}$ OTM), providing a calibrated $\approx 84\%$ statistical probability of expiring worthless.

2. **Automatic Traffic-Light Market Regime Indicator:**
   - 🟢 **Green (Favorable):** Gold extended into resistance, elevated RSI, or high volatility regime. Prime moment to capture rich premiums.
   - 🟡 **Yellow (Neutral):** Standard market equilibrium; follow algorithmic strike rules.
   - 🔴 **Red (Caution / Wait):** Sharp oversold conditions (RSI < 35 or price > 3.5% below SMA 20). Alerts you to wait for a bounce before selling calls at local bottoms.

3. **Freedom24 Step-by-Step Execution Guide:**
   - Exact order parameters: Ticker, option chain, target expiry date, strike ceiling, and order type with a 1-click **Copy Instructions** button.

6. **Technical Indicators Chart (Live Dashboard):**
   - Interactive chart displaying price history with user-selectable lookbacks (30D, 60D default, 90D, 180D).
   - Plots daily Fast SMA 20 (yellow), Slow SMA 50 (blue), Swing-High Resistances R1 & R2 (orange/red), and the Quantitative 0.16 Delta ceiling (purple).

7. **TradingView Pine Script (v5 Indicator):**
   - Includes ready-to-paste TradingView Pine Script v5 code plotting the moving averages, dynamic pivot resistances, 0.16 Delta statistical ceiling, and real-time dashboard table directly onto TradingView charts.

8. **Historical Backtesting ("Test on Past Data"):**
   - Slices real historical Frankfurt market data strictly up to the chosen date with **zero lookahead bias**.
   - Evaluates both algorithms simultaneously against actual future expiration prices.
   - Visualizes price trajectory against recommended strike levels on an interactive SVG chart.
   - Summarizes plain-language investor outcomes (e.g. kept 100% premium + retained all gold vs. assigned at strike with capital gains).

9. **Bilingual Support (English & Spanish):**
   - Instant language switcher (`🇬🇧 EN` / `🇪🇸 ES`) with full translations across all dashboards, formulas, and educational glossaries.

10. **Interactive Scenario Simulator & Educational Glossary:**
    - Move the expiration price slider to inspect P&L, cash premium retained, and assignment status.
    - Plain-language accordion explanations covering 4GLD physical backing, covered call mechanics, and time decay ($\Theta$).

---

## Local Development & Setup

This application is built with React, Vite, and Tailwind CSS. It requires Node.js (v22 or v24 LTS).

```bash
# Clone the repository
git clone https://github.com/your-username/4gld-option-calls-calculator.git
cd 4gld-option-calls-calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## GitHub Pages Deployment

The repository includes an automated GitHub Actions workflow in `.github/workflows/deploy.yml`.

To deploy:
1. Push the code to the `main` (or `master`) branch on GitHub.
2. In your repository on GitHub, navigate to **Settings** &rarr; **Pages**.
3. Under **Build and deployment** &rarr; **Source**, select **GitHub Actions**.
4. The workflow will automatically build and publish your site to `https://<username>.github.io/<repo>/`.

---

## Market Data Source

- **Default:** Includes a verified Frankfurt XETRA daily candle dataset covering physical 4GLD prices.
- **Live Stream (Optional):** Enter your free API key from [Twelve Data](https://twelvedata.com) via the settings modal in the header. The key is stored solely in your local browser's `localStorage` and queries `4GLD:XETR` directly from the client.

---

## License

This project is licensed under the [MIT License](./LICENSE).
