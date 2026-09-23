import { SplashScreen } from '@capacitor/splash-screen';
import { AdMobNextGen } from 'capacitor-admob-nextgen';

const BANNER_AD_UNIT_ID = 'ca-app-pub-3940256099942544/9214589741';

window.customElements.define(
  'capacitor-welcome',
  class extends HTMLElement {
    constructor() {
      super();

      SplashScreen.hide();

      const root = this.attachShadow({ mode: 'open' });

      root.innerHTML = `
    <style>
      :host {
        background-color: #1A1A1A;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        display: block;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: env(safe-area-inset-top) env(safe-area-inset-right)
          env(safe-area-inset-bottom) env(safe-area-inset-left);
        color: #fff;
      }
      main {
        padding: 15px;
        height: 100%;
      }
      main h1 {
        font-size: 1.25em;
      }
    </style>
    <div>
      <capacitor-welcome-titlebar>
        <h1>AdMob Banner</h1>
      </capacitor-welcome-titlebar>
      <main>
        <h1>Test banner</h1>
      </main>
    </div>
    `;
    }

    async connectedCallback() {
      try {
        await AdMobNextGen.requestConsentInfo();
        await AdMobNextGen.initialize({ isTesting: true });
        await AdMobNextGen.createBanner({
          adUnitId: BANNER_AD_UNIT_ID,
          adSize: 'ADAPTIVE',
          position: 'BOTTOM',
          enableCapacitor8SafeAreaHandling: true,
        });
      } catch (error) {
        console.error('Could not show the AdMob banner', error);
      }
    }
  },
);

window.customElements.define(
  'capacitor-welcome-titlebar',
  class extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
    <style>
      :host {
        position: relative;
        display: block;
        padding: 24px 10px;
        text-align: center;
        background-color: #73B5F6;
      }
      ::slotted(h1) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 0.9em;
        font-weight: 600;
        color: #fff;
      }
    </style>
    <slot></slot>
    `;
    }
  },
);
