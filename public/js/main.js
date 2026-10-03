const productSearch =
    document.getElementById("productSearch");

const categoryFilter =
    document.getElementById("categoryFilter");

const clearFilters =
    document.getElementById("clearFilters");

const productItems =
    document.querySelectorAll(".product-item");

const noProductsMessage =
    document.getElementById("noProductsMessage");

    
function filterProducts() {

    const searchText =
        productSearch.value.toLowerCase().trim();

    const selectedCategory =
        categoryFilter.value.toLowerCase();

    let visibleProducts = 0;

    productItems.forEach((product) => {

        const productName =
            product.dataset.name;

        const productCategory =
            product.dataset.category;

        const matchesSearch =
            productName.includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            productCategory === selectedCategory;

        if (matchesSearch && matchesCategory) {

            product.style.display = "";
            visibleProducts++;

        } else {

            product.style.display = "none";

        }

    });

    if (noProductsMessage) {

        if (visibleProducts === 0) {

            noProductsMessage.classList.remove("d-none");

        } else {

            noProductsMessage.classList.add("d-none");

        }

    }

}


if (productSearch) {

    productSearch.addEventListener(
        "input",
        filterProducts
    );

}


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        filterProducts
    );

}


if (clearFilters) {

    clearFilters.addEventListener(
        "click",
        function () {

            productSearch.value = "";

            categoryFilter.value = "all";

            filterProducts();

        }
    );

}