function getCategoryUrl(category, allCategories) {
    const categoryUrl = [];
    let pointer = category;

    do {
        categoryUrl.push(pointer.id);
        pointer = allCategories.find((item) => item.id == pointer.parentId);
    } while (pointer !== undefined);

    return `https://threekingsclub.com/product-category/${categoryUrl.reverse().join("/")}/`;
}

module.exports.getCategoryUrl = getCategoryUrl;
