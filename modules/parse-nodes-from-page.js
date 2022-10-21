async function parseNodesFromPage(page, parentId, productMode = false) {
    let handlesOfNodes = await page.$$("li.product-category");

    if (productMode && handlesOfNodes.length > 0) {
        return [];
    }

    if (productMode) {
        handlesOfNodes = await page.$$("li.product");
    }

    console.log("Found", handlesOfNodes.length, productMode ? "products" : "categories");
    console.log("");

    const arrayOfNodes = [];

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
    return arrayOfNodes;
}

module.exports.parseNodesFromPage = parseNodesFromPage;
