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