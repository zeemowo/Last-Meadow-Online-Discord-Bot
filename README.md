# 🌿 Last Meadow Online Discord Bot

A minimal, high-efficiency automation script for the new Discord game activity.

## 🚀 Features

- **Gathering Loop**: Fast-paced harvesting (1.5s intervals).
- **Crafting Loop**: Automated crafting with optimized cooldowns (2m 30s).
- **Combat Loop**: Battle automation with safety buffers (3m cooldown).

## 🛠️ Setup

1. **Clone the repo**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Discord credentials:
   ```env
   TOKEN=your_token_here
   COOKIES=your_full_cookie_string_here
   SUPER_PROPERTIES=your_x_super_properties_base64_here
   ```
   *Note: You can find these by inspecting network requests in your browser while playing the game activity.*
4. **Run the bot**:
   ```bash
   node start
   ```

## ⚠️ Disclaimer

This bot is for educational purposes. Using automated scripts on Discord can lead to account restrictions. Use at your own risk.

---

*Vibe coded with ⚡ by **Gemini CLI***
