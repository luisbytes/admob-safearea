import { AdMobNextGen } from 'capacitor-admob-nextgen';

const BANNER_AD_UNIT_ID = 'ca-app-pub-3940256099942544/9214589741';

window.customElements.define(
  'app-banner',
  class extends HTMLElement {
    constructor() {
      super();

      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
    <style>
      :host {
        display: block;
      }
      h1 {
        font-size: 1.25em;
      }
      button {
        padding: 10px 16px;
        border: 0;
        border-radius: 4px;
        background-color: #8f2028;
        color: #fff;
        font: inherit;
        cursor: pointer;
      }
      button:disabled {
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
    <h1>Capacitor Community AdMob Banner</h1>
    <button id="show-banner" type="button" disabled>Show banner</button>
    <button id="retry" type="button" hidden>Retry</button>
    <p id="loading-state" aria-live="polite">Initializing AdMob SDK...</p>
    <p id="banner-error" role="alert"></p>
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
