const addToCartForm =
    document.getElementById("addToCartForm");

const decreaseQuantity =
    document.getElementById("decreaseQuantity");

const increaseQuantity =
    document.getElementById("increaseQuantity");

const productQuantity =
    document.getElementById("productQuantity");


// QUANTITY SELECTOR

if (decreaseQuantity && increaseQuantity && productQuantity) {

    decreaseQuantity.addEventListener("click", function () {

        let quantity = Number(productQuantity.value);

        if (quantity > 1) {

            productQuantity.value = quantity - 1;

        }

    });


    increaseQuantity.addEventListener("click", function () {

        let quantity = Number(productQuantity.value);

        let maxQuantity =
            Number(productQuantity.max);


        if (quantity < maxQuantity) {

            productQuantity.value = quantity + 1;

        } else {

            const stockMessage =
                document.getElementById("stockMessage");

            if (stockMessage) {

                stockMessage.textContent =
                    `Only ${maxQuantity} item(s) available`;

            }

        }

    });

}


// ADD TO CART

if (addToCartForm) {

    addToCartForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const productId =
            addToCartForm.querySelector(
                'input[name="productId"]'
            ).value;


        const quantity =
            addToCartForm.querySelector(
                'input[name="quantity"]'
            ).value;


        fetch("/cart/add", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                productId: productId,
                quantity: quantity
            })

        })

            .then((response) => {

                return response.json();

            })

            .then((data) => {

                const cartMessage =
                    document.getElementById("cartMessage");


                if (data.success) {

                    cartMessage.innerHTML = `
                        <div class="alert alert-success">
                            ${data.message}
                        </div>
                    `;


                    // UPDATE CART BADGE

                    const cartBadge =
                        document.querySelector(".cart-badge");


                    if (cartBadge) {

                        cartBadge.textContent =
                            data.cartItemCount;

                    }


                    // UPDATE AVAILABLE STOCK

                    const availableStock =
                        document.getElementById("availableStock");

                    const stockMessage =
                        document.getElementById("stockMessage");

                    const addToCartButton =
                        document.getElementById("addToCartButton");


                    if (availableStock) {

                        const currentStock =
                            Number(availableStock.textContent);


                        const newStock =
                            currentStock - Number(quantity);


                        availableStock.textContent =
                            newStock;


                        // UPDATE QUANTITY LIMIT

                        if (productQuantity) {

                            productQuantity.max =
                                newStock;

                        }


                        if (newStock <= 0) {

                            addToCartButton.disabled = true;

                            if (increaseQuantity) {
                                increaseQuantity.disabled = true;
                            }

                            if (decreaseQuantity) {
                                decreaseQuantity.disabled = true;
                            }

                            stockMessage.textContent =
                                "No more stock available";

                        } else {

                            // Reset selected quantity
                            productQuantity.value = 1;

                            stockMessage.textContent = "";

                        }

                    }

                } else {

                    cartMessage.innerHTML = `
                        <div class="alert alert-danger">
                            ${data.message}
                        </div>
                    `;

                }

            })

            .catch((error) => {

                console.log(error);


                const cartMessage =
                    document.getElementById("cartMessage");


                cartMessage.innerHTML = `
                    <div class="alert alert-danger">
                        Something went wrong. Please try again.
                    </div>
                `;

            });

    });

}

// =========================================================
// CART PAGE
// =========================================================


// UPDATE CART QUANTITY

const decreaseCartButtons =
    document.querySelectorAll(".decrease-cart");

const increaseCartButtons =
    document.querySelectorAll(".increase-cart");


decreaseCartButtons.forEach((button) => {

    button.addEventListener("click", function () {

        const cartItem =
            button.closest(".cart-item");

        const productId =
            cartItem.dataset.productId;

        const quantityElement =
            cartItem.querySelector(".cart-quantity");

        let quantity =
            Number(quantityElement.textContent);


        // If quantity is 1, remove the product
        if (quantity === 1) {

            removeCartItem(
                productId,
                cartItem
            );

            return;

        }


        quantity--;


        updateCartQuantity(
            productId,
            quantity,
            cartItem
        );

    });

});


increaseCartButtons.forEach((button) => {

    button.addEventListener("click", function () {

        const cartItem =
            button.closest(".cart-item");

        const productId =
            cartItem.dataset.productId;

        const quantityElement =
            cartItem.querySelector(".cart-quantity");

        const stock =
            Number(cartItem.dataset.stock);

        let quantity =
            Number(quantityElement.textContent);


        if (quantity >= stock) {

            alert(
                `Only ${stock} item(s) available in stock`
            );

            return;

        }


        quantity++;


        updateCartQuantity(
            productId,
            quantity,
            cartItem
        );

    });

});


