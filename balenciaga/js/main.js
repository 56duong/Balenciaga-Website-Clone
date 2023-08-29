window.onload = function(){ 
    //check isLogin
    if(localStorage.getItem("isLogin") == 1) {
        document.querySelector(".setting-login").innerHTML = `<a href="#">Account</a>`
    }

    // slideToggle
    document.querySelectorAll(".slideToggle").forEach(function(slideToggle) {
        slideToggle.onclick = function() {
            var slideToggleContent = this.querySelector(".slideToggleContent");
            var slideToggleContentHeight = slideToggleContent.scrollHeight;

            if (slideToggleContent.style.height == 0 || slideToggleContent.style.height == '0px') {
                slideToggleContent.style.height = slideToggleContentHeight + "px";
            }
            else {
                slideToggleContent.style.height = 0;
            }
        };
    });



    // open-close-menu
    document.querySelector(".menu-icon .w-fit").onclick = function() {
        document.getElementById("header").classList.toggle("active-menu");
    };

    
    
    // dark light mode toggle class
    document.querySelector(".dark-light-icon").onclick = function() {
        document.body.classList.toggle("active-dark-light-mode");
    };

    //save dark-light-mode
    document.getElementById("dark-icon").addEventListener("click", function() {
        localStorage.setItem("active-dark-light-mode", true);
    });

    //save dark-light-mode
    document.getElementById("light-icon").addEventListener("click", function() {
        localStorage.setItem("active-dark-light-mode", false);
    });
    
    //display dark-light-mode
    if(localStorage.getItem("active-dark-light-mode") === 'true') {
        document.body.classList.add("active-dark-light-mode");
    }
};



// popup
function popup(popupHead, popupContent, url, buttonText) {
    var newDiv = document.createElement("div");
    newDiv.className = "popup fixed";

    var buttonHTML = "";
    if(buttonText != "") {
        buttonHTML = `
            <div class="popup-button border">
                <a href=${url} target="_blank" class="black-button w-full text-center text-075">${buttonText}</a>
            </div>
        `;
    }
    
    newDiv.innerHTML = `
        <div class="popup-panel col-6 bg-white">
        <div class="popup-head flex border">
            <h2 class="text-1 uppercase">${popupHead}</h2>
            <span id="close-popup-icon" class="material-symbols-outlined">close</span>
        </div>
        <p class="text-center border">
            ${popupContent}
        </p>
        ${buttonHTML}
    `;

    document.querySelector(".container").appendChild(newDiv);

    document.getElementById("close-popup-icon").addEventListener("click", function() {
        this.closest(".popup").remove();
        document.querySelector("form").reset();
    })
}





// cart cart cart cart cart cart cart cart cart cart cart cart cart cart cart cart cart cart cart cart

