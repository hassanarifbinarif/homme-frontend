function showInventoryDetails(clickedRow) {
    let table = document.getElementById('inventory-table');
    let nextRow = clickedRow.nextElementSibling;
    if (nextRow && nextRow.getAttribute('data-status') == "true") {
        nextRow.remove();
    }
    else {
        let newRow = table.insertRow(clickedRow.rowIndex + 1);
        newRow.setAttribute('data-status', true);
        newRow.innerHTML = `<td colspan="7">
                                <div class="stock-details-container">
                                    <div class="container-header">
                                        <span>Stock Details</span>
                                        <div>
                                            <span>PRINT PURCHASE ORDER</span>
                                            <div>
                                                <span>Shipped</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                                                    <path d="M13.2012 0L6.60059 8.00071L0 0H13.2012Z" fill="#030706"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <table class="inventory-details-table">
                                        <thead>
                                            <th>
                                                <div><span>Product Name</span></div>
                                            </th>
                                            <th>
                                                <div>
                                                    <span>SKU #</span>
                                                </div>
                                            </th>
                                            <th>
                                                <div>
                                                    <span>Current Stock</span>
                                                </div>
                                            </th>
                                            <th>
                                                <div>
                                                    <span>Movement (7/30 Days)</span>
                                                </div>
                                            </th>
                                            <th>
                                                <div>
                                                    <span>Quantity To Ship</span>
                                                </div>
                                            </th>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div>
                                                        <span>Face Serum</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>07834</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>3</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>4/31</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>5</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div>
                                                        <span>Body Wash</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>07533</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>5</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>3/20</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>0</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div>
                                                        <span>Concealer</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>07533</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>7</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>3/20</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>2</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div>
                                                        <span>Face Mask</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>07834</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>3</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>4/31</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>5</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div>
                                                        <span>Body Wash</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>07533</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>5</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>3/20</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>0</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div>
                                                        <span>Concealer</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>07533</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>7</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>3/20</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>2</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div>
                                                        <span>Face Mask</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>07834</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>3</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>4/31</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>5</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div>
                                                        <span>Body Wash</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>07533</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>5</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>3/20</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>0</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="salon-info-header">
                                        <span>Salon Information</span>
                                    </div>
                                    <table class="inventory-details-table address-info-table">
                                        <thead>
                                            <th>
                                                <div>
                                                    <span>Salon Name</span>
                                                </div>
                                            </th>
                                            <th>
                                                <div>
                                                    <span>Phone Number</span>
                                                </div>
                                            </th>
                                            <th>
                                                <div>
                                                    <span>Address</span>
                                                </div>
                                            </th>
                                            <th>
                                                <div>
                                                    <span>Notes</span>
                                                </div>
                                            </th>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div>
                                                        <span>Redge NYC</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>(316) 555-0116</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>775 Rolling Green Rd, New York, NY 10012</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <span>Lorem Ipsum is simply dummy text of the print industry.</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>`;
    }
}