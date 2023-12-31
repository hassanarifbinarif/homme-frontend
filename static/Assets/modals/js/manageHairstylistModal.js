let stylistData = [];

async function openManageHairstylistModal(id) {
    let modal = document.getElementById('manageHairstylist');
    let modalLoader = modal.querySelector('.modal-loader');
    let modalContent = modal.querySelector('.modal-content');

    modal.addEventListener('hidden.bs.modal', event => {
        modalLoader.classList.remove('hide');
        modalContent.classList.add('hide');
        afterLoad(modal.querySelector('.submit-btn'), 'SAVE');
        modal.querySelector('.update-error-msg').classList.remove('active');
        modal.querySelector('.update-error-msg').innerHTML = '';
        stylistData = [];
    })

    document.querySelector('.manageHairstylist').click();

    try {
        let hairstylistTable = modal.querySelector('#hairstylist-table');
        let hairstylistTableBody = hairstylistTable.querySelector('tbody');

        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`
        };
        let response = await requestAPI(`${apiURL}/admin/salons/stylists?page=1&perPage=1000&salon=${specific_salon_id}`, null, headers, 'GET');
        response.json().then(function(res) {
            // console.log(res);
            hairstylistTableBody.innerHTML = '';

            if (response.status == 200 && res.data.length > 0) {
                res.data.forEach((item) => {
                    stylistData.push({id: item.id, fullname: item.fullname, first_name: item.first_name, last_name: item.last_name, email: item.email, phone: item.phone, address: item.address, city: item.city, state: item.state, zip_code: item.zip_code, country: item.country, status: item.status,  action: ""});
                    hairstylistTableBody.innerHTML += `<tr data-id="stylist-row-${item.id}">
                                                            <td><div><input type="text" name="fullname" value="${item.fullname}" readonly placeholder="Stylist Name" /></div></td>
                                                            <td><div><input type="tel" name="phone" value="${item.phone}" readonly placeholder="Phone" /></div></td>
                                                            <td>
                                                                <div class="status-options-div">
                                                                    <select name="status" id="" disabled>
                                                                        <option value="active" ${item.status == 'active'? 'selected': ''}>Active</option>
                                                                        <option value="inactive" ${item.status == 'inactive'? 'selected': ''}>Inactive</option>
                                                                        <option value="leave" ${item.status == 'leave'? 'selected': ''}>On Leave</option>
                                                                    </select>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div class="hairstylist-operations">
                                                                    <svg onclick="openEditHairStylistModal(${item.id}, 'disable')" data-id="show-btn" class="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                                        <path d="M8.09409 10.9813C7.73351 11.0494 7.36732 11.0836 7.00034 11.0833C4.38818 11.0833 2.17734 9.36658 1.43359 7C1.63383 6.36306 1.94226 5.76535 2.34534 5.23308M5.76251 5.76275C6.09073 5.43453 6.53588 5.25014 7.00005 5.25014C7.46422 5.25014 7.90938 5.43453 8.23759 5.76275C8.56581 6.09097 8.7502 6.53612 8.7502 7.00029C8.7502 7.46446 8.56581 7.90962 8.23759 8.23783M5.76251 5.76275L8.23759 8.23783M5.76251 5.76275L8.23701 8.23667M8.23759 8.23783L10.1573 10.157M5.76368 5.76333L3.84451 3.84417M3.84451 3.84417L1.75034 1.75M3.84451 3.84417C4.78505 3.23725 5.88098 2.91515 7.00034 2.91667C9.61251 2.91667 11.8233 4.63342 12.5671 7C12.1565 8.3011 11.3038 9.41767 10.1568 10.1564M3.84451 3.84417L10.1568 10.1564M10.1568 10.1564L12.2503 12.25" stroke="#515254" stroke-linecap="round" stroke-linejoin="round"/>
                                                                    </svg>
                                                                    <svg onclick="openEditHairStylistModal(${item.id})" class="cursor-pointer" data-id="edit-btn" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                                        <path d="M6.41536 2.91538H3.4987C3.18928 2.91538 2.89253 3.03829 2.67374 3.25709C2.45495 3.47588 2.33203 3.77263 2.33203 4.08204V10.4987C2.33203 10.8081 2.45495 11.1049 2.67374 11.3237C2.89253 11.5425 3.18928 11.6654 3.4987 11.6654H9.91536C10.2248 11.6654 10.5215 11.5425 10.7403 11.3237C10.9591 11.1049 11.082 10.8081 11.082 10.4987V7.58204M10.2572 2.09054C10.3648 1.97912 10.4936 1.89024 10.6359 1.82909C10.7782 1.76795 10.9313 1.73577 11.0862 1.73442C11.2411 1.73307 11.3948 1.76259 11.5381 1.82125C11.6815 1.87991 11.8118 1.96654 11.9213 2.07608C12.0309 2.18563 12.1175 2.31589 12.1762 2.45926C12.2348 2.60264 12.2643 2.75627 12.263 2.91118C12.2616 3.06609 12.2295 3.21918 12.1683 3.36152C12.1072 3.50385 12.0183 3.63259 11.9069 3.74021L6.89836 8.74871H5.2487V7.09904L10.2572 2.09054Z" stroke="#000093" stroke-linecap="round" stroke-linejoin="round"/>
                                                                    </svg>
                                                                    <svg onclick="openDelModal(${item.id})" class="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                                        <path d="M5.83203 6.41667V9.91667M8.16536 6.41667V9.91667M2.33203 4.08333H11.6654M11.082 4.08333L10.5763 11.1662C10.5553 11.4605 10.4236 11.736 10.2077 11.9371C9.99174 12.1382 9.70762 12.25 9.41253 12.25H4.58486C4.28978 12.25 4.00565 12.1382 3.78971 11.9371C3.57377 11.736 3.44207 11.4605 3.42111 11.1662L2.91536 4.08333H11.082ZM8.7487 4.08333V2.33333C8.7487 2.17862 8.68724 2.03025 8.57784 1.92085C8.46845 1.81146 8.32007 1.75 8.16536 1.75H5.83203C5.67732 1.75 5.52895 1.81146 5.41955 1.92085C5.31016 2.03025 5.2487 2.17862 5.2487 2.33333V4.08333H8.7487Z" stroke="#CF0000" stroke-linecap="round" stroke-linejoin="round"/>
                                                                    </svg>
                                                                </div>
                                                            </td>
                                                        </tr>`;
                })
            }
            else {
                hairstylistTableBody.innerHTML = '<tr><td colspan="4" class="no-record-row">No record available</td></tr>';
            }

            modalLoader.classList.add('hide');
            modalContent.classList.remove('hide');
        })
    }
    catch (err) {
        console.log(err);
    }
}


let rowStates = {};

// function toggleStylistInputs(id) {
//     let currentState = rowStates[id] || 'enabled';
//     let row = document.querySelector(`tr[data-id='stylist-row-${id}']`);
    
//     if (currentState == 'enabled') {
//         row.querySelector('input[name="fullname"]').readOnly = false;
//         row.querySelector('input[name="fullname"]').focus();
//         row.querySelector('input[name="phone"]').readOnly = false;
//         row.querySelector('select[name="status"]').disabled = false;
//         currentState = 'disabled';
//     }
//     else {
//         row.querySelector('input[name="fullname"]').readOnly = true;
//         row.querySelector('input[name="phone"]').readOnly = true;
//         row.querySelector('select[name="status"]').disabled = true;
//         currentState = 'enabled';
//     }

//     rowStates[id] = currentState;
// }


function openDelModal(id) {
    let modal = document.querySelector(`#delModal`);
    let form = modal.querySelector('form');
    form.setAttribute("onsubmit", `delStylistForm(event, ${id})`);
    modal.querySelector('#modal-header-text').innerText = 'Delete Hairstylist';
    modal.querySelector('#warning-statement').innerText = 'Are you sure you want to delete this hairstylist?';
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        modal.querySelector('#modal-header-text').innerText = '';
        modal.querySelector('#warning-statement').innerText = '';
        modal.querySelector('.btn-text').innerText = 'DELETE';
    })
    document.querySelector(`.delModal`).click();
}