//display cart
const renderCart = async () => {
    var subtotal = 0;
    var count = 0;

    let uri = "http://localhost:3000/cart?_sort=created&_order=desc";

    const res = await fetch(uri);
    const cart = await res.json();

    document.querySelectorAll(".cart-item-list").forEach(i => {
        i.innerHTML = "";
    });

    cart.forEach(item => {
        const renderItem = async () => {    
            let uri2 = `http://localhost:3000/products/${item.cartId}`;

            const res2 = await fetch(uri2);
            const product = await res2.json();
            
            document.querySelectorAll(".cart-item-list").forEach(i => {
                i.innerHTML += `
                    <a class="cart-item flex" cart-id="${item.id}" product-id="${product.id}">
                        <img src="../images/products/${product.id}-1.png" alt="">
                        <div class="col-8">
                            <p class="cart-name">${product.name}</p>
                            <p class="cart-price">$ <span>${product.price}</span></p>
                            <p class="cart-size">Size: <span>${item.cartSize}</span></p>
                            <p class="cart-quantity flex justify-start">Quantity:
                                <button id="decreaseQty" onclick="changeQty(this)"><span class="material-symbols-outlined">remove</span></button>
                                <span>${item.cartQuantity}</span>
                                <button id="increaseQty" onclick="changeQty(this)"><span class="material-symbols-outlined">add</span></button>
                            </p>
                            <p id="increaseQtyCartError" class="mt-5 text-0875 text-red hidden">You reached the limit quantity for this product.</p>
                            <p class="cart-remove underline" onclick="deleteInCart(this)">Remove</p>
                        </div>
                    </a>
                `;
            })
            
            //display subtotal
            subtotal += product.price * item.cartQuantity;
            document.getElementById("cartSubtotal").innerText = subtotal;

            //if #subtotal exits(cart.html) => set innertext
            if(document.getElementById("subtotal")) {
                document.getElementById("subtotal").innerText = subtotal;
            }

            //if #subtotal exits(cart.html) => set innertext
            if(document.getElementById("total")) {
                document.getElementById("total").innerText = subtotal + document.getElementById("shippingCost").innerText * 1;
            }

            count += item.cartQuantity;
            document.getElementById("countInCart").innerText = count;

            if(count > 0) {
                document.querySelector(".cart-icon span:first-child").style.display = "none";
                document.querySelector(".cart-icon span:last-child").style.display = "flex";
            }
            
        }

        renderItem();
    })
    
    if(cart.length == 0) {
        //if count == 0 and on checkout.html => back
        if(document.querySelector(".checkout-content1")) {
            history.back();
        }

        //if count == 0 and on cart.html => display Your cart is empty.
        if(document.querySelector(".cart-content1")) {
            document.querySelector(".container .cart").innerHTML = `
                <div class="p-20">
                    <p class="mb-20 text-center">Your cart is empty.</p>
                    <a href="./products.html" class="button">CONTINUE SHOPPING</a>
                </div>
            `;
        }
        else {
        }
    }

};

window.addEventListener("DOMContentLoaded", () => renderCart());



//add to cart button
function addToCartBtnEnter() {
    //check if user hasn't chosen a size
    if(document.getElementById("available").value == "") {
        document.getElementById("addToCartBtn").innerText = "please select a size";
    }
}

function addToCartBtnLeave() {
    //check if user has chosen a size
    if(document.getElementById("available").value == "") {
        document.getElementById("addToCartBtn").innerText = "add to cart";
    }
}



//add to cart 
const addToCart = async () => {
    //check if user hasn't chosen a size
    if(document.getElementById("available").value != "") {
        //get id and size
        var id = document.getElementById("id").innerText.toLowerCase();
        var size = document.getElementById("available").value;
        var quantity = 1;
        var created = Date(Date.now()).toString();

        //find in cart
        let uri = `http://localhost:3000/cart?cartId=${id}&cartSize=${size}`;

        const res = await fetch(uri);
        const product = await res.json();

        //create Product object
        const Product = {
            cartId: id,
            cartSize: size,
            cartQuantity: quantity,
            created: created
        }

        //check id product have already exit in cart
        if(product != "") {
            //get inStock and check
            let uri2 = "http://localhost:3000/products/" + id;

            const res2 = await fetch(uri2);
            const product2 = await res2.json();

            var inStock = product2.available.find(item => item.size == size).inStock;

            if(product[0].cartQuantity < inStock) {
                //increase quantity by 1
                Product.cartQuantity = ++product[0].cartQuantity;

                var idInCart = product[0].id;

                //update
                await fetch("http://localhost:3000/cart/" + idInCart, {
                    method: "PATCH",
                    body: JSON.stringify(Product),
                    headers: {"Content-Type": "application/json"}
                });

                document.getElementById("addToCartError").style.display = "none";

                //auto open and close cart
                document.querySelector(".cart").click()
                setTimeout(function() {
                    document.querySelector(".cart").click()
                }, 1000);
            }
            else {
                //error
                document.getElementById("addToCartError").style.display = "block";
            }

        }
        else {
            //add to cart
            await fetch(" http://localhost:3000/cart", {
                method: "POST",
                body: JSON.stringify(Product),
                headers: {"Content-Type": "application/json"}
            });

            //auto open and close cart
            document.querySelector(".cart").click()
            setTimeout(function() {
                document.querySelector(".cart").click()
            }, 1000);
        }

        //update display cart
        renderCart();  
    } 

}



