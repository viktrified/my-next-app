// Store for wallet data
const walletStore = {
  wallets: {},
  currentAddresses: new Set(),
  init() {
    this.setupListeners();
    this.detectWallets();
  },

  // Detect installed wallets
  async detectWallets() {
    // Check for MetaMask/standard EIP-1193 providers
    if (window.ethereum) {
      await this.setupEthereumProvider(window.ethereum);
    }

    // Check for other wallet injections
    const knownWalletWindows = [
      "ethereum",
      "solana",
      "phantom",
      "coinbaseWalletExtension",
    ];
    knownWalletWindows.forEach((walletKey) => {
      if (window[walletKey] && !this.wallets[walletKey]) {
        this.setupWallet(walletKey, window[walletKey]);
      }
    });
  },

  // Setup standard Ethereum provider
  async setupEthereumProvider(provider) {
    try {
      const isMultiWallet = provider.providers?.length > 0;

      if (isMultiWallet) {
        provider.providers.forEach((p) => {
          const walletId = p?.isMetaMask
            ? "metamask"
            : p?.isCoinbaseWallet
            ? "coinbase"
            : p?.isBraveWallet
            ? "brave"
            : `ethereum-provider-${Date.now()}`;
          this.setupWallet(walletId, p);
        });
      } else {
        const walletId = provider.isMetaMask
          ? "metamask"
          : provider.isCoinbaseWallet
          ? "coinbase"
          : provider.isBraveWallet
          ? "brave"
          : "ethereum";
        this.setupWallet(walletId, provider);
      }
    } catch (error) {
      console.error("Error setting up Ethereum provider:", error);
    }
  },

  // Generic wallet setup
  async setupWallet(walletId, provider) {
    if (this.wallets[walletId]) return;

    this.wallets[walletId] = {
      provider,
      addresses: [],
      chainId: null,
    };

    try {
      // Request accounts if needed
      const accounts = await provider.request({ method: "eth_accounts" });
      this.handleNewAddresses(walletId, accounts);

      // Set up listeners
      provider.on("accountsChanged", (accounts) => {
        this.handleNewAddresses(walletId, accounts);
      });

      provider.on("chainChanged", (chainId) => {
        this.wallets[walletId].chainId = chainId;
        chrome.runtime.sendMessage({
          type: "chain_changed",
          walletId,
          chainId,
        });
      });

      // Get initial chain ID
      const chainId = await provider.request({ method: "eth_chainId" });
      this.wallets[walletId].chainId = chainId;
    } catch (error) {
      console.error(`Error setting up wallet ${walletId}:`, error);
    }
  },

  // Handle address changes
  handleNewAddresses(walletId, newAddresses) {
    const wallet = this.wallets[walletId];
    if (!wallet) return;

    const addedAddresses = newAddresses.filter(
      (addr) => !wallet.addresses.includes(addr)
    );
    const removedAddresses = wallet.addresses.filter(
      (addr) => !newAddresses.includes(addr)
    );

    // Update wallet addresses
    wallet.addresses = newAddresses;

    // Update global address set
    removedAddresses.forEach((addr) => this.currentAddresses.delete(addr));
    addedAddresses.forEach((addr) => this.currentAddresses.add(addr));

    // Notify about changes
    if (addedAddresses.length > 0 || removedAddresses.length > 0) {
      chrome.runtime.sendMessage({
        type: "addresses_changed",
        walletId,
        allAddresses: newAddresses,
        addedAddresses,
        removedAddresses,
      });
    }
  },

  // Set up window listeners for new wallet injections
  setupListeners() {
    // Listen for new wallet injections
    const originalEthereum = window.ethereum;
    Object.defineProperty(window, "ethereum", {
      configurable: true,
      enumerable: true,
      set(value) {
        if (value && value !== originalEthereum) {
          this.setupEthereumProvider(value);
        }
        originalEthereum = value;
      },
      get() {
        return originalEthereum;
      },
    });

    // Periodically check for new wallets
    setInterval(() => this.detectWallets(), 5000);
  },
};

// Initialize when extension loads
walletStore.init();

// Message handling from content scripts/popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "get_wallets":
      sendResponse({
        wallets: walletStore.wallets,
        allAddresses: Array.from(walletStore.currentAddresses),
      });
      break;
    case "request_accounts":
      if (request.walletId && walletStore.wallets[request.walletId]) {
        walletStore.wallets[request.walletId].provider
          .request({ method: "eth_requestAccounts" })
          .then((accounts) => sendResponse({ accounts }))
          .catch((error) => sendResponse({ error: error.message }));
        return true; // Indicates async response
      }
      break;
  }
});
