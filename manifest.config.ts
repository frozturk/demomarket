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
  action: {
    default_icon: "src/assets/icon.png"
  },
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
  ]
})