//delete in cart
function deleteInCart(item) {
    var id = item.closest(".cart-item").getAttribute("cart-id");

    const deleteItem = async() => {
        const res = await fetch("http://localhost:3000/cart/" + id, {
            method: "DELETE"
        })
    }

    deleteItem();

    location.reload();
}



//decreaseQty
const changeQty = async (item) => {
    //get type, id, size and quantity
    var type = item.id;
    var cartItem = item.closest(".cart-item");
    var id = cartItem.getAttribute("cart-id");
    var quantity = cartItem.querySelector(".cart-quantity span").innerText;

    //find in cart
    let uri = `http://localhost:3000/cart/${id}`;

    const res = await fetch(uri);
    const product = await res.json();

    //check inStock
    let uri2 = `http://localhost:3000/products/${product.cartId}`;

    const res2 = await fetch(uri2);
    const product2 = await res2.json();
    
    var inStock = product2.available.find(item => item.size == product.cartSize).inStock;

    if(type == "increaseQty" && product.cartQuantity >= inStock) {
        cartItem.querySelector("#increaseQtyCartError").style.display = "block";
    }
    else {
        cartItem.querySelector("#increaseQtyCartError").style.display = "none";

        if(type == "decreaseQty") {
            if(product.cartQuantity > 1) {
                //decrease quantity
                product.cartQuantity -= 1;
            }
        }
        else {
            //increase quantity
            product.cartQuantity += 1;
        }

        //update
        await fetch(uri, {
            method: "PATCH",
            body: JSON.stringify(product),
            headers: {"Content-Type": "application/json"}
        });

        //update display cart
        renderCart();  
    }

}



//validation
var firstName = lastName = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
var birthdate = /^(19[0-9]\d|20[0-9]\d)\-(0[1-9]|1[0-2])\-(([0]?[1-9])|([1-2][0-9])|(3[01]))$/;
var email = /^([a-zA-Z0-9_\.\-\+]+)@([\da-zA-Z\.\-]+)\.([a-zA-Z\.]{2,12})$/;
var password = /^[a-zA-Z0-9]+$/;
var phoneNumber = /^\d{6,12}$/;
var streetAddress = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s0-9,./-]+$/;
var otp = /^[0-9]+$/;



function checkInput(e, pattern) {
    let formRowError = e.closest(".form-row").querySelector(".form-row-error");
    let valueLength = e.getAttribute("data-error-length").split(" ");

    if(e.value.length === 0) {
        formRowError.innerText = e.getAttribute("data-error-missing");
        e.style.borderColor = "var(--red)";
        return false;
    }
    else if(e.value.length < valueLength[0]) {
        formRowError.innerText = `*Please fill out at least ${valueLength[0]} characters in this field`;
        e.style.borderColor = "var(--red)";
        return false;
    }
    else if(e.value.length > valueLength[1]) {
        formRowError.innerText = `*Please enter no more than ${valueLength[1]} characters in this field`;
        e.style.borderColor = "var(--red)";
        return false;
    }
    else if(!e.value.match(pattern)) {
        formRowError.innerText = e.getAttribute("data-error-parse");
        e.style.borderColor = "var(--red)";
        return false;
    }
    else {
        formRowError.innerText = "";
        e.style.borderColor = "var(--black)";
        return true;
    }
}



function checkSelect(e) {
    let formRowError = e.closest(".form-row").querySelector(".form-row-error");

    if(e.value.trim().length === 0) {
        formRowError.innerText = e.getAttribute("data-error-missing");
        e.style.borderColor = "var(--red)";
        return false;
    }
    else {
        formRowError.innerText = "";
        e.style.borderColor = "var(--black)";
        return true;
    }
}



function checkCheckboxRadio(arrE) {
    let formRowError = arrE[0].closest(".form-row").querySelector(".form-row-error");

    var checkCount = 0;

    arrE.forEach(function(ele) {
        if(ele.checked) {
            checkCount++;
        }
    });

    if(checkCount === 0) {
        formRowError.innerText = arrE[0].getAttribute("data-error-missing");
        return false;
    }
    else {
        formRowError.innerText = "";
        return true;
    }
}



