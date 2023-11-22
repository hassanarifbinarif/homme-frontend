let requiredDataURL = `${apiURL}/admin/user-profiles?user__is_blocked=false&perPage=1000`;

window.onload = () => {
    let url = new URL(location.href);
    let search = url.searchParams.get('search');
    if (search) {
        requiredDataURL = setParams(requiredDataURL, 'search', search);
    }
    getData();
}

function searchForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    urlParams = setParams(requiredDataURL, 'search', `${data.search}`);
    getData(urlParams);
    // event.preventDefault();
    // let searchField = document.getElementById('search-customer');
    // const table = document.getElementById("customer-table");
    // const rows = table.getElementsByTagName("tr");
    // for (let i = 1; i < rows.length; i++) {
    //     const cellValue = rows[i].getElementsByTagName("td")[1].children[0].children[0].innerText;

    //     if (cellValue.toLowerCase().includes(searchField.value.toLowerCase())) {
    //         rows[i].style.display = "";
    //         rows[i].setAttribute('search-filtered', true);
    //     } else if (searchField.value == '') {
    //         rows[i].style.display = "";
    //         rows[i].setAttribute('search-filtered', true);
    //     }
    //     else {
    //         rows[i].style.display = "none";
    //         rows[i].setAttribute('search-filtered', false);
    //     }
    // }
}

let totalCustomers = null;

async function getData(url=null) {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    }
    let data;
    let tableBody = document.getElementById('customer-table');
    if (url == null) {
        data = requiredDataURL;
    }
    else {
        data = url;
        document.getElementById('table-loader').classList.remove('hide');
        tableBody.classList.add('hide');
    }
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