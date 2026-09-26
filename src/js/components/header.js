import { Device } from '@capacitor/device';
import capacitorPackage from '@capacitor/core/package.json';

window.customElements.define(
  'app-header',
  class extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
    <style>
      :host {
        position: relative;
        display: block;
        padding: 12px;
        text-align: center;
        background-color: #8f2028;
        color: #fff;
      }
      h1 {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 1.25em;
        font-weight: 600;
      }
      p {
        margin: 4px 0 0;
        color: #f7d9dc;
        font-size: 0.9em;
      }
    </style>
    <h1 id="android-info">Loading Android info...</h1>
    <p id="webview-info">Loading device information...</p>
    `;
    }

    async connectedCallback() {
      const androidInfoElement = this.shadowRoot.querySelector('#android-info');
      const webviewInfoElement = this.shadowRoot.querySelector('#webview-info');

      try {
        const deviceInfo = await Device.getInfo();

        const androidInfo =`Android ${deviceInfo.osVersion}`;
        const webviewInfo = `WebView ${deviceInfo.webViewVersion} · Capacitor ${capacitorPackage.version}`;

        androidInfoElement.textContent = androidInfo;
        webviewInfoElement.textContent = webviewInfo;
      } catch (error) {
        androidInfoElement.textContent = 'Android information unavailable';
        webviewInfoElement.textContent = 'Device information unavailable';
        
        console.error('Could not read device information', error);
      }
    }
  },
);
