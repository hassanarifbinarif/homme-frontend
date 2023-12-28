function populateInventoryTableBody(list, tableBody) {
    list.forEach((prod) => {
        tableBody.innerHTML += `<tr>
                                    <td><div><span title="${prod.product.title}" class="table-text-overflow">${prod.product.title}</span></div></td>
                                    <td><div><span title="${prod.product.sku_num}" class="table-text-overflow">${prod.product.sku_num}</span></div></td>
                                    <td><div><span>${prod.quantity}</span></div></td>
                                    <td><div><span>${prod.movement_week}/${prod.movement_month}</span></div></td>
                                    <td><div><span>${prod.required_stock}</span></div></td>
                                </tr>`;
    })
}

async function openFullInventory(id, salonName, salonPhone, salonAddress, salonNotes) {
    let modal = document.getElementById('salonInventory');
    let modalLoader = modal.querySelector('.modal-loader');
    let modalContent = modal.querySelector('.modal-content');
    let modalBody = modal.querySelector('.modal-body');

    modal.addEventListener('hidden.bs.modal', event => {
        modalLoader.classList.remove('hide');
        modalContent.classList.add('hide');
        modal.querySelector('.modal-footer').classList.remove('hide');
        modal.querySelector('.inventory-none').classList.add('hide');
        modal.querySelector('.btn-text').innerText = 'RESET STOCK';
        modal.querySelector('.submit-btn').style.pointerEvents = 'auto';
    })

    document.querySelector('.salonInventory').click();

    try {
        let salonInventoryTable = modal.querySelector('#salon-inventory-table');
        let salonInventoryTableBody = salonInventoryTable.querySelector('tbody');

        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`
        };
        let response = await requestAPI(`${apiURL}/admin/inventory/salons/${specific_salon_id}/current`, null, headers, 'GET');
        response.json().then(function(res) {
            salonInventoryTableBody.innerHTML = '';

            if (response.status == 200 && res.length === 0) {
                modal.querySelector('.modal-footer').classList.add('hide');
                modal.querySelector('.inventory-none').classList.remove('hide');
                modalBody.classList.add('hide');
            }
            else if (response.status == 200 && res.length > 0) {
                modal.querySelector('.modal-footer').classList.remove('hide');
                modal.querySelector('.inventory-none').classList.add('hide');
                modalBody.classList.remove('hide');

                populateInventoryTableBody(res, salonInventoryTableBody);
                
                modal.querySelector('#salonInventory-name').innerText = salonName;
                modal.querySelector('#salonInventory-name').title = salonName;
                modal.querySelector('#salonInventory-phone').innerText = salonPhone;
                modal.querySelector('#salonInventory-address').innerText = salonAddress;
                modal.querySelector('#salonInventory-address').title = salonAddress;
                modal.querySelector('#salonInventory-notes').innerText = salonNotes;
                modal.querySelector('#salonInventory-notes').title = salonNotes;
            }
            else {
                salonInventoryTableBody.innerHTML = '<tr><td colspan="5" class="no-record-row">No record available</td></tr>';
            }
            modalLoader.classList.add('hide');
            modalContent.classList.remove('hide');
        })
    }
    catch (err) {
        console.log(err);
    }
}


async function resetStock(button) {
    let salonInventoryTable = document.querySelector('#salon-inventory-table');
    let salonInventoryTableBody = salonInventoryTable.querySelector('tbody');
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    };

    beforeLoad(button);
    button.style.pointerEvents = 'none';
    let response = await requestAPI(`${apiURL}/admin/inventory/salons/${specific_salon_id}/reset`, null, headers, 'POST');
    response.json().then(function(res) {

        salonInventoryTableBody.innerHTML = '';
        if (response.status == 200 && res.length > 0) {
            populateInventoryTableBody(res, salonInventoryTableBody);
            afterLoad(button, 'STOCK RESET');
            setTimeout(() => {
                afterLoad(button, 'RESET STOCK');
                document.querySelector('.salonInventory').click();
                button.style.pointerEvents = 'auto';
            }, 1200)
        }
        else {
            afterLoad(button, 'ERROR');
            salonInventoryTableBody.innerHTML = '<tr><td colspan="5" class="no-record-row">No record available</td></tr>';
        }
    })
}