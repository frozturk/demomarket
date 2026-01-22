import { defineManifest } from '@crxjs/vite-plugin'
import { version } from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: 'DemoMarket',
  version: version,
  description: "Paper Trading Simulator for Polymarket",
  permissions: ['storage'],
  host_permissions: [
    "https://gamma-api.polymarket.com/*",
    "https://clob.polymarket.com/*"
  ],
  background: {
    service_worker: "src/background/index.ts",
    type: "module"
  },
  content_scripts: [
    {
      js: ["src/content/index.ts"],
      matches: [
        "https://polymarket.com/*"
      ],
      run_at: "document_end"
    }
  ],
  action: {
    default_icon: {
      "16": "src/assets/icon_16.png",
      "32": "src/assets/icon_32.png",
      "128": "src/assets/icon_128.png"
    }
  },
  icons: {
    "16": "src/assets/icon_16.png",
    "32": "src/assets/icon_32.png",
    "128": "src/assets/icon_128.png"
  }
})