// REMOVE PRODUCT FROM CART

function removeCartItem(
    productId,
    cartItem
) {

    fetch("/cart/remove", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            productId: productId
        })

    })

        .then((response) => {

            return response.json();

        })

        .then((data) => {

            if (data.success) {

                cartItem.remove();

                updateCartSummary();

                updateCartBadge(
                    data.cartItemCount
                );


                const remainingItems =
                    document.querySelectorAll(
                        ".cart-item"
                    );


                if (remainingItems.length === 0) {

                    location.reload();

                }

            } else {

                alert(data.message);

            }

        })

        .catch((error) => {

            console.log(error);

            alert(
                "Something went wrong. Please try again."
            );

        });

}

// UPDATE CART FUNCTION

function updateCartQuantity(
    productId,
    quantity,
    cartItem
) {

    fetch("/cart/update", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            productId: productId,
            quantity: quantity

        })

    })

        .then((response) => {

            return response.json();

        })

        .then((data) => {

            if (data.success) {

                const quantityElement =
                    cartItem.querySelector(".cart-quantity");

                quantityElement.textContent =
                    quantity;


                updateCartItemSubtotal(cartItem);

                updateCartSummary();

                updateCartBadge(
                    data.cartItemCount
                );

            } else {

                alert(data.message);

            }

        })

        .catch((error) => {

            console.log(error);

            alert(
                "Something went wrong. Please try again."
            );

        });

}


// UPDATE PRODUCT SUBTOTAL

function updateCartItemSubtotal(cartItem) {

    const priceElement =
        cartItem.querySelector(".cart-product-price");

    const quantityElement =
        cartItem.querySelector(".cart-quantity");

    const subtotalElement =
        cartItem.querySelector(".cart-item-subtotal");


    const price =
        Number(
            priceElement.textContent
                .replace("₹", "")
                .trim()
        );

    const quantity =
        Number(quantityElement.textContent);


    subtotalElement.textContent =
        "₹" + (price * quantity);

}


// UPDATE CART SUMMARY

function updateCartSummary() {

    const cartItems =
        document.querySelectorAll(".cart-item");


    let totalItems = 0;
    let totalPrice = 0;


    cartItems.forEach((cartItem) => {

        const priceElement =
            cartItem.querySelector(".cart-product-price");

        const quantityElement =
            cartItem.querySelector(".cart-quantity");


        const price =
            Number(
                priceElement.textContent
                    .replace("₹", "")
                    .trim()
            );

        const quantity =
            Number(quantityElement.textContent);


        totalItems += quantity;

        totalPrice += price * quantity;

    });


    const totalItemsElement =
        document.getElementById("cartTotalItems");

    const totalPriceElement =
        document.getElementById("cartTotalPrice");

    const grandTotalElement =
        document.getElementById("cartGrandTotal");


    if (totalItemsElement) {

        totalItemsElement.textContent =
            totalItems;

    }


    if (totalPriceElement) {

        totalPriceElement.textContent =
            "₹" + totalPrice;

    }


    if (grandTotalElement) {

        grandTotalElement.textContent =
            "₹" + totalPrice;

    }

}


// UPDATE NAVBAR CART BADGE

function updateCartBadge(count) {

    const cartBadge =
        document.querySelector(".cart-badge");


    if (cartBadge) {

        cartBadge.textContent =
            count;

    }

}

// =========================================================
// REMOVE CART ITEM
// =========================================================

const removeCartButtons =
    document.querySelectorAll(".remove-cart-item");


removeCartButtons.forEach((button) => {

    button.addEventListener("click", function () {

        const cartItem =
            button.closest(".cart-item");

        const productId =
            cartItem.dataset.productId;


        fetch("/cart/remove", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                productId: productId
            })

        })

            .then((response) => {

                return response.json();

            })

            .then((data) => {

                if (data.success) {

                    // Remove the complete product card
                    cartItem.remove();


                    // Update navbar cart badge
                    updateCartBadge(
                        data.cartItemCount
                    );


                    // Update totals
                    updateCartSummary();


                    // If cart is now empty
                    const remainingItems =
                        document.querySelectorAll(
                            ".cart-item"
                        );


                    if (remainingItems.length === 0) {

                        location.reload();

                    }

                } else {

                    alert(data.message);

                }

            })

            .catch((error) => {

                console.log(error);

                alert(
                    "Something went wrong. Please try again."
                );

            });

    });

});