async function delStylistForm(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    let hairStylistWrapper = document.getElementById('hair-stylist-wrapper');
    let hairStylistList = hairStylistWrapper.querySelectorAll('span[data-role="stylist"]');
    let row = document.querySelector(`tr[data-id='stylist-row-${id}']`);

    try {
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`
        };
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/salons/stylists/${id}`, null, headers, 'DELETE');
        // console.log(response);
        if (response.status == 204) {
            form.reset();
            form.removeAttribute("onsubmit");
            row.remove();
            hairStylistList.forEach((stylist) => {
                if (id == parseInt(stylist.getAttribute('data-id'))) {
                    stylist.remove();
                }
            })
            afterLoad(button, 'DELETED');
            setTimeout(() => {
                document.querySelector('.delModal').click();
            }, 1000)
        }
        else {
            afterLoad(button, 'Error');
        }
    }
    catch (err) {
        afterLoad(button, 'Error');
        console.log(res);
    }
}


// For bulk delete

function delHairstylist(id) {
    let row = document.querySelector(`tr[data-id='stylist-row-${id}']`);
    let currentState = rowStates[id] || 'enabled';
    
    if (currentState == 'enabled' || stylistData.filter((stylist) => stylist.id == id).map(stylist => stylist.action)[0] != 'del') {
        row.querySelector('input[name="fullname"]').readOnly = true;
        row.querySelector('input[name="phone"]').readOnly = true;
        row.querySelector('select[name="status"]').disabled = true;
        row.querySelector('svg[data-id="edit-btn"]').removeAttribute('onclick');
        row.classList.add('opacity-point-3-5');
        stylistData.filter((stylist) => stylist.id == id).map(stylist => stylist.action = 'del');
        currentState = 'disabled';
    }
    else {
        stylistData.filter((stylist) => stylist.id == id).map(stylist => stylist.action = '');
        row.querySelector('svg[data-id="edit-btn"]').setAttribute('onclick', `openEditHairStylistModal(${id})`);
        row.classList.remove('opacity-point-3-5');
        currentState = 'enabled';
    }
    
    rowStates[id] = currentState;
}


