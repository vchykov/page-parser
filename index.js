const puppeteer = require("puppeteer");
const treeify = require("treeify");
const { getCategoryUrl } = require("./modules/get-category-url.js");
const { parseNodesFromPage } = require("./modules/parse-nodes-from-page");

async function main() {
    const browser = await puppeteer.launch({
        headless: false,
    });

    const page = await browser.newPage();

    page.setViewport({
        width: 1200,
        height: 1250,
    });

    const websiteURL = "https://threekingsclub.com/shop/";

    await page.goto(websiteURL);

    const arrayOfProducts = [],
        arrayOfCategories = await parseNodesFromPage(page, undefined);

    for (const item of arrayOfCategories) {
        await page.goto(getCategoryUrl(item, arrayOfCategories));
        arrayOfCategories.push(...(await parseNodesFromPage(page, item.id)));
    }

    for (const item of arrayOfCategories) {
        await page.goto(getCategoryUrl(item, arrayOfCategories));
        arrayOfProducts.push(...(await parseNodesFromPage(page, item.id, true)));
    }

    console.log("Categories of ThreeKingsClub.com");
    console.log(treeify.asTree(arrayOfCategories, true));

    console.log("Products of ThreeKingsClub.com");
    console.log(treeify.asTree(arrayOfProducts, true));

    await browser.close();
}

main();
