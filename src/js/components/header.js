import { Device } from '@capacitor/device';

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
    <h1>AdMob Banner</h1>
    <p id="device-info">Loading device information...</p>
    `;
    }

    async connectedCallback() {
      const deviceInfoElement = this.shadowRoot.querySelector('#device-info');

      try {
        const deviceInfo = await Device.getInfo();
        const platformInfo =
          deviceInfo.platform === 'android'
            ? `Android ${deviceInfo.osVersion}`
            : `AdMob Banner · ${deviceInfo.platform}`;
        deviceInfoElement.textContent = `${platformInfo} · WebView ${deviceInfo.webViewVersion}`;
      } catch (error) {
        deviceInfoElement.textContent = 'Device information unavailable';
        console.error('Could not read device information', error);
      }
    }
  },
);
