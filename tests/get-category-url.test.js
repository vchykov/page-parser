const { getCategoryUrl } = require("../modules/get-category-url.js");

const categories = [
    {
        name: "C1",
        id: "id1",
        parentId: undefined,
    },
    {
        name: "C2",
        id: "id2",
        parentId: undefined,
    },
    {
        name: "C3",
        id: "id3",
        parentId: "id1",
    },
    {
        name: "C4",
        id: "id4",
        parentId: "id3",
    },
];

test("To category C1 url equal 'https://threekingsclub.com/product-category/id1/'", () => {
    expect(getCategoryUrl(categories[0], categories)).toBe("https://threekingsclub.com/product-category/id1/");
});

test("To category C2 url equal 'https://threekingsclub.com/product-category/id2/'", () => {
    expect(getCategoryUrl(categories[1], categories)).toBe("https://threekingsclub.com/product-category/id2/");
});

test("To category C3 url equal 'https://threekingsclub.com/product-category/id1/id3/'", () => {
    expect(getCategoryUrl(categories[2], categories)).toBe("https://threekingsclub.com/product-category/id1/id3/");
});

test("To category C4 url equal 'https://threekingsclub.com/product-category/id1/id3/id4/'", () => {
    expect(getCategoryUrl(categories[3], categories)).toBe("https://threekingsclub.com/product-category/id1/id3/id4/");
});
