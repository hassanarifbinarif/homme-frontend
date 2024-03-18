function openQRCodeModal(event, modalId, referralCode, qrCodeString, sourceName='Scan QR Code') {
    event.stopPropagation();
    let modal = document.getElementById(`${modalId}`);
    modal.querySelector('#modal-qr-code-source-name').innerText = sourceName;
    modal.querySelector('#modal-referral-code').innerText = referralCode;
    modal.querySelector('#modal-qr-code').src = `data:image/png;base64,${qrCodeString}`;
    modal.addEventListener('hidden.bs.modal', event => {
        modal.querySelector('#modal-qr-code-source-name').innerText = 'Scan QR Code';
        modal.querySelector('#modal-referral-code').innerText = '';
        modal.querySelector('#modal-qr-code').src = '';  
    })
    document.querySelector(`.${modalId}`).click();
}