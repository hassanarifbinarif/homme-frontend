async function openFullInventory(id) {
    let modal = document.getElementById('salonInventory');
    let modalLoader = modal.querySelector('.modal-loader');
    let modalContent = modal.querySelector('.modal-content');
    document.querySelector('.salonInventory').click();

    try {
        let salonInventoryTable = modal.querySelector('#salon-inventory-table');
        let salonInventoryTableBody = salonInventoryTable.querySelector('tbody');

        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`
        };
        let response = await requestAPI(`${apiURL}/admin/inventory?page=1&perPage=1&salon=${specific_salon_id}&ordering=-id`, null, headers, 'GET');
        response.json().then(function(res) {
            // console.log(res);
            salonInventoryTableBody.innerHTML = '';

            if (response.status == 200) {
                if (res.data.length > 0 && res.data[0].products.length > 0) {
                    res.data[0].products.forEach((prod) => {
                        salonInventoryTableBody.innerHTML += `<tr>
                                                                <td><div><span>${prod.product.title}</span></div></td>
                                                                <td><div><span>${prod.product.sku_num}</span></div></td>
                                                                <td><div><span>${prod.current_stock}</span></div></td>
                                                                <td><div><span>${prod.movement_week}/${prod.movement_month}</span></div></td>
                                                                <td><div><span>${prod.quantity}</span></div></td>
                                                            </tr>`;
                    })
                    modal.querySelector('#salonInventory-name').innerText = res.data[0].salon.salon_name;
                    modal.querySelector('#salonInventory-name').title = res.data[0].salon.salon_name;
                    modal.querySelector('#salonInventory-phone').innerText = res.data[0].salon.contact_phone;
                    modal.querySelector('#salonInventory-address').innerText = `${res.data[0].salon.address.street1}, ${res.data[0].salon.address.city}, ${res.data[0].salon.address.state} ${res.data[0].salon.address.zip_code}`;
                    modal.querySelector('#salonInventory-address').title = `${res.data[0].salon.address.street1}, ${res.data[0].salon.address.city}, ${res.data[0].salon.address.state} ${res.data[0].salon.address.zip_code}`;
                    modal.querySelector('#salonInventory-notes').innerText = res.data[0].notes;
                    modal.querySelector('#salonInventory-notes').title = res.data[0].notes;
                }
                else {
                    salonInventoryTableBody.innerHTML = '<tr><td colspan="5" class="no-record-row">No record available</td></tr>';
                }

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