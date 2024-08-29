function openViewSourceModal(element) {
    const channelName = element.querySelector('td:nth-child(2) .table-text-overflow').textContent.trim();
    const ownerName = element.querySelector('td:nth-child(3) .table-text-overflow').textContent.trim();
    const typeName = element.querySelector('td:nth-child(4) .table-text-overflow').textContent.trim();
    const sourceName = element.querySelector('td:nth-child(5) .table-text-overflow').textContent.trim();
    const embeddedString = element.querySelector('td:nth-child(10) .table-text-overflow').textContent.trim();
    const description = element.querySelector('td:nth-child(11) .table-text-overflow').textContent.trim();

    document.querySelector('input[name="channelName"]').value = channelName;
    document.querySelector('input[name="ownerName"]').value = ownerName;
    document.querySelector('input[name="typeName"]').value = typeName;
    document.querySelector('input[name="sourceName"]').value = sourceName;
    document.querySelector('input[name="embeddedString"]').value = embeddedString;
    document.querySelector('textarea[name="desc"]').value = description;

    document.querySelector('.viewSource').click();
}