const type = {
    "input": `checkInput(element, eval(element.getAttribute("name")));`,
    "select": `checkSelect(element);`,
    "checkbox": `checkCheckboxRadio(arrElement);`,
    "radio": `checkCheckboxRadio(arrElement);`
};

// [array element, type, event]
function onEvent(arrOnEvent) {
    for (const ele of arrOnEvent) {
        var arrElement = ele[0];

        ele[2].split(" ").forEach(function(e) {
            ele[0].forEach(function(element) {
                element.addEventListener(e, function() {
                    eval(type[ele[1]]);
                }); 
            });
        });
    }

    document.getElementsByTagName("form")[0].addEventListener("submit", function(e) {
        var chk = true;

        for (const ele of arrOnEvent) {
            var arrElement = ele[0];

            ele[2].split(" ").forEach(function(e) {
                ele[0].forEach(function(element) {
                    if(eval(type[ele[1]]) == false) {
                        chk = false;
                    }
                });
            });
        }

        if(!chk) e.preventDefault();
    })
}





function sendEmail(emailContent, toUser, emailSubject, sendSuccess) {
    currentYear = new Date().getFullYear();

    var emailBody = `
        <html>
            <head>
                <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: Arial, Helvetica, sans-serif;
                }

                .text-center {
                    text-align: center;
                }

                .text-left {
                    text-align: left;
                }

                .bd {
                    font-size: 0.875rem;
                }

                table {
                    min-width: 600px;
                    margin: 40px auto;
                    border: 1px solid #000;
                }

                table {
                    border-bottom: 0;
                }

                tr {
                    display: block;
                    width: 100%;
                    border-bottom: 1px solid #000;
                    text-align: center;
                }

                td,
                th {
                    display: inline-block;
                    width: 440px;
                    margin: auto;
                    padding: 20px 0;
                }

                .black-button {
                    display: block;
                    width: fit-content;
                    padding: 7px 30px;
                    border: 1px solid #000;
                    border-radius: 5px;
                    margin: auto;
                    color: #fff;
                    background-color: #000;
                    text-transform: uppercase;
                    text-decoration: none;
                    cursor: pointer;
                    transition: .2s;
                }

                span {
                    text-decoration: underline;
                }

            </style>
            </head>

            <div class="bd">
                <table>
                    <tbody>
                        <tr>
                            <th>BALENCIAGA</th>
                        </tr>

                        <tr>
                            <td class="text-center" style="padding: 80px 0 !important;">
                                ${emailContent}
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <p class="text-center">Discover all of the services reserved for our registered clients:</p>
                                <br>
                                <ul class="text-left" style="padding: 0 20px;">
                                    <li>Fast Checkout - Safely store delivery and payment details</li>
                                    <li>Orders - Track and manage purchases and returns</li>
                                    <br>
                                </ul>
                                <small>
                                    For any inquiries, please contact our Client Service.<br>
                                    You can also follow us on <span>Twitter</span>, <span>Instagram</span>, and <span>YouTube</span>.
                                </small>
                            </td>
                        </tr>

                        <tr>
                            <td class="text-center">
                                Should you need any further information, please call us at +1 646 889 1895 or <span>email us</span>.<br>
                                By contacting Client Service, you agree that your data will be transferred outside your country.
                                <br><br>
                                Balenciaga Client Service
                                <br><br>
                                <a class="black-button">VISIT BALENCIAGA.COM</a>
                            </td>
                        </tr>

                        <tr>
                            <td class="text-center">
                                © ${currentYear} Balenciaga
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </html>
    `;

    Email.send({
        SecureToken : "YOUR_GENERATED_SECURE_TOKEN_HERE", // Generate your secure token at https://smtpjs.com/
        From : "YOUR_EMAIL",
        To : toUser,
        Subject : emailSubject,
        Body : emailBody
    }).then(
        message => {
            if(message == "OK") {
                eval(sendSuccess);
            }
            else {
                alert(message);
            }
        }
    );
}















