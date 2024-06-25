document.getElementById('addItemBtn').addEventListener('click', addItem);
document.getElementById('calculateBtn').addEventListener('click', calculateEstimates);
document.getElementById('sendWhatsappBtn').addEventListener('click', sendToWhatsapp);

let wishlist = [];

function addItem() {
    const name = document.getElementById('nameInput').value;
    const price = parseFloat(document.getElementById('priceInput').value);
    const link = document.getElementById('linkInput').value;
    const category = document.getElementById('categoryInput').value;

    if (name && !isNaN(price) && price > 0 && link && category) {
        const item = {
            name: name,
            price: price,
            link: link,
            category: category,
            quantity: 1
        };
        wishlist.push(item);
        renderWishlist();
        clearInputs();
    }
}

function renderWishlist() {
    const tableBody = document.getElementById('wishlistTable');
    tableBody.innerHTML = '';
    let totalPrice = 0;

    wishlist.forEach((item, index) => {
        const row = `
            <tr>
                <td>${item.name}</td>
                <td>Rp${item.price.toLocaleString()}</td>
                <td><a href="${item.link}" target="_blank">Link</a></td>
                <td>${item.category}</td>
                <td>
                    <button class="btn btn-secondary" onclick="changeQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn btn-secondary" onclick="changeQuantity(${index}, 1)">+</button>
                </td>
                <td><button class="btn btn-danger" onclick="removeItem(${index})">Hapus</button></td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
        totalPrice += item.price * item.quantity;
    });

    document.getElementById('totalPrice').innerText = totalPrice.toLocaleString();
}

function clearInputs() {
    document.getElementById('nameInput').value = '';
    document.getElementById('priceInput').value = '';
    document.getElementById('linkInput').value = '';
    document.getElementById('categoryInput').value = 'Primer';
}

function changeQuantity(index, amount) {
    if (wishlist[index].quantity + amount > 0) {
        wishlist[index].quantity += amount;
        renderWishlist();
    }
}

function removeItem(index) {
    wishlist.splice(index, 1);
    renderWishlist();
}

function calculateEstimates() {
    const dailySaving = parseFloat(document.getElementById('dailySavingInput').value);
    if (isNaN(dailySaving) || dailySaving <= 0) {
        alert('Masukkan nominal tabungan yang valid.');
        return;
    }

    const estimateList = document.getElementById('estimateList');
    estimateList.innerHTML = '';
    wishlist.forEach(item => {
        const totalCost = item.price * item.quantity;
        const daysNeeded = Math.ceil(totalCost / dailySaving);
        const estimateItem = `
            <li class="list-group-item">
                Anda dapat membeli ${item.name} dalam ${daysNeeded} hari dengan menabung Rp${dailySaving.toLocaleString()} per hari.
            </li>
        `;
        estimateList.insertAdjacentHTML('beforeend', estimateItem);
    });
}

function sendToWhatsapp() {
    const whatsappNumber = document.getElementById('whatsappInput').value;
    if (!whatsappNumber) {
        alert('Masukkan nomor WhatsApp yang valid.');
        return;
    }

    let message = 'Wishlist Barang Saya:\n\n';
    wishlist.forEach(item => {
        message += `Nama Barang: ${item.name}\nHarga: Rp${item.price.toLocaleString()}\nLink: ${item.link}\nKategori: ${item.category}\nJumlah: ${item.quantity}\n\n`;
    });

    const totalPrice = document.getElementById('totalPrice').innerText;
    message += `Total Harga: Rp${totalPrice}\n\n`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}
