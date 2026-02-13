const API = 'http://localhost:5000/api/items';

async function loadItems() {
    const res = await fetch(API);
    const items = await res.json();
    const list = document.getElementById('list');
    list.innerHTML = items.map(i => `<li>${i.text}</li>`).join('');
}

async function saveItem() {
    const input = document.getElementById('input');
    await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input.value })
    });
    input.value = '';
    loadItems();
}

loadItems();