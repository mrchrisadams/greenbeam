const lightbeam = {
  websites: {},
  dataGatheredSince: null,
  numFirstParties: 0,
  numThirdParties: 0,
  numGreenSites: 0,

  async init() {



    console.log('initialising the viz')
    this.websites = await storeChild.getAll();
    this.initTPToggle();
    this.renderGraph();
    this.addListeners();
    this.updateVars();
  },

  async initTPToggle() {
    const toggleCheckbox = document.getElementById('tracking-protection-control');
    const trackingProtection = document.getElementById('tracking-protection');
    const trackingProtectionDisabled = document.getElementById('tracking-protection-disabled');
    // Do we support setting TP
    if ('trackingProtectionMode' in browser.privacy.websites) {
      trackingProtection.hidden = false;
      trackingProtectionDisabled.hidden = true;

      const trackingProtectionState = await browser.privacy.websites.trackingProtectionMode.get({});
      let value = true;
      if (trackingProtectionState.value !== 'always') {
        value = false;
      }
      toggleCheckbox.checked = value;
      toggleCheckbox.addEventListener('change', () => {
        const value = toggleCheckbox.checked ? 'always' : 'private_browsing';
        browser.privacy.websites.trackingProtectionMode.set({
          value
        });
      });
    } else {
      trackingProtection.hidden = true;
      trackingProtectionDisabled.hidden = false;
    }
  },


  renderGraph() {
    const transformedData = this.transformData();
    viz.init(transformedData.nodes, transformedData.links);
  },

  addListeners() {
    // this.importData()
    this.downloadData();
    this.resetData();
    storeChild.onUpdate((data) => {
      this.redraw(data);
    });
  },

  // Called from init() (isFirstParty = undefined)
  // and redraw() (isFirstParty = true or false).
  async updateVars(isFirstParty) {

    // initialize dynamic vars from storage
    if (!this.dataGatheredSince) {
      const {
        dateStr,
        fullDateTime
      } = await this.getDataGatheredSince();
      if (!dateStr) {
        return;
      }
      this.dataGatheredSince = dateStr;
      const dataGatheredSinceElement = document.getElementById('data-gathered-since');
      dataGatheredSinceElement.textContent = this.dataGatheredSince || '';
      dataGatheredSinceElement.setAttribute('datetime', fullDateTime || '');
    }
    if (this.numGreenSites === 0) {
      this.numGreenSites = await this.getNumGreenSites();
    }
    if (isFirstParty === undefined) {
      this.numFirstParties = await this.getNumFirstParties();
      this.setPartyVar('firstParty');
      this.numThirdParties = await this.getNumThirdParties();
      this.setPartyVar('thirdParty');
      return;
    }

    // update on redraw
    if (isFirstParty) {
      this.numFirstParties++;
      this.setPartyVar('firstParty');
    } else {
      this.numThirdParties++;
      this.setPartyVar('thirdParty');
      this.numGreenSites = await this.getNumGreenSites();
    }
  },

  // Updates dynamic variable values in the page
  setPartyVar(party) {
    const numFirstPartiesElement = document.getElementById('num-first-parties');
    const numThirdPartiesElement = document.getElementById('num-third-parties');
    const numGreenSitesElement = document.getElementById('num-green-sites');
    if (party === 'firstParty') {
      if (this.numFirstParties === 0) {
        numFirstPartiesElement.textContent = '';
        numGreenSitesElement.textContent = '';
      } else {
        numFirstPartiesElement.textContent = `${this.numFirstParties} Sites`;
      }
    } else if (this.numThirdParties === 0) {
      numThirdPartiesElement.textContent = '';
    } else {
      const str = `${this.numThirdParties} Third Party Sites`;
      numThirdPartiesElement.textContent = str;
      const greenPct = (this.numGreenSites / (this.numThirdParties + this.numFirstParties) * 100).toFixed(0);
      numGreenSitesElement.textContent = `${greenPct}%`;
    }
  },

  async getDataGatheredSince() {
    const firstRequestUnixTime = await storeChild.getFirstRequestTime();
    if (!firstRequestUnixTime) {
      return {};
    }
    // reformat unix time
    let fullDateTime = new Date(firstRequestUnixTime);
    let dateStr = fullDateTime.toDateString();
    // remove day of the week
    const dateArr = dateStr.split(' ');
    dateArr.shift();
    dateStr = dateArr.join(' ');
    // ISO string used for datetime attribute on <time>
    fullDateTime = fullDateTime.toISOString();
    return {
      dateStr,
      fullDateTime
    };
  },

  async getNumFirstParties() {
    return await storeChild.getNumFirstParties();
  },

  async getNumThirdParties() {
    return await storeChild.getNumThirdParties();
  },

  async getNumGreenSites() {
    return await storeChild.getNumGreenSites();
  },

  // transforms the object of nested objects 'websites' into a
  // usable format for d3
  /*
    websites is expected to match this format:
    {
      "www.firstpartydomain.com": {
        favicon: "http://blah...",
        firstParty: true,
        firstPartyHostnames: false,
        hostname: "www.firstpartydomain.com",
        thirdParties: [
          "www.thirdpartydomain.com",
          ...
        ]
      },
      "www.thirdpartydomain.com": {
        favicon: "",
        firstParty: false,
        firstPartyHostnames: [
          "www.firstpartydomain.com",
          ...
        ],
        hostname: "www.thirdpartydomain.com",
        thirdParties: []
      },
      ...
    }

    nodes is expected to match this format:
    [
      {
        favicon: "http://blah...",
        firstParty: true,
        firstPartyHostnames: false,
        hostname: "www.firstpartydomain.com",
        thirdParties: [
          "www.thirdpartydomain.com",
          ...
        ]
      },
      {
        favicon: "",
        firstParty: false,
        firstPartyHostnames: [
          "www.firstpartydomain.com",
          ...
        ],
        hostname: "www.thirdpartydomain.com",
        thirdParties: []
      },
      ...
    ]

    links is expected to match this format:
    [
      {
        source: {
          favicon: "http://blah...",
          firstParty: true,
          firstPartyHostnames: false,
          hostname: "www.firstpartydomain.com",
          thirdParties: [
            "www.thirdpartydomain.com",
            ...
          ]
        },
        target: {
          favicon: "",
          firstParty: false,
          firstPartyHostnames: [
            "www.firstpartydomain.com",
            ...
          ],
          hostname: "www.thirdpartydomain.com",
          thirdParties: []
        }
      },
      ...
    ]
  */
  transformData() {
    const nodes = [];
    let links = [];
    for (const website in this.websites) {
      const site = this.websites[website];
      if (site.thirdParties) {
        const thirdPartyLinks = site.thirdParties.map((thirdParty) => {
          return {
            source: website,
            target: thirdParty
          };
        });
        links = links.concat(thirdPartyLinks);
      }
      nodes.push(this.websites[website]);
    }
    console.log({ nodes, links })

    return {
      nodes,
      links
    };
  },

  importData() {

    const importDataButton = document.getElementById('import-data-button');
    console.log(importDataButton)
    importDataButton.addEventListener('click', async () => {
      console.log("Attempting to import data")
      // prompt for a url to try fetching
      let url = prompt("Where should we fetch the data from?")

      // url = "ext-libs/lightbeamData.json"
      // moz-extension://0f5e2a52-66b8-0940-b06a-3617ed0fce68/
      // sanity check the url
      const fetchedData = await fetch(url)
      console.log({ fetchedData })
      // try parsing it
      const parsedSites = await fetchedData.json()
      console.log({ parsedSites })
      console.log(`Parsed successfully. ${Object.entries(parsedSites).length} sites to import`)

      // delegate work to background thread
      const dbCall = await storeChild.importSiteData(parsedSites);
      console.log(`dbcall`, dbCall)
      // nuke it all and start over
      console.log(`re-rendering`)
      this.init()
      window.location.reload();

      return dbCall;

    })
  },

  downloadData() {
    const saveData = document.getElementById('save-data-button');
    saveData.addEventListener('click', async () => {
      const data = await storeChild.getAll();
      const blob = new Blob([JSON.stringify(data, ' ', 2)], {
        type: 'application/json'
      });
      const url = window.URL.createObjectURL(blob);
      const downloading = browser.downloads.download({
        url: url,
        filename: 'lightbeamData.json',
        conflictAction: 'uniquify'
      });
      await downloading;
    });
  },

  resetData() {
    const resetData = document.getElementById('reset-data-button');
    const dialog = document.getElementById('reset-data-dialog');
    window.dialogPolyfill && window.dialogPolyfill.registerDialog(dialog);

    resetData.addEventListener('click', () => {
      dialog.showModal();
    });

    dialog.addEventListener('cancel', () => {
      delete dialog.returnValue;
    });

    dialog.addEventListener('close', async () => {
      if (dialog.returnValue === 'confirm') {
        await storeChild.reset();
        window.location.reload();
      }

      // This is a little naive, because the dialog might not have been
      // triggered by the reset button. But it's better than nothing.
      resetData.focus();
    });
  },

  redraw(data) {
    if (!(data.hostname in this.websites)) {
      this.websites[data.hostname] = data;
      this.updateVars(data.firstParty);
    }
    if (data.firstPartyHostnames) {
      // if we have the first parties make the link if they don't exist
      data.firstPartyHostnames.forEach((firstPartyHostname) => {
        if (this.websites[firstPartyHostname]) {
          const firstPartyWebsite = this.websites[firstPartyHostname];
          if (!('thirdParties' in firstPartyWebsite)) {
            firstPartyWebsite.thirdParties = [];
            firstPartyWebsite.firstParty = true;
          }
          if (!(firstPartyWebsite.thirdParties.includes(data.hostname))) {
            firstPartyWebsite.thirdParties.push(data.hostname);
          }
        }
      });
    }
    const transformedData = this.transformData(this.websites);
    viz.draw(transformedData.nodes, transformedData.links);
  }
};

window.onload = () => {
  lightbeam.init();
};