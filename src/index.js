const productDom = document.querySelector('.show_product');
const cartBody = document.querySelector('.offcanvas-body');
const cartCount = document.querySelector('.cart_count');
const totalPrice = document.querySelector('.total_price');


// Local Storage Data Set Get Handle here ...
class Storage {

    static saveProducts = (products) => {
        localStorage.setItem('products', JSON.stringify(products));
    }

    static getProducts = (id) => {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find((product) => parseInt(product.id) === parseInt(id));
    }
    static getAllProducts = () => {
        let products = JSON.parse(localStorage.getItem('products'));
        return products;
    }

    static saveCart = (cartItem) => {
        localStorage.setItem('cart', JSON.stringify(cartItem));
    }

    static getCartItem = () => {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

}

let cart = Storage.getCartItem();
let buttonDom = [];
let cartDom = [];

// UI Loop Print here ...
class UI {

    static refreshCart = () => {
        let cartItem = Storage.getCartItem();
        cartCount.innerText = cartItem.length;
    }

    static totalPrice = () => {
        let result = 0;
        let cartItem = [...Storage.getCartItem()];
        cartItem.map((item) => {
            let productMul = (parseInt(item.price) * parseInt(item.quantity));
            result += productMul;
        })
        totalPrice.innerText = `$ ${result}`;
    }


    // display product func
    displayProduct = (data = Storage.getAllProducts()) => {

        let displayUi = '';
        data.map((product) => {
            displayUi += `
            <div class="col-md-4  mb-3">
                    <div class="card">
                        <img
                            src=${product?.image}
                            alt=""/>
                        <div class="card-body">
                            <div class="row">
                                <div class="card-title">
                                    <span>${product?.name || ' '}</span>
                                    <span class="price">$ ${product.price}</span>
                                </div>
                            </div>
                        </div>
                        <button type="button" class="btn btn-primary btn-lg btn-block rounded-0 shadow-none addToCart" data-id =${product.id}>Add to Cart</button>
                    </div>
                </div>
            `
        });
        productDom.innerHTML = displayUi;

        this.getButtons();

    }




    getButtons = () => {

        // add to Cart Button 
        const buttons = [...document.querySelectorAll('.addToCart')]

        buttonDom = buttons;

        buttons.map((button) => {

            let id = button.dataset.id;

            let inCart = Storage.getCartItem().find((item) => item.id === id);
            if (inCart) {
                button.disabled = true;
                button.innerText = 'Added...';
            }

            button.addEventListener('click', () => {

                let cartItem = Storage.getProducts(id);
                cartItem.quantity = 1;

                let inCart = Storage.getCartItem().find((item) => item.id === id);

                if (inCart) {
                    button.disabled = true;
                    button.innerText = 'Added...';
                } else {
                    cart = [...cart, cartItem];
                    Storage.saveCart(cart);
                    button.disabled = true;
                    button.innerText = 'Added...';
                }

                UI.totalPrice();
                UI.refreshCart();
                this.displayCartUi();

            })
        });



        // remove item from card.
        let removeButtons = [...document.querySelectorAll('.removeCartItem')];

        removeButtons.map((button) => {

            let id = button.dataset.id;

            button.addEventListener('click', () => {

                let removeInCart = Storage.getCartItem().filter((item) => item.id !== id);
                console.log(removeInCart)
                cart = [...removeInCart];
                Storage.saveCart(cart);

                UI.totalPrice();
                UI.refreshCart();
                this.displayCartUi();
                this.displayProduct();

            })

        })

        // incrementCartQuantity
        let incrementCart = [...document.querySelectorAll('.incrementCart')];

        incrementCart.map((quantity) => {

            let id = quantity.dataset.id;

            let incrementCartCount = cart.find((item) => item.id === id);

            quantity.addEventListener('click', () => {

                incrementCartCount.quantity += 1;

                cart = [...cart];
                Storage.saveCart(cart);
                this.displayCartUi();
                UI.totalPrice();
            })

        })

        // decrementCartQuantity
        let decrementCart = [...document.querySelectorAll('.decrementCart')];

        decrementCart.map((quantity) => {

            let id = quantity.dataset.id;

            let decrementCartCount = cart.find((item) => item.id === id);

            quantity.addEventListener('click', () => {
                if (decrementCartCount.quantity > 1) {
                    decrementCartCount.quantity -= 1;
                    cart = [...cart];
                    Storage.saveCart(cart);
                    this.displayCartUi();
                    UI.totalPrice();
                }
            })

        })

    }



    displayCartUi = () => {

        let cartUi = '';
        let cartItem = Storage.getCartItem();

        cartItem.map((item) => {

            cartUi += `

            <div class="d-flex flex-row justify-content-between align-items-center p-2 bg-light mt-4 px-3 rounded ">

                <div class="mr-1"><img class="rounded" src=${item.image} width="70"></div>
                <div class="d-flex flex-column product-details">
                   <h5 class="font-weight-bold">${item.name}</h5>
                   <h5>$${item.price}</h5>
                </div>

                <div class="d-flex flex-row align-items-center qty">
                    <i class="bi bi-dash text-danger decrementCart" data-id =${item.id}></i>
                        <h5 class="text-grey mt-1 mr-1 ml-1 ">${item.quantity}</h5>
                    <i class="bi bi-plus text-success incrementCart" data-id =${item.id}></i>
                </div>
                
                <div>
                    
                </div>
                
                <button class="d-flex align-items-center btn btn-outline-light removeCartItem" data-id =${item.id}><i class="bi bi-trash mb-1 text-danger"></i></button>
            </div>
            `
        })

        cartBody.innerHTML = cartUi;

        this.getButtons();
    }




}


// Product Fetch Here ...
class Product {

    // get product...
    getProduct = async () => {
        try {
            const result = await fetch('product.json');
            const data = await result.json();
            const products = data.product;
            // console.log('fetch', products)
            return products;
        } catch (e) {
            console.error(e.message);
        }
    }
}


document.addEventListener('DOMContentLoaded', async () => {

    const ui = new UI();
    const products = new Product();
    const productObj = await products.getProduct();

    Storage.saveProducts(productObj);

    ui.displayProduct(productObj);
    ui.displayCartUi();

    ui.getButtons();
    UI.refreshCart();
    UI.totalPrice();
})
