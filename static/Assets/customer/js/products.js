let requiredDataURL = `/admin/products?page=1&perPage=1000&ordering=-sort_order`;

let productCategoryDropdown = document.getElementById('product-category-dropdown');
let productCategoryDropdownBtn = document.getElementById('product-category');
let productCategoryOptions = document.querySelectorAll('input[name="product_category_radio"]');

let productTypeDropdown = document.getElementById('product-type-dropdown');
let productTypeDropdownBtn = document.getElementById('product-type');
let productTypeOptions = document.querySelectorAll('input[name="product_type_radio"]');

let skinTypeDropdown = document.getElementById('skin-type-dropdown');
let skinTypeDropdownBtn = document.getElementById('skin-type');
let skinTypeOptions = document.querySelectorAll('input[name="skin_type_radio"]');


window.onload = () => {
    // getNotifications();
    getData();
    populateModalDropdowns();
}

function searchForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    urlParams = setParams(requiredDataURL, 'search', `${data.search}`);
    getData(urlParams);
}


async function getData(url=null) {
    let data;
    let tableBody = document.getElementById('product-table');
    if (url == null) {
        data = requiredDataURL;
    }
    else {
        data = url;
    }
    document.getElementById('table-loader').classList.remove('hide');
    tableBody.classList.add('hide');
    try {
        let response = await requestAPI('/get-product-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            // console.log(res);
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.product_data;
                tableBody.classList.remove('hide');
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}


function reverseTableRows() {
    const table = document.getElementById('product-table');
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
    table = document.getElementById("product-table");
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


let dragSrcEl;

function allowDrop(event) {
    event.preventDefault();
    return false;
}

function drag(event) {
    row = event.target.closest('tr');
    row.style.opacity = '0.4';
    dragSrcEl = row;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', row.innerHTML);
}

function handleDragEnd(event) {
    row = event.target.closest('tr');
    row.style.opacity = '1';
}

async function drop(event) {
    event.stopPropagation();
    let targetRow = event.target.closest('tr');

    if (dragSrcEl != targetRow) {
        dragSrcEl.innerHTML = targetRow.innerHTML;
        targetRow.innerHTML = event.dataTransfer.getData('text/html');
        let draggedUponRowId = targetRow.getAttribute("data-id");
        let draggedRowId = dragSrcEl.getAttribute("data-id");
        let draggedUponRowOrder = targetRow.getAttribute("data-sort-order") == "0" ? targetRow.getAttribute("data-id") : targetRow.getAttribute("data-sort-order");
        let draggedRowOrder = dragSrcEl.getAttribute("data-sort-order") == "0" ? dragSrcEl.getAttribute("data-id") : dragSrcEl.getAttribute("data-sort-order");

        if (draggedRowOrder == draggedUponRowOrder) {
            draggedRowOrder = draggedRowId;
            draggedUponRowOrder = draggedUponRowId;
        }

        let updateTargetRowOrder = await updateSortOrder(parseInt(draggedUponRowId), parseInt(draggedRowOrder));
        if (updateTargetRowOrder.status == 200) {
            targetRow.setAttribute('data-sort-order', draggedUponRowOrder);
            targetRow.setAttribute('data-id', draggedRowId);
        }
        
        let updateDraggedRowOrder = await updateSortOrder(parseInt(draggedRowId), parseInt(draggedUponRowOrder));
        if (updateDraggedRowOrder.status == 200) {
            dragSrcEl.setAttribute('data-sort-order', draggedRowOrder);
            dragSrcEl.setAttribute('data-id', draggedUponRowId);
        }
    }
}


async function updateSortOrder(id, order) {
    try {
        let token = getCookie('admin_access');
        let headers = { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };
        let response = await requestAPI(`${apiURL}/admin/products/${id}`, JSON.stringify({ "sort_order": order}), headers, 'PATCH');
        return response;
    }
    catch (err) {
        console.log(err);
    }
}