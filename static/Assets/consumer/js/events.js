let requiredDataURL = `/admin/content/events?page=1&perPage=1000&search=&ordering=-created_at`;

window.onload = () => {
    getData();
    populateProducts();
    // getNotifications();
}

function searchForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    requiredDataURL = setParams(requiredDataURL, 'search', `${data.search}`);
    getData(requiredDataURL);
}


async function getData(url=null) {
    let data;
    let tableBody = document.getElementById('events-table');
    if (url == null) {
        data = requiredDataURL;
    }
    else {
        data = url;
    }
    document.getElementById('table-loader').classList.remove('hide');
    tableBody.classList.add('hide');
    try {
        let response = await requestAPI('/consumer/get-events-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            // console.log(res);
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.events_data;
                tableBody.classList.remove('hide');
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}


function openDelEventModal(modalID, id) {
    let modal = document.querySelector(`#${modalID}`);
    let form = modal.querySelector('form');
    form.setAttribute("onsubmit", `delEventForm(event, ${id})`);
    modal.querySelector('#modal-header-text').innerText = 'Delete Event';
    modal.querySelector('#warning-statement').innerText = 'Are you sure you want to delete this event?';
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        form.querySelector('button[type="submit"]').disabled = false;
        modal.querySelector('#modal-header-text').innerText = '';
        modal.querySelector('#warning-statement').innerText = '';
        modal.querySelector('.btn-text').innerText = 'DELETE';
    })
    document.querySelector(`.${modalID}`).click();
}

async function delEventForm(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;

    try {
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`
        };
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/content/events/${id}`, null, headers, 'DELETE');
        // console.log(response);
        if (response.status == 204) {
            form.reset();
            form.removeAttribute("onsubmit");
            button.disabled = true;
            afterLoad(button, 'DELETED');
            getData();
            setTimeout(() => {
                button.disabled = false;
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


const sortOrders = {};

function sortByAlphabets(event, columnIndex) {
    const arrows = event.target.closest('th').querySelectorAll('path');
    const table = document.getElementById("events-table");
    const currentOrder = sortOrders[columnIndex] || 'asc';

    const rows = Array.from(table.rows).slice(1);

    rows.sort((rowA, rowB) => {
        const valueA = rowA.getElementsByTagName("td")[columnIndex].textContent.toLowerCase();
        const valueB = rowB.getElementsByTagName("td")[columnIndex].textContent.toLowerCase();

        return currentOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

    const tbody = table.querySelector('tbody');
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    for (let i = 0; i < rows.length; i++) {
        tbody.appendChild(rows[i]);
    }

    arrows[0].setAttribute('opacity', currentOrder === 'asc' ? '0.2' : '1');
    arrows[1].setAttribute('opacity', currentOrder === 'asc' ? '1' : '0.2');
    
    sortOrders[columnIndex] = currentOrder === 'asc' ? 'desc' : 'asc';
}


function reverseTableRows() {
    const table = document.getElementById('events-table');
    const tableBody = table.querySelector('tbody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.reverse();
    tableBody.innerHTML = '';

    for (const row of rows) {
        tableBody.appendChild(row);
    }
}