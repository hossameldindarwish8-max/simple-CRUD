var productName = document.getElementById('productName');
var productPrice = document.getElementById('productPrice');
var productCategory = document.getElementById('productCategory');
var productImage = document.getElementById('productImage');
var productDescription = document.getElementById('productDescription');
var productViewer = document.getElementById('products-viewer');
var addProductBtn = document.getElementById('add-product');
var updateProductBtn = document.getElementById('update-product');
// var productList = [];
var productList = new Map();
if(localStorage.getItem('productList')){
    // productList = JSON.parse(localStorage.getItem('productList'));
    productList = new Map(JSON.parse(localStorage.getItem('productList')));
}
displayProducts([...productList]);

function generateID(){
    do{
        var id = Math.floor(Math.random()*900000) + 100000;
        //Math.random returns 0 <= number < 1
    }while(productList.has(id))
    return id;
}

function addProduct(){
    var isValid = (validateInput(productName) && validateInput(productPrice) 
    && validateInput(productCategory) && validateInput(productImage) &&
    validateInput(productDescription));
    if(isValid){
        var product = {
        id: generateID(),
        name: productName.value.trim(),
        price: productPrice.value.trim(),
        category: productCategory.value.trim(),
        image: productImage.files[0]?.name,
        description: productDescription.value.trim()
        }
        productList.set(product.id,product);
        clear()
        localStorage.setItem('productList',JSON.stringify([...productList]));
        displayProducts([...productList]);
    }
}

function clear(){
    productName.value = '';
    productPrice.value = '';
    productCategory.value = '';
    productImage.value = '';
    productDescription.value = '';
}

function displayProducts(list){
    var blackBox = '';
    for(var i = 0; i < list.length; i++){
        blackBox +=`<div class="col-6 col-lg-3">
                        <article class="h-100 p-3 product-card shadow-sm border border-1">
                            <figure class="rounded-3 position-relative text-center">
                                <button onclick="editProduct(${list[i][0]})" class="edit-btn btn btn-warning rounded-circle position-absolute shadow"><i class="fa-solid fa-pen-to-square"></i></button>
                                <button onclick="deleteProduct(${list[i][0]})" class="delete-btn btn btn-danger rounded-circle position-absolute shadow"><i class="fa-solid fa-trash"></i></button>
                                <img src="./images/${list[i][1].image}" alt="">
                            </figure>
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="badge rounded-pill text-bg-primary">${list[i][1].category}</span>
                                <span class="text-danger fw-bold">${list[i][1].price} EGP</span>
                            </div>
                            <h2 class="fs-5 fw-normal">${list[i][1].highlightedKeyWord||list[i][1].name}</h2>
                            <p class="product-description-paragraph text-dark-emphasis mb-4">${list[i][1].description}</p>
                            <button class="btn btn-warning rounded-pill w-100 fs-6">Add to cart</button>
                        </article>
                    </div>`;
        delete list[i][1].highlightedKeyWord;
    }
    productViewer.innerHTML= blackBox;
}

var modifiedObject;

function editProduct(productID){
    console.log(typeof productID);
    var productObject = productList.get(productID);
    productName.value = productObject.name;
    productPrice.value = productObject.price;
    productCategory.value = productObject.category;
    productDescription.value = productObject.description;
    modifiedObject = productObject;
    if(addProductBtn.classList.contains('d-block')){
        addProductBtn.classList.replace('d-block','d-none');
        updateProductBtn.classList.replace('d-none','d-block');
    }
}

function updateProduct(){
    modifiedObject.name = productName.value.trim();
    modifiedObject.price = productPrice.value.trim();
    modifiedObject.category = productCategory.value;
    modifiedObject.image = productImage.files[0]?.name || modifiedObject.image;
    modifiedObject.description = productDescription.value.trim();
    productList.set(modifiedObject.id,modifiedObject);
    localStorage.setItem('productList',JSON.stringify([...productList]));
    clear();
    displayProducts([...productList]);
    addProductBtn.classList.replace('d-none','d-block');
    updateProductBtn.classList.replace('d-block','d-none')
}

function deleteProduct(productID){
    productList.delete(productID);
    localStorage.setItem('productList',JSON.stringify([...productList]));
    displayProducts([...productList]);
}

var searchedProducts = [];

function searchForProduct(searchBar){
    searchedProducts = [];
    var productListArray = [...productList];
    
    var searchedKeyWord = new RegExp(searchBar.value.trim().replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i');
    for(var i = 0; i<productListArray.length ;i++){
        if(searchedKeyWord.test(productListArray[i][1].name)){
            productListArray[i][1].highlightedKeyWord = productListArray[i][1].name.replace(searchedKeyWord,'<span class="text-danger">$&</span>');
            searchedProducts.push(productListArray[i]);
        }
    }
    if(searchedProducts.length === 0)
    {
        productViewer.innerHTML= `<div class="no-results w-100 text-center py-5">
                        <img src="./images/no-results-found.jpeg" alt="">
                        <p class="mb-0 fw-bold fs-5">No results found.</p>
                        <p class="mb-0">We can't find any item matching your search.</p>
                    </div>`;
    }
    else{
        displayProducts(searchedProducts);
    }
}

function validateInput(inputObject){
    var regex = {
        productName : /^(?=.*[A-Z])(?=.*[a-z]).+$/,
        productPrice : /^(6000|[6-9][0-9]{3}|[1-5][0-9]{4}|60000)$/,
        productDescription : /^[\s\S]{4,250}$/,
        productCategory : /^(Mobiles|Laptops|Watches|Tablets|Headsets)$/,
        productImage : /^.+\.(jpg|jpeg|png|webp)$/
    }
    var isValid = regex[inputObject.id].test(inputObject.value);
    console.log(isValid);
    if(isValid){
        inputObject.classList.add('is-valid');
        inputObject.classList.remove('is-invalid');
        inputObject.nextElementSibling.classList.replace('d-block','d-none');
    }
    else{
        inputObject.classList.remove('is-valid');
        inputObject.classList.add('is-invalid');
        inputObject.nextElementSibling.classList.replace('d-none','d-block');
    }
    
    return isValid;
}