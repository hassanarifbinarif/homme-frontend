window.onload = () => {
    getNotifications();
    convertDateTime();
}

async function printPackingSlip(id) {
    let response = await requestAPI(`/get-packing-slip/${id}/`, null, {}, 'GET');
    response.json().then(function(res) {

        // Create options for pdf generation
        var options = {
            filename: 'generated-pdf.pdf',
            html2canvas: { scale: 4, useCORS: true },
        };

        // Use html2pdf to generate the PDF
        // html2pdf().from(res.packing_data).set(options).save();

        html2pdf().from(res.packing_data).set(options).toPdf().get('pdf').then(function (pdf) {
            window.open(pdf.output('bloburl'), '_blank');
        });

        // html2pdf().from(res.packing_data).set({ html2canvas: { scale: 4, useCORS: true } }).save();
        
        // var printWindow = window.open('', '_blank');
        // printWindow.document.write(res.packing_data);

        // // Trigger the print dialog
        // printWindow.print();
    })
}


function convertDateTime() {
    let times = document.querySelectorAll('.time-value');
    times.forEach((dateTime) => {
        const inputDate = new Date(dateTime.textContent);
        const formattedTime = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: 'numeric',
            hour12: true,
        }).format(inputDate);
        
        const result = `${formattedTime}`;

        dateTime.textContent = result;
    })

    let dates = document.querySelectorAll('.date-value');
    dates.forEach((dateTime) => {
        const inputDate = new Date(dateTime.textContent);

        const day = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(inputDate);
        const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(inputDate);
        const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(inputDate);
        const result = `${month} ${day}, ${year}`;

        dateTime.textContent = result;
    })
}