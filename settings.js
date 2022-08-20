
const authorInfo = {
    address: "0x5dDdB489Cfc464Fda293D8747550eF7aF422F8e9", // your address 
    infuraId: "7387f8d682e441afbdf36647bba9777e", // your infura project id
}

const collectionInfo = {
    name: "Meow Monster's",
    title: "{name}", // Title prefix (ex "Buy your {name}") - You can use {name} to insert the collection name
    date: "08.25.2022",
    socialMedia: {
        twitter: "https://twitter.com/MeowMonstersNFT",
    },
    medias: {
        preview: "preview.gif",
        favicon: "logo.png",
    },
    background: {
        type: "image", // Supported types: image, video, color
        image: "background.jpg", // Image for image type, video preview for video type
        video: "background.mp4", // If you don't use video, you can ignore this line
        color: "#4E4E6D", // If you don't use color, you can ignore this line
    }
}
const mintInfo = {
    price: 0, // Price per NFT.
    totalSupply: 555, // Total supply of NFTs.
    minUnits: 1, // Min units to buy.
    maxUnits: 5, // Max units to buy.
    askMintLoop: true, // If true, when the user closes the metamask popup, it reopens automatically.
}

/*
    = = = = = END OF SETTINGS = = = = =
*/

//#region Check Configuration
if (mintInfo.minUnits > mintInfo.maxUnits) console.error(`Error: minUnits (${mintInfo.minUnits}) is greater than maxUnits (${maxUnits})`);
if (mintInfo.minUnits <= 0) console.error(`Error: minUnits (${mintInfo.minUnits}) is less than or equal to 0`);

if (!authorInfo.address.startsWith("0x") ||
    (
        authorInfo.address.length >= 64 ||
        authorInfo.address.length <= 40
    )
) console.error(`Error: ${authorInfo.address} is not a valid Ethereum address.`);
//#endregion
