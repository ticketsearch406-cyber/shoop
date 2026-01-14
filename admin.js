const API_BASE = 'https://fastapi-g1si.onrender.com/api';
let products = [];

// Элементы управления
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');

// Запуск при загрузке
async function initAdmin() {
    await loadStats();
    await loadProducts();
    await loadOrders();
    await loadUsers();
}

// Кнопка выхода (на сайт)
document.getElementById('logoutBtn').addEventListener('click', () => {
    if(confirm('Выйти из админ-панели?')) {
        window.location.href = 'index.html'; // Путь к главной
    }
});

// Открытие модалки для добавления
document.getElementById('addProductBtn').onclick = () => {
    productForm.reset();
    document.getElementById('productId').value = '';
    document.getElementById('modalTitle').innerText = 'Добавить деталь';
    productModal.style.display = 'block';
};

// Закрытие модалки
document.getElementById('closeModal').onclick = () => {
    productModal.style.display = 'none';
};

// Сохранение товара
productForm.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('productId').value;
    const data = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        // stock удален отсюда
        image: document.getElementById('productImage').value,
        featured: false
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE}/admin/products/${id}` : `${API_BASE}/admin/products`;

    const res = await fetch(url, {
        method: method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if (res.ok) {
        productModal.style.display = 'none';
        initAdmin();
    }
};

async function loadStats() {
    const res = await fetch(`${API_BASE}/admin/stats`);
    const data = await res.json();
    document.getElementById('totalProducts').innerText = data.products;
    document.getElementById('newOrders').innerText = data.orders;
    document.getElementById('totalUsers').innerText = data.users;
    document.getElementById('monthRevenue').innerText = data.revenue + ' руб.';
}

async function loadProducts() {
    const res = await fetch(`${API_BASE}/products`);
    products = await res.json();
    document.getElementById('productsTable').innerHTML = products.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${p.price} руб.</td>
            <td>
                <button class="btn-edit" onclick="editProduct(${p.id})">Изменить</button>
                <button class="btn-delete" onclick="deleteProduct(${p.id})">Удалить</button>
            </td>
        </tr>
    `).join('');
}

window.editProduct = (id) => {
    const p = products.find(x => x.id === id);
    document.getElementById('productId').value = p.id;
    document.getElementById('productName').value = p.name;
    document.getElementById('productCategory').value = p.category;
    document.getElementById('productPrice').value = p.price;
    // Назначение значения stock удалено
    document.getElementById('productDescription').value = p.description;
    document.getElementById('productImage').value = p.image;
    document.getElementById('modalTitle').innerText = 'Редактировать';
    productModal.style.display = 'block';
};

window.deleteProduct = async (id) => {
    if (confirm('Удалить?')) {
        await fetch(`${API_BASE}/admin/products/${id}`, {method: 'DELETE'});
        initAdmin();
    }
};

async function loadOrders() { 
    const res = await fetch(`${API_BASE}/admin/orders`);
    const orders = await res.json();
    const ordersTable = document.getElementById('ordersTable');
    if (ordersTable) {
        ordersTable.innerHTML = orders.map(o => `
            <tr>
                <td>${o.id}</td>
                <td>${o.customer}</td>
                <td>${o.date}</td>
                <td>${o.amount} руб.</td>
                <td>${o.status}</td>
            </tr>
        `).join('');
    }
}

async function loadUsers() {
    const res = await fetch(`${API_BASE}/admin/users`);
    const users = await res.json();
    const usersTable = document.getElementById('usersTable');
    if (usersTable) {
        usersTable.innerHTML = users.map(u => `
            <tr>
                <td>${u.id}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.orders}</td>
            </tr>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', initAdmin);