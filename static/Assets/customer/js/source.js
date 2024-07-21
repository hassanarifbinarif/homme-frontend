let perPage = 30;
let requiredDataURL = `/admin/sources?page=1&perPage=${perPage}&search=&ordering=-created_at`;

let perPageDropdownOptionContainer = document.getElementById('per-page-dropdown-options-container');
let previousPageBtn = document.getElementById('previous-nav-btn');
let nextPageBtn = document.getElementById('next-nav-btn');
let currentPageElement = document.getElementById('current-nav-page');

window.onload = () => {
    // getNotifications();
    getData();
    // populatePossiblePerPageOptions();
}


function populatePossiblePerPageOptions() {
    for (let i = 10; i < 30; i++) {
        let span = document.createElement('span');
        span.textContent = i;
        span.classList.add('dropdown-item');
        span.setAttribute('onclick', `setPerPage(${i})`);
        perPageDropdownOptionContainer.appendChild(span);
    }
}


function setPerPage(count) {
    if (count == 'ALL' || count == NaN)
        perPage = 10000;
    else
        perPage = count;
    requiredDataURL = setParams(requiredDataURL, 'perPage', perPage);
    requiredDataURL = setParams(requiredDataURL, 'page', 1);
    getData();
    document.getElementById('current-per-page').innerText = count;
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
    let tableBody = document.getElementById('source-table');
    if (url == null)
        data = requiredDataURL;
    else
        data = url
    tableBody.classList.add('hide');
    document.getElementById('table-loader').classList.remove('hide');
    try {
        let response = await requestAPI('/get-source-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.source_data;
                setPaginationLinks(res.pagination_data);
                convertDateTime();
                tableBody.classList.remove('hide');
            }
            else {
                tableBody.querySelector('tbody').innerHTML = `<tr>
                                                                <td colspan="8" class="no-record-row">No record available</td>
                                                            </tr>`;
                document.getElementById('table-loader').classList.add('hide');
                tableBody.classList.remove('hide');
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}


function setPaginationLinks(paginationData) {
    currentPage = paginationData.currentPage;
    currentPageElement.innerText = currentPage;

    if (paginationData.links.next != null) {
        nextPageBtn.classList.remove('opacity-point-6');
        nextPageBtn.classList.add('cursor-pointer');
        nextPageBtn.setAttribute('onclick', `getPageData(${currentPage + 1})`);
    }
    else {
        nextPageBtn.classList.add('opacity-point-6');
        nextPageBtn.classList.remove('cursor-pointer');
        nextPageBtn.removeAttribute('onclick');
    }

    if (paginationData.links.previous != null) {
        previousPageBtn.classList.remove('opacity-point-6');
        previousPageBtn.classList.add('cursor-pointer');
        previousPageBtn.setAttribute('onclick', `getPageData(${currentPage - 1})`);
    }
    else {
        previousPageBtn.classList.add('opacity-point-6');
        previousPageBtn.classList.remove('cursor-pointer');
        previousPageBtn.removeAttribute('onclick');
    }
}


function getPageData(pageNumber) {
    requiredDataURL = setParams(requiredDataURL, 'page', pageNumber);
    getData(requiredDataURL);
}


function reverseTableRows() {
    const table = document.getElementById('source-table');
    const tableBody = table.querySelector('tbody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.reverse();
    tableBody.innerHTML = '';

    for (const row of rows) {
        tableBody.appendChild(row);
    }
}


const sortOrders = {};

function sortByAlphabets(event, columnIndex) {
    const arrows = event.target.closest('th').querySelectorAll('path');
    const table = document.getElementById("source-table");
    const currentOrder = sortOrders[columnIndex] || 'asc';

    const rows = Array.from(table.rows).slice(1); // Exclude the header row

    rows.sort((rowA, rowB) => {
        const valueA = rowA.getElementsByTagName("td")[columnIndex].textContent.toLowerCase();
        const valueB = rowB.getElementsByTagName("td")[columnIndex].textContent.toLowerCase();

        return currentOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

    // Clear table content
    const tbody = table.querySelector('tbody');
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    // Append sorted rows to the table
    for (let i = 0; i < rows.length; i++) {
        tbody.appendChild(rows[i]);
    }

    // Toggle arrow opacity and update sortOrders object
    arrows[0].setAttribute('opacity', currentOrder === 'asc' ? '0.2' : '1');
    arrows[1].setAttribute('opacity', currentOrder === 'asc' ? '1' : '0.2');
    
    // Update sort order for the current column
    sortOrders[columnIndex] = currentOrder === 'asc' ? 'desc' : 'asc';
}


function sortByDate(event) {
    let arrows;
    if (event.target.closest('button')) {
        arrows = event.target.closest('button').querySelectorAll('path');
    } else if (event.target.closest('th')) {
        arrows = event.target.closest('th').querySelectorAll('path');
    }
    const table = document.getElementById("source-table");
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.rows);

    const currentOrder = sortOrders[2] || 'asc';

    const sortedRows = rows.sort((rowA, rowB) => {
        const x = new Date(rowA.getElementsByTagName("td")[2].getAttribute('dateTime'));
        const y = new Date(rowB.getElementsByTagName("td")[2].getAttribute('dateTime'));

        return currentOrder === 'asc' ? x - y : y - x;
    });

    // Clear table content
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    // Append sorted rows to the table
    for (const sortedRow of sortedRows) {
        tbody.appendChild(sortedRow);
    }

    // Toggle arrow opacity
    arrows[0].setAttribute('opacity', currentOrder === 'asc' ? '0.2' : '1');
    arrows[1].setAttribute('opacity', currentOrder === 'asc' ? '1' : '0.2');
    sortOrders[2] = currentOrder === 'asc' ? 'desc' : 'asc';
}


function convertDateTime() {
    let times = document.querySelectorAll('.created-at-date');
    times.forEach((dateTime) => {
        const inputDate = new Date(dateTime.textContent);

        const day = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(inputDate);
        const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(inputDate);
        const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(inputDate);
        const result = `${day}-${month}-${year}`;

        dateTime.textContent = result;
    })
}