// For bulk delete

async function submitStylists(event) {
    event.preventDefault();
    let hairStylistWrapper = document.getElementById('hair-stylist-wrapper');
    let hairStylistList = hairStylistWrapper.querySelectorAll('span[data-role="stylist"]');
    let modal = document.getElementById('manageHairstylist');
    let button = modal.querySelector('.submit-btn');
    let errorMsg = modal.querySelector('.update-error-msg');

    if (stylistData.length == 0) {
        document.querySelector('.manageHairstylist').click();
    }
    else {
        stylistsToDelete = [];
        stylistData.forEach((stylist) => {
            if (stylist.action == 'del') {
                stylistsToDelete.push(stylist.id);
            }
        })
        if (stylistsToDelete.length > 0) {
            let token = getCookie('admin_access');
            let headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json'
            };
            beforeLoad(button);
            let response = await requestAPI(`${apiURL}/admin/salons/stylists`, JSON.stringify({ ids: stylistsToDelete }), headers, 'DELETE');
            if (response.status == 204 || response.status == 200) {
                afterLoad(button, 'SAVED');
                hairStylistList.forEach((stylist) => {
                    if (stylistsToDelete.includes(parseInt(stylist.getAttribute('data-id')))) {
                        stylist.remove();
                    }
                })
                setTimeout(() => {
                    document.querySelector('.manageHairstylist').click();
                }, 1200)
            }
            else {
                response.json().then(function(res) {
                    afterLoad(button, 'ERROR');
                    errorMsg.classList.add('active');
                    let keys = Object.keys(res.messages);
                    keys.forEach((key) => {
                        errorMsg.innerHTML += `${key}: ${res.messages[key]} <br />`;
                    })
                })
            }
        }
    }
}