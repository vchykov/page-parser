const puppeteer = require("puppeteer");
const treeify = require("treeify");

async function parseNodesFromPage(page, arrayOfNodes, parentId, productMode = false) {
    let handlesOfNodes = await page.$$("li.product-category");

    if (productMode && handlesOfNodes.length > 0) {
        return;
    }

    if (productMode) {
        handlesOfNodes = await page.$$("li.product");
    }

    console.log("Found", handlesOfNodes.length, productMode ? "products" : "categories");
    console.log("      ");

    for (const itemRoot of handlesOfNodes) {
        const itemH2 = await itemRoot.$("a:nth-child(1) > h2");
        const itemName = (await (await (await itemH2.getProperty("firstChild")).getProperty("textContent")).jsonValue())
            .toString()
            .trim();
        const itemAnchor = await itemRoot.$("a:nth-child(1)");
        const itemAnchorHref = await (await itemAnchor.getProperty("href")).jsonValue();
        const itemId = itemAnchorHref.split("/").at(-2);
        arrayOfNodes.push({
            name: itemName,
            id: itemId,
            parentId: parentId,
        });
    }
}

async function main() {
    const browser = await puppeteer.launch({
        headless: false,
    });

    const page = await browser.newPage();

    console.log("Changing window size ..");

    page.setViewport({
        width: 1200,
        height: 1250,
    });

    const websiteURL = "https://threekingsclub.com/shop/";

    await page.goto(websiteURL);

    console.log("Page loaded");

    const arrayOfProducts = [],
        arrayOfCategories = [];

    await parseNodesFromPage(page, arrayOfCategories, undefined);
    const lengthOfMainCategories = arrayOfCategories.length;

    for (let i = 0; i < lengthOfMainCategories; i++) {
        await page.goto(`https://threekingsclub.com/product-category/${arrayOfCategories[i].id}/`);
        await parseNodesFromPage(page, arrayOfCategories, arrayOfCategories[i].id);
    }

    for (let i = 0; i < arrayOfCategories.length; i++) {
        const partUrl =
            (arrayOfCategories[i].parentId ? arrayOfCategories[i].parentId + "/" : "") + arrayOfCategories[i].id;

        console.log(partUrl);

        await page.goto(`https://threekingsclub.com/product-category/${partUrl}/`);
        await parseNodesFromPage(page, arrayOfProducts, arrayOfCategories[i].id, true);
    }

    console.log("Categories of ThreeKingsClub.com");
    console.log(treeify.asTree(arrayOfCategories, true));

    console.log("Products of ThreeKingsClub.com");
    console.log(treeify.asTree(arrayOfProducts, true));

    await browser.close();
}

main();
