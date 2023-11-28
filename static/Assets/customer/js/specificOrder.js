window.onload = () => {
    getNotifications();
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

        // html2pdf().from(res.packing_data).set(options).outputPdf().then(function(pdf) {
        //     // Open the generated PDF in a new tab
        //     var blob = new Blob([pdf], { type: 'application/pdf' });
        //     var url = URL.createObjectURL(blob);
        //     var printWindow = window.open(url, '_blank');
        //     printWindow.document.write(res.packing_data);
        // });

        // html2pdf().from(res.packing_data).set({ html2canvas: { scale: 4, useCORS: true } }).save();
        
        // var printWindow = window.open('', '_blank');
        // printWindow.document.write(res.packing_data);

        // // Trigger the print dialog
        // printWindow.print();
    })
}