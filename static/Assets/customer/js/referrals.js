let requiredDataURL = `${apiURL}/admin/referrals?page=1&perPage=1000&ordering=-user__created_at&search=`;

window.onload = () => {
    getData();
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
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    }
    let data;
    let tableBody = document.getElementById('referrals-table');
    if (url == null) {
        data = requiredDataURL;
    }
    else {
        data = url
    }
    console.log(data);
    tableBody.classList.add('hide');
    document.getElementById('table-loader').classList.remove('hide');
    try {
        // let resp = await requestAPI(requiredDataURL, null, headers, 'GET');
        // // console.log(resp);
        // resp.json().then(function(res) {
        //     console.log(res);
        // })
        let response = await requestAPI('/get-referrals-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            console.log(res);
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.referrals_data;
                document.getElementById('total-referrals-count').innerHTML = res.total_referrals || 0;
                document.getElementById('total-rewards-accumulated').innerHTML = res.total_rewards || 0;
                document.getElementById('total-rewards-by-referrals').innerHTML = res.rewards_by_referrals || 0;
                document.getElementById('total-rewards-by-sales').innerHTML = res.rewards_by_sales || 0;
                tableBody.classList.remove('hide');
            }
            else {
                tableBody.querySelector('tbody').innerHTML = `<tr>
                                                                <td colspan="10" class="no-record-row">No record available</td>
                                                            </tr>`;
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}


function sortByDateBtn(event) {
    let arrows = event.target.closest('button').querySelectorAll('path');
    const url = new URL(requiredDataURL);
    let ordering = url.searchParams.get('ordering');
    if (ordering == '-user__created_at') {
        ordering = 'user__created_at';
        arrows[0].setAttribute('opacity', '.2');
        arrows[1].setAttribute('opacity', '1');
        url.searchParams.set('ordering', ordering);
    }
    else {
        ordering = '-user__created_at';
        arrows[0].setAttribute('opacity', '1');
        arrows[1].setAttribute('opacity', '.2');
        url.searchParams.set('ordering', ordering);
    }
    requiredDataURL = url.toString();
    getData(requiredDataURL);
}


function reverseTableRows() {
    const table = document.getElementById('referrals-table');
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
    table = document.getElementById("referrals-table");
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


function sortByDate(event) {
    let arrows;
    if (event.target.closest('button')) {
        arrows = event.target.closest('button').querySelectorAll('path');
    }
    else if (event.target.closest('th')) {
        arrows = event.target.closest('th').querySelectorAll('path');
    }
    var table = document.getElementById("referrals-table");
    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;
    dir = "asc";

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < rows.length - 1; i++) {
            shouldSwitch = false;

            x = new Date(rows[i].getElementsByTagName("td")[5].getAttribute('dateTime'));
            y = new Date(rows[i + 1].getElementsByTagName("td")[5].getAttribute('dateTime'));

            if (dir === "asc") {
                if (x > y) {
                    shouldSwitch = true;
                    arrows[0].setAttribute('opacity', '.2');
                    arrows[1].setAttribute('opacity', '1');
                    break;
                }
            } else if (dir === "desc") {
                if (x < y) {
                    shouldSwitch = true;
                    arrows[0].setAttribute('opacity', '1');
                    arrows[1].setAttribute('opacity', '.2');
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

function sortByDigits(event, columnIndex) {
    let columnArrows = event.target.closest('th').querySelectorAll('path');
    var table = document.getElementById("referrals-table");
    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;
    dir = "asc"; // Set the default sorting direction to ascending

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


// function sortPurchaseDate(event) {

// }


const customSort = (a, b) => {
    if (a === "No Purchase Date") {
        return 1;
    } else if (b === "No Purchase Date") {
        return -1;
    } else {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA - dateB;
    }
};

const sortPurchaseDate = (columnIndex) => {
    const table = document.getElementById("referrals-table");
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    const sortOrder = table.getAttribute('data-sort-order') === 'asc' ? 'desc' : 'asc';

    rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[columnIndex].textContent.trim();
        const cellB = rowB.cells[columnIndex].textContent.trim();
        return sortOrder === 'asc' ? customSort(cellA, cellB) : customSort(cellB, cellA);
    });
    tbody.innerHTML = '';

    rows.forEach(row => {
        tbody.appendChild(row);
    });

    table.setAttribute('data-sort-order', sortOrder);
};