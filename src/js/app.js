import { SplashScreen } from '@capacitor/splash-screen';

import './components/banner.js';
import './components/header.js';

window.customElements.define(
  'app-root',
  class extends HTMLElement {
    constructor() {
      super();

      SplashScreen.hide();

      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
    <style>
      :host {
        display: block;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        background-color: #1A1A1A;
        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .app-shell {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
      }
      .safe-area {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 0;
        overflow: hidden;
        background-color: #b89920;
        color: #fff;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .safe-area.top {
        height: env(safe-area-inset-top);
      }
      .safe-area.bottom {
        height: env(safe-area-inset-bottom);
      }
      .content {
        flex: 1;
        min-height: 0;
        overflow: auto;
      }
      main {
        padding: 15px;
        height: 100%;
      }
    </style>
    <div class="app-shell">
      <div class="safe-area top">Safe area</div>
      <div class="content">
        <app-header></app-header>
        <main>
          <app-banner></app-banner>
        </main>
      </div>
      <div class="safe-area bottom">Safe area</div>
    </div>
    `;
    }
  },
);
