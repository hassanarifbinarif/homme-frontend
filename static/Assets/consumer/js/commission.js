window.onload = () => {
    getNotifications();
}


function showCommissionDetails(clickedRow) {
    let table = document.getElementById('commission-table');
    let nextRow = clickedRow.nextElementSibling;

    if (nextRow && nextRow.getAttribute('data-status') == "true") {
        nextRow.remove();
        clickedRow.style.background = '#FFFFFF';
    }
    else {
        clickedRow.style.background = '#DCDCFF';
        let newRow = table.insertRow(clickedRow.rowIndex + 1);
        newRow.setAttribute('data-status', true);
        newRow.innerHTML = `<td colspan="9">
                                <div class="stock-details-container">
                                    <div class="container-header">
                                        <span>Commission Details</span>
                                        <svg class="cursor-pointer" aria-label="Close" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M13.4672 9.67878C13.8189 8.8295 14 7.91925 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 7.91925 0.18106 8.8295 0.532843 9.67878C0.884626 10.5281 1.40024 11.2997 2.05025 11.9497C2.70026 12.5998 3.47194 13.1154 4.32122 13.4672C5.1705 13.8189 6.08075 14 7 14C7.91925 14 8.8295 13.8189 9.67878 13.4672C10.5281 13.1154 11.2997 12.5998 11.9497 11.9497C12.5998 11.2997 13.1154 10.5281 13.4672 9.67878Z" fill="#D9D9D9"/>
                                            <path d="M4.66602 9.33518L6.99962 7.00157M6.99962 7.00157L9.33323 4.66797M6.99962 7.00157L4.66602 4.66797M6.99962 7.00157L9.33323 9.33518" stroke="#3F3F46" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <table class="inventory-details-table">
                                        <thead>
                                            <th width="12.76%">
                                                <div><span>Customer Name</span></div>
                                            </th>
                                            <th width="7.93%">
                                                <div><span>Order #</span></div>
                                            </th>
                                            <th width="10.75%">
                                                <div><span>Hairstylist</span></div>
                                            </th>
                                            <th width="10.20%">
                                                <div><span>Retail Value</span></div>
                                            </th>
                                            <th width="12.94%">
                                                <div><span>Net Sales</span></div>
                                            </th>
                                            <th width="10.75%">
                                                <div><span>Commission</span></div>
                                            </th>
                                            <th width="11.03%">
                                                <div><span>Status</span></div>
                                            </th>
                                            <th width="23.60%">
                                                <div><span>Delivery Method</span></div>
                                            </th>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div><span>Jerome Bell</span></div>
                                                </td>
                                                <td>
                                                    <div><span class="order-number">#1260</span></div>
                                                </td>
                                                <td>
                                                    <div><span>Jane Cooper</span></div>
                                                </td>
                                                <td>
                                                    <div><span>$150</span></div>
                                                </td>
                                                <td>
                                                    <div><span>$435</span></div>
                                                </td>
                                                <td>
                                                    <div><span>$50</span></div>
                                                </td>
                                                <td>
                                                    <div><span>Pending</span></div>
                                                </td>
                                                <td>
                                                    <div><span>Pick-Up</span></div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div><span>Arlene McCoy</span></div>
                                                </td>
                                                <td>
                                                    <div><span class="order-number">#1260</span></div>
                                                </td>
                                                <td>
                                                    <div><span>Jane Cooper</span></div>
                                                </td>
                                                <td>
                                                    <div><span>$135</span></div>
                                                </td>
                                                <td>
                                                    <div><span>$365</span></div>
                                                </td>
                                                <td>
                                                    <div><span>$35</span></div>
                                                </td>
                                                <td>
                                                    <div><span>Complete</span></div>
                                                </td>
                                                <td>
                                                    <div><span>Shipped</span></div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="details-footer">
                                        <button type="button">OK</button>
                                    </div>
                                </div>
                            </td>`;
    }
}