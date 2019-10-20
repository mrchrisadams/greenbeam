/*
 * Listens for HTTP request responses, sending first- and
 * third-party requests to storage.
 */
const capture = {

  init() {
    this.addListeners();
  },

  addListeners() {
    // listen for each HTTP response
    this.queue = [];
    browser.webRequest.onResponseStarted.addListener((response) => {
      const eventDetails = {
        type: 'sendThirdParty',
        data: response
      };
      //  Greenbeam. Filtering out urls (eg, the API) to not trigger events.
      if (isBadUrl(response.url)) {
        return;
      } else {
        this.queue.push(eventDetails);
        this.processNextEvent();
      }
    }, {
      urls: ['<all_urls>']
    });
    // listen for tab updates
    browser.tabs.onUpdated.addListener(
      (tabId, changeInfo, tab) => {
        const eventDetails = {
          type: 'sendFirstParty',
          data: {
            tabId,
            changeInfo,
            tab
          }
        };
        if (isBadUrl(tab.url)) {
          return;
        } else {
          this.queue.push(eventDetails);
          this.processNextEvent();
        }
      });
  },

  // Process each HTTP request or tab page load in order,
  // so that async reads/writes to IndexedDB
  // (via sendFirstParty and sendThirdParty) won't miss data
  // The 'ignore' boolean ensures processNextEvent is only
  // executed when the previous call to processNextEvent
  // has completed.
  async processNextEvent(ignore = false) {
    if (this.processingQueue && !ignore) {
      return;
    }
    if (this.queue.length >= 1) {
      try {
        const nextEvent = this.queue.shift();
        this.processingQueue = true;
        switch (nextEvent.type) {
          case 'sendFirstParty':
            await this.sendFirstParty(
              nextEvent.data.tabId,
              nextEvent.data.changeInfo,
              nextEvent.data.tab
            );
            break;
          case 'sendThirdParty':
            await this.sendThirdParty(nextEvent.data);
            break;
          default:
            throw new Error(
              'An event must be of type sendFirstParty or sendThirdParty.'
            );
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        // console.warn('Exception found in queue process', e);
      }
      this.processNextEvent(true);
    } else {
      this.processingQueue = false;
    }
  },

  // Returns true if the request should be stored, otherwise false.
  // info could be a tab (from setFirstParty) or a
  // response (from setThirdParty) object
  async shouldStore(info) {
    const tabId = info.id || info.tabId;
    let documentUrl, privateBrowsing;
    // Ignore container tabs as we need to store them correctly
    //  showing a simpler graph just for default means we won't confuse users
    //  into thinking isolation has broken
    const defaultCookieStore = 'firefox-default';
    if ('cookieStoreId' in info &&
      info.cookieStoreId !== defaultCookieStore) {
      return false;
    }
    //  Eve adding this here to ignore calls to the API
    if (documentUrl === 'api.thegreenwebfoundation.org') {
      return false;
    }
    //  end of eve messing about
    if (this.isVisibleTab(tabId)) {
      const tab = await this.getTab(tabId);
      if (!tab) {
        return;
      }
      if (tab.cookieStoreId !== defaultCookieStore) {
        return false;
      }
      documentUrl = new URL(tab.url);
      privateBrowsing = tab.incognito;
    } else {
      // if we were not able to check the cookie store
      // lets drop this for paranoia sake.
      if (!('cookieStoreId' in info)) {
        return false;
      }
      // browser.tabs.get throws an error for nonvisible tabs (tabId = -1)
      // but some non-visible tabs can make third party requests,
      // ex: Service Workers
      documentUrl = new URL(info.originUrl);
      privateBrowsing = false;
    }

    // ignore about:*, moz-extension:*
    // also ignore private browsing tabs
    if (documentUrl.protocol !== 'about:' &&
      documentUrl.protocol !== 'moz-extension:' &&
      !privateBrowsing) {
      return true;
    }
    return false;
  },

  isVisibleTab(tabId) {
    return tabId !== browser.tabs.TAB_ID_NONE;
  },

  async getTab(tabId) {
    let tab;
    try {
      tab = await browser.tabs.get(tabId);
    } catch (e) {
      // Lets ignore tabs we can't get hold of (likely have closed)
      return;
    }
    return tab;
  },

  // capture third party requests
  async sendThirdParty(response) {
    if (!response.originUrl) {
      // originUrl is undefined for the first request from the browser to the
      // first party site
      return;
    }

    // @todo figure out why Web Extensions sometimes gives
    // undefined for response.originUrl
    const originUrl = response.originUrl ? new URL(response.originUrl) : '';
    const targetUrl = new URL(response.url);
    let firstPartyUrl;
    if (this.isVisibleTab(response.tabId)) {
      const tab = await this.getTab(response.tabId);
      if (!tab) {
        return;
      }
      firstPartyUrl = new URL(tab.url);
    } else {
      firstPartyUrl = new URL(response.originUrl);
    }

    const greenStatus = await checkGreenStatus(targetUrl.hostname);
    const greenCheckData = greenStatus.green;

    //  Eve mostly ends here!!
    if (firstPartyUrl.hostname &&
      targetUrl.hostname !== firstPartyUrl.hostname &&
      targetUrl.hostname !== 'api.thegreenwebfoundation.org' &&
      await this.shouldStore(response)) {
      const data = {
        target: targetUrl.hostname,
        origin: originUrl.hostname,
        requestTime: response.timeStamp,
        firstParty: false,
        greenCheck: greenCheckData
      };
      await store.setThirdParty(
        firstPartyUrl.hostname,
        targetUrl.hostname,
        data
      );

    }
  },

  // capture first party requests
  async sendFirstParty(tabId, changeInfo, tab) {
    const documentUrl = new URL(tab.url);
    // Greenbeam. Checking whether a given website is hosted by renewables.
    // Note that for first parties it may take a while to load.
    const greenStatus = await checkGreenStatus(documentUrl.hostname);
    const greenCheckData = greenStatus.green;
    if (documentUrl.hostname &&
      tab.status === 'complete' && await this.shouldStore(tab)) {
      const data = {
        faviconUrl: tab.favIconUrl,
        firstParty: true,
        requestTime: Date.now(),
        greenCheck: greenCheckData
      };
      await store.setFirstParty(documentUrl.hostname, data);
    }
  }
};


// Greenbeam. The function to check the url against the API
async function checkGreenStatus(url) {
  if (url === 'api.thegreenwebfoundation.org') {
    return;
  } else {
    const response = await fetch(`http://api.thegreenwebfoundation.org/greencheck/${url}`);
    const data = await response.json();
    return data;
  }
}

// Greenbeam. Here we are filtering out anything that starts with a "badURL."
function isBadUrl(url) {
  const badURLS = ['http://127.0.0.1:5500', 'http://api.thegreenwebfoundation.org/greencheck', 'moz-extension://'];
  return badURLS.some(badURL => url.startsWith(badURL));
}

capture.init();