const socketClient = io();

socketClient.on('saludo desde back', (msg) => {
    console.log(msg);
});

//elementos del formulario y de la lista de productos en el DOM
const form = document.getElementById('form');

const inputId = document.getElementById('id');
const inputTitle = document.getElementById('title');
const inputDescription = document.getElementById('description');
const inputPrice = document.getElementById('price');
const inputStock = document.getElementById('stock');
const inputThumbnail = document.getElementById('thumbnail');
const inputCode = document.getElementById('code');
const inputCategory = document.getElementById('category');

const productList = document.getElementById('home');

// Manejar el evento de envío del formulario
form.onsubmit = (e) => {
    // Evitar el comportamiento por defecto del formulario (enviar los datos y recargar la página)
    e.preventDefault()
    //campos del formulario
    const id = parseFloat(inputId.value);
    const title = inputTitle.value;
    const description = inputDescription.value;
    const price = inputPrice.value;
    const stock = inputStock.value;
    const thumbnail = inputThumbnail.value;
    const code = inputCode.value;
    const category = inputCategory.value;
    // Crear un objeto que representa el nuevo producto
    const product = { id, title, description, price, stock, thumbnail, code, category };
    // Envia un evento al servidor con los datos del nuevo producto
    socketClient.emit('newProducts', product, (response) => {
        if (response.success) {
            Swal.fire({
                icon: 'success',
                title: 'success',
                text: 'Product added successfully'
            });
            // una vez que se agregue el producto blanquea los campos
            inputId.value = '';
            inputTitle.value = '';
            inputDescription.value = '';
            inputPrice.value = '';
            inputStock.value = '';
            inputThumbnail.value = '';
            inputCode.value = '';
            inputCategory.value = '';

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "A product with the same code or id already exists"
            });
        }
    });
}

// Manejar el evento delete
document.addEventListener('click', async (event) => {
    // Verificar si el elemento clickeado tiene la clase 'delete'
    if (event.target.classList.contains('delete')) {
        try {
            // Obtener el ID del producto a eliminar desde el atributo 'id' del botón
            const productId = event.target.getAttribute('id');
            // Enviar un evento al servidor para eliminar el producto
            await socketClient.emit('deleteProduct', productId);
            Swal.fire({
                icon: 'success',
                title: 'success',
                text: 'product deleted successfully'
            });
        } catch (error) {
            console.error("Error deleting product:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while deleting the product'
            });
        }
    }
});

// Manejar la actualización de la lista de productos recibida desde el servidor
socketClient.on('arrayProducts', (updatedProducts) => {
    console.log(updatedProducts); // Verifica los productos recibidos en la consola
    let productListHTML = ``;
    updatedProducts.forEach(e => {
        productListHTML +=
            `
            <div class="card" style="width: 18rem;">
                <img src="${e.thumbnail}" class="mx-auto img-thumbnail img" alt="${e.imageUrl}">
                <div class="card_info card-body">
                    <h2 class="card-text">Title: ${e.title}</h2>
                    <p class="card-text">ID: ${e.id}</p>
                    <p class="card-text">Description: ${e.description}</p>
                    <p class="card-text">Price: ${e.price}</p>
                    <p class="card-text">Stocks: ${e.stock}</p>
                    <p class="card-text">Category: ${e.category}</p>
                    <p class="card-text">Category: ${e.year}</p>
                </div>
                <div class="delete">
                    <button class="btn cart px-auto delete" id="${e.id}">Delete</button>
                </div>
            </div>
            `
    });
    console.log(productListHTML);
    // Actualizar el contenido del elemento HTML 
    productList.innerHTML = productListHTML;
});








