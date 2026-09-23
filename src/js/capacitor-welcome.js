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
        color: #fff;
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
      main h1 {
        font-size: 1.25em;
      }
      main button {
        padding: 10px 16px;
        border: 0;
        border-radius: 4px;
        background-color: #73B5F6;
        color: #fff;
        font: inherit;
        cursor: pointer;
      }
      main button:disabled {
        cursor: wait;
        opacity: 0.6;
      }
      #retry {
        margin-left: 8px;
        background-color: #555;
      }
      #banner-error {
        min-height: 1.5em;
        color: #ff8f8f;
      }
      #loading-state {
        min-height: 1.5em;
        color: #FFD21F;
        font-weight: 600;
      }
    </style>
    <div class="app-shell">
      <div class="safe-area top">Safe area</div>
      <div class="content">
        <capacitor-welcome-titlebar>
          <h1>AdMob Banner</h1>
        </capacitor-welcome-titlebar>
        <main>
          <h1>Test banner</h1>
          <button id="show-banner" type="button" disabled>Show banner</button>
          <button id="retry" type="button" hidden>Retry</button>
          <p id="loading-state" aria-live="polite">Initializing AdMob SDK...</p>
          <p id="banner-error" role="alert"></p>
        </main>
      </div>
      <div class="safe-area bottom">Safe area</div>
    </div>
    `;
    }

    async connectedCallback() {
      const button = this.shadowRoot.querySelector('#show-banner');
      const retryButton = this.shadowRoot.querySelector('#retry');
      const loadingState = this.shadowRoot.querySelector('#loading-state');
      const errorMessage = this.shadowRoot.querySelector('#banner-error');

      button.addEventListener('click', () =>
        this.showBanner(button, retryButton, errorMessage, loadingState),
      );
      retryButton.addEventListener('click', () =>
        this.retry(button, retryButton, errorMessage, loadingState),
      );

      await this.initializeAdMob(button, retryButton, errorMessage, loadingState);
    }

    async initializeAdMob(button, retryButton, errorMessage, loadingState) {
      this.retryAction = 'init';
      button.hidden = false;
      button.disabled = true;
      retryButton.hidden = true;
      errorMessage.textContent = '';
      loadingState.textContent = 'Initializing AdMob SDK...';

      try {
        await AdMobNextGen.requestConsentInfo();
        await AdMobNextGen.initialize({ isTesting: true });
        loadingState.textContent = 'Ready to show banner';
        button.disabled = false;
      } catch (error) {
        loadingState.textContent = 'AdMob initialization failed';
        errorMessage.textContent = `Could not initialize AdMob: ${error.message}`;
        retryButton.hidden = false;
        console.error('Could not initialize AdMob', error);
      }
    }

    async showBanner(button, retryButton, errorMessage, loadingState) {
      this.retryAction = 'show';
      button.disabled = true;
      retryButton.hidden = true;
      loadingState.textContent = 'Loading banner...';
      errorMessage.textContent = '';
      let bannerShown = false;

      try {
        await AdMobNextGen.createBanner({
          adUnitId: BANNER_AD_UNIT_ID,
          adSize: 'ADAPTIVE',
          position: 'BOTTOM',
          isAutoShow: true,
          enableCapacitor8SafeAreaHandling: true,
        });
        loadingState.textContent = 'Banner ready';
        bannerShown = true;
        button.hidden = true;
      } catch (error) {
        loadingState.textContent = 'Banner loading failed';
        errorMessage.textContent = `Could not show the AdMob banner: ${error.message}`;
        retryButton.hidden = false;
        console.error('Could not show the AdMob banner', error);
      } finally {
        button.disabled = bannerShown;
      }
    }

    async retry(button, retryButton, errorMessage, loadingState) {
      retryButton.disabled = true;

      if (this.retryAction === 'init') {
        await this.initializeAdMob(button, retryButton, errorMessage, loadingState);
      } else {
        await this.showBanner(button, retryButton, errorMessage, loadingState);
      }

      retryButton.disabled = false;
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
        padding: 10px;
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
