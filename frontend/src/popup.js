// Get wallet data from background
chrome.runtime.sendMessage({ type: "get_wallets" }, (response) => {
  updateUI(response.wallets, response.allAddresses);
});

// Listen for address changes
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "addresses_changed") {
    console.log("Addresses changed:", message);
    // Update UI accordingly
  }
});

function updateUI(wallets, allAddresses) {
  // Display wallets and addresses in your UI
  console.log("Detected wallets:", wallets);
  console.log("All addresses:", allAddresses);
}
