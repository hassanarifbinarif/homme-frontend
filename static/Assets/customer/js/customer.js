let requiredDataURL = `/admin/user-profiles?user__is_blocked=false&perPage=1000&search=`;

window.onload = () => {
    let url = new URL(location.href);
    let search = url.searchParams.get('search');
    if (search) {
        requiredDataURL = setParams(requiredDataURL, 'search', search);
    }
    getNotifications();
    getData();
}

function searchForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    urlParams = setParams(requiredDataURL, 'search', `${data.search}`);
    getData(urlParams);
}

let totalCustomers = null;

async function getData(url=null) {
    let data;
    let tableBody = document.getElementById('customer-table');
    if (url == null) {
        data = requiredDataURL;
    }
    else {
        data = url;
    }
    document.getElementById('table-loader').classList.remove('hide');
    tableBody.classList.add('hide');
    try {
        let response = await requestAPI('/get-customer-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.customer_data;
                if (totalCustomers == null) {
                    totalCustomers = res.total_customers;
                    document.getElementById('total-customer-number').innerText = res.total_customers;
                }
                tableBody.classList.remove('hide');
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}


function openCreateSourceModal(modalId) {
    let modal = document.getElementById(`${modalId}`);
    let form = modal.querySelector('form');
    form.setAttribute('onsubmit', 'createSourceForm(event);');
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute('onsubmit');
        form.querySelector('.create-error-msg').innerText = '';
        form.querySelector('.create-error-msg').classList.remove('active');
        form.querySelector('.btn-text').innerText = 'CREATE';
    })
    document.querySelector(`.${modalId}`).click();
}


async function createSourceForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let errorMsg = form.querySelector('.create-error-msg');
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;

    if (data.name.trim().length == 0) {
        errorMsg.innerText = 'Enter valid source name';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.embedded_string.trim().length == 0) {
        errorMsg.innerText = 'Enter valid embedded string';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.description.trim().length == 0) {
        errorMsg.innerText = 'Enter description';
        errorMsg.classList.add('active');
        return false;
    }
    else {
        try {
            errorMsg.innerText = '';
            errorMsg.classList.remove('active');
            let token = getCookie('admin_access');
            let headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            };
            beforeLoad(button);
            let response = await requestAPI(`${apiURL}/admin/sources`, JSON.stringify(data), headers, 'POST');
            response.json().then(function(res) {
                afterLoad(button, buttonText);
                if (response.status == 201) {
                    form.removeAttribute('onsubmit');
                    afterLoad(button, 'CREATED');
                    setTimeout(() => {
                        afterLoad(button, buttonText);
                        document.querySelector('.createSource').click();
                        location.href = location.origin + '/source/';
                    }, 1000)
                }
                else if (response.status == 400) {
                    afterLoad(button, 'ERROR');
                    let keys = Object.keys(res.messages);
                    keys.forEach((key) => {
                        errorMsg.innerHTML += `${key}: ${res.messages[key]}. <br />`;
                    })
                    errorMsg.classList.add('active');
                }
                else {
                    afterLoad(button, 'ERROR');
                    errorMsg.innerText = 'Error occurred! Retry later';
                    errorMsg.classList.add('active');
                }
            })
        }
        catch (err) {
            console.log(err);
            afterLoad(button, buttonText);
            errorMsg.innerText = 'Error occurred! Retry later';
            errorMsg.classList.add('active');
        }
    }
}


function reverseTableRows() {
    const table = document.getElementById('customer-table');
    const tableBody = table.querySelector('tbody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.reverse();
    tableBody.innerHTML = '';

    for (const row of rows) {
        tableBody.appendChild(row);
    }
}


function sortByAlphabets(event, columnIndex) {
    let arrows = event.target.closest('th').querySelectorAll('path');
    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("customer-table");
    switching = true;
    dir = "asc";

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < rows.length - 1; i++) {
            shouldSwitch = false;

            x = rows[i].getElementsByTagName("td")[columnIndex].textContent;
            y = rows[i + 1].getElementsByTagName("td")[columnIndex].textContent;

            if (dir === "asc") {
                arrows[0].setAttribute('opacity', '.2');
                arrows[1].setAttribute('opacity', '1');
                if (x.toLowerCase() > y.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "desc") {
                arrows[0].setAttribute('opacity', '1');
                arrows[1].setAttribute('opacity', '.2');
                if (x.toLowerCase() < y.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }

        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount === 0 && dir === "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}


function extractNumber(value) {
    return parseFloat(value.match(/\d+/)[0]);
}

function sortByOrder(event, columnIndex) {
    let columnArrows = event.target.closest('th').querySelectorAll('path');
    var table = document.getElementById("customer-table");
    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;
    dir = "asc";

    while (switching) {
        switching = false;
        rows = table.rows;
    
        for (i = 1; i < rows.length - 1; i++) {
            shouldSwitch = false;
    
            x = extractNumber(rows[i].getElementsByTagName("td")[columnIndex].textContent);
            y = extractNumber(rows[i + 1].getElementsByTagName("td")[columnIndex].textContent);
        
            if (dir === "asc") {
                columnArrows[0].setAttribute('opacity', '.2');
                columnArrows[1].setAttribute('opacity', '1');
                if (x > y) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "desc") {
                columnArrows[0].setAttribute('opacity', '1');
                columnArrows[1].setAttribute('opacity', '.2');
                if (x < y) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
    
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount === 0 && dir === "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}