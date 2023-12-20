let stockData = {
    salon: null,
    status: 'shipped',
    notes: 'Initial inventory',
    products: []
};

async function openInitialStockModal(salonId, salonName) {
    let modal = document.getElementById('salonAddStock');
    let modalLoader = modal.querySelector('.modal-loader');
    let modalContent = modal.querySelector('.modal-content');
    let productsTable = modal.querySelector('#products-table');
    let productsTableBody = productsTable.querySelector('tbody');
    let modalHeaderText = modal.querySelector('.initial-stock-modal-header');
    modalHeaderText.innerText = `Add Initial Stock To ${salonName}`;
    modal.querySelector('.submit-btn').style.pointerEvents = 'auto';

    modal.addEventListener('hidden.bs.modal', event => {
        modal.querySelector('.btn-text').innerText = 'SAVE';
        modalHeaderText.innerText = 'Add Initial Stock To';
        modalLoader.classList.remove('hide');
        modalContent.classList.add('hide');
        modal.querySelector('.submit-btn').style.pointerEvents = 'none';
        modal.querySelector('.btn-text').innerText = 'ADD';
        modal.querySelector('.create-error-msg').classList.remove('active');
        modal.querySelector('.create-error-msg').innerHTML = '';
        stockData = {
            salon: null,
            status: 'shipped',
            notes: 'Initial inventory',
            products: []
        };
    })

    try {
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
        };
        document.querySelector('.salonAddStock').click();
        let response = await requestAPI(`${apiURL}/admin/products?page=1&perPage=1000`, null, headers, 'GET');
        response.json().then(function(res) {

            productsTableBody.innerHTML = '';
            if (response.status == 200 && res.data.length > 0) {
                res.data.forEach((item) => {
                    productsTableBody.innerHTML += `<tr>
                                                        <td><div><span class="table-text-overflow" title="${item.title}">${item.title}</span></div></td>
                                                        <td><div><span class="table-text-overflow" title="${item.sku_num}">${item.sku_num}</span></div></td>
                                                        <td><div><span class="table-text-overflow" title="${item.short_description}">${item.short_description}</span></div></td>
                                                        <td><div><span>$${item.price}</span></div></td>
                                                        <td><div class="quantity-input"><input type="number" placeholder="Enter numerical value" data-id="${item.id}" data-name="product-quantity" name="quantity" min="0" id="" /></div></td>
                                                    </tr>`;
                })
                stockData.salon = salonId;
            }
            else {
                productsTableBody.innerHTML = '<tr><td colspan="5" class="no-record-row">No record available</td></tr>';
            }

            modalLoader.classList.add('hide');
            modalContent.classList.remove('hide');
        })
    }
    catch (err) {
        console.log(err);
    }

}


async function addInitialStockToSalon(event) {
    event.preventDefault();
    let modal = document.getElementById('salonAddStock');
    let quantityInputs = modal.querySelectorAll('input[data-name="product-quantity"]');
    let button = modal.querySelector('.submit-btn');
    let errorMsg = modal.querySelector('.create-error-msg');

    stockData.products = [];
    quantityInputs.forEach((input) => {
        if (parseInt(input.value) > 0) {
            stockData.products.push({ product: input.getAttribute('data-id'), quantity: parseInt(input.value) });
        }
    })
    
    if (stockData.products.length === 0) {
        errorMsg.classList.add('active');
        errorMsg.innerHTML = 'Add quantity for atleast one product';
        return false;
    }
    else {
        errorMsg.classList.remove('active');
        errorMsg.innerHTML = '';
        try {
            let token = getCookie('admin_access');
            let headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json'
            };
            beforeLoad(button);
            let response = await requestAPI(`${apiURL}/admin/inventory`, JSON.stringify(stockData), headers, 'POST');
            response.json().then(function(res) {
                // console.log(res);
                if (response.status == 201) {
                    button.style.pointerEvents = 'none';
                    afterLoad(button, 'ADDED');
                    getData();
                    setTimeout(() => {
                        document.querySelector('.salonAddStock').click();
                    }, 1000)
                }
                else {
                    afterLoad(button, 'ERROR');
                    errorMsg.classList.add('active');

                    let keys = Object.keys(res.messages);
                    keys.forEach((key) => {
                        errorMsg.innerHTML += `${key}: ${res.messages[key]}. <br />`;
                    })
                }
            })
        }
        catch (err) {
            afterLoad(button, 'ERROR');
            console.log(err);
        }
    }
}