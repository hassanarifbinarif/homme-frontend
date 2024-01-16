let requiredDataURL = `/admin/products?page=1&perPage=1000&ordering=-created_at`;

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
    getData();
    populateModalDropdowns();
    // getNotifications();
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
        let response = await requestAPI('/consumer/get-product-list/', JSON.stringify(data), {}, 'POST');
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