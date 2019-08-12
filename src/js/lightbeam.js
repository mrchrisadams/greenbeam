const lightbeam = {
  websites: {},
  dataGatheredSince: null,
  numFirstParties: 0,
  numThirdParties: 0,
  numGreenSites: 0,
  indexes: [
    'hostname', // Primary key
    'firstRequestTime',
    'lastRequestTime',
    'isVisible',
    'firstParty',
    'greenCheck'
  ],

  async init() {
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

    return {
      nodes,
      links
    };
  },

  downloadData() {
    const saveData = document.getElementById('save-data-button');
    saveData.addEventListener('click', async () => {
      // const data = await storeChild.getAll();
      const blob = await storeChild.exportDB({ prettyJson: true });

      // const blob = new Blob([JSON.stringify(data, ' ', 2)], {
      //   type: 'application/json'
      // });
      console.log(blob)
      // const url = window.URL.createObjectURL(blob);
      // const downloading = browser.downloads.download({
      //   url: url,
      //   filename: 'lightbeamData.json',
      //   conflictAction: 'uniquify'
      // });
      // await downloading;
      download(blob, "lightbeamData.json", "application/json")
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
  mungeDataInbound(key, value) {
    if (this.indexes.includes(key)) {
      // IndexedDB does not accept boolean values for indexes; using 0/1 instead
      if (value === true) {
        value = 1;
      }
      if (value === false) {
        value = 0;
      }
    }
    return value;
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
  // const sites = Object.values(localWebsites);
  // let counter = 0

  // // find the first parties
  // const firstParties = Object.values(localWebsites).filter(site => {
  //   return site.firstParty == true
  // })

  // firstParties.forEach(async (site) => {
  //   if (counter < 10) {
  //     console.log(site)
  //     // and the third parties
  //     const data = {
  //       faviconUrl: "",
  //       firstParty: true,
  //       requestTime: Date.now(),
  //       greenCheck: true
  //     };
  //     counter++
  //     await storeChild.setFirstParty(site.hostname, data)
  //   }

  // })
  // storeChild.getAll().then(data => {
  //   console.log({ data })
  //   lightbeam.websites = data
  // })
};