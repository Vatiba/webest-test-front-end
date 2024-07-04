// Code

const cartStorageKey = 'CART';

/**
 * 
 * @param {number} productId 
 */
function addToCart(productId) {
	const cartString = localStorage.getItem(cartStorageKey);

	if (cartString) {
		const cart = JSON.parse(cartString);
		if (cart?.[productId]) {

			cart[productId] += 1;
			localStorage.setItem(cartStorageKey, JSON.stringify(cart));
			updateHeadCartBadge(cart);
			updateProductCount(cart, productId);

			return;
		}

		cart[productId] = 1;
		localStorage.setItem(cartStorageKey, JSON.stringify(cart));
		updateHeadCartBadge(cart);
		updateProductCount(cart, productId);

		return;
	}

	localStorage.setItem(cartStorageKey, JSON.stringify({ [productId]: 1 }))
	updateHeadCartBadge({ [productId]: 1 });
	updateProductCount({ [productId]: 1 }, productId);

}

/**
 * 
 * @param {number} productId 
 */
function removeFromCart(productId) {
	const cartString = localStorage.getItem(cartStorageKey);
	const cart = JSON.parse(cartString);

	if (cartString && cart?.[productId] != undefined && cart?.[productId] != null) {
		if (cart[productId] <= 1) {

			const { [productId]: _, ...otherProducts } = cart;
			localStorage.setItem(cartStorageKey, JSON.stringify(otherProducts));
			updateHeadCartBadge(cart);
			updateProductCount(cart, productId);

			return;
		}

		cart[productId] -= 1;
		localStorage.setItem(cartStorageKey, JSON.stringify(cart));
		updateHeadCartBadge(cart);
		updateProductCount(cart, productId);

		return;

	}

}

/**
 * 
 * @param {object} cart 
 */
function updateHeadCartBadge(cart) {
	const badge = document.getElementById('cartBadge');

	if (Object.keys(cart).length > 0) {
		badge.classList.remove('cart__badge-hide');
		badge.innerText = Object.keys(cart).length;
		return;
	}

	badge.classList.add('cart__badge-hide');

}


/**
 * 
 * @param {object} cart 
 * @param {number} productId 
 * 
 */
function updateProductCount(cart, productId) {
	const productCount = document.getElementById(`productCount-${productId}`);

	productCount.innerHTML = cart?.[productId] ?
		`
								<button class="modal__btn" onclick="removeFromCart(${productId})">
									<img src="./assets/icons/minus.svg" alt="remove from cart">
								</button>
								<span class="modal__cartcount" >
									${cart?.[productId]}
								</span>
								<button class="modal__btn" onclick="addToCart(${productId})">
									<img src="./assets/icons/plus.svg" alt="add to cart">
								</button>
							`
		:
		`
								<button class="modal__addtocartbtn" onclick="addToCart(${productId})">
									Добавить в корзину
								</button>
							`

}

const modalContainer = document.getElementById('modalContainer');

/**
 * 
 * @param {number} productId 
 */
function openModal(productId) {

	const product = productsData.find(item => item.id == productId);
	const cartString = localStorage.getItem(cartStorageKey);
	const cart = JSON.parse(cartString);

	modalContainer.addEventListener('click', outsideClose);
	modalContainer.addEventListener('click', outsideClose);
	document.body.addEventListener("keydown", escapeClose);

	document.getElementsByTagName('body')[0].className = 'modal-opened'

	modalContainer.innerHTML = `
      <div class="modal">
         <div class="modal__content">
               <div class="modal__imgwrap">
                  <img class="modal__img" src="${product.image}" alt="${product.imageAlt}" />
               </div>
               <div class="modal__product">
                  <div class="modal__productinfo">
                     <span class="modal__title">
                     ${product.title}
                     </span>
                     <p class="modal__desc">
                     ${product.desc}
                     </p>
                  </div>
                  <div class="modal__actions" id="productCount-${product.id}">
							${cart?.[product.id] ?
			`
									<button class="modal__btn" onclick="removeFromCart(${product.id})">
										<img src="./assets/icons/minus.svg" alt="remove from cart">
									</button>
									<span class="modal__cartcount" >
										${cart?.[product.id]}
									</span>
									<button class="modal__btn" onclick="addToCart(${product.id})">
										<img src="./assets/icons/plus.svg" alt="add to cart">
									</button>
								`
			:
			`
									<button class="modal__addtocartbtn" onclick="addToCart(${product.id})">
										Добавить в корзину
									</button>
								`
		}
                  </div>
               </div>
         </div>
      </div>
   `
}

function closeModal() {
	modalContainer.innerHTML = '';
	modalContainer.removeEventListener('click', outsideClose);

	document.body.removeEventListener("keydown", outsideClose);
}

function outsideClose(event) {
	if (
		event.target !== modalContainer &&
		event.target.classList.contains("modal")
	) {
		closeModal();
	}
}
function escapeClose(event) {
	if (event.keyCode === 27) {
		closeModal();
	}
}

const productsRow = document.getElementById('productsRow');
let productsColumnHTML = '';

for (let i = 0; i < productsData.length; i++) {
	const element = productsData[i];
	productsColumnHTML += `
      <div class="col">
         <div class="card">
               <img class="card__img" src="${element.image}" alt="${element.imageAlt}" />
               <span class="card__title">${element.title}</span>
               <p class="card__desc">
                  ${element.desc}
               </p>
               <button class="card__detail" onclick="openModal(${element.id})">
                  Подробнее
               </button>
         </div>
      </div>
   `
}

productsRow.innerHTML = productsColumnHTML;