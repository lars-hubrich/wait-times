const rideIds = [6819, 6825, 5820, 6828, 6830, 6814, 11815, 6812, 6807, 6806, 6808, 6805, 8236];
const STORAGE_KEY = 'wartezeiten-data';

const $ = selector => document.querySelector(selector);
const setOffline = offline => $('#status').classList.toggle('hidden', !offline);

function renderRides(data) {
  const rides = [
    ...data.rides,
    ...data.lands.flatMap(land => land.rides)
  ]
    .filter(r => rideIds.includes(r.id))
    .sort((a, b) => a.is_open === b.is_open 
      ? b.wait_time - a.wait_time 
      : a.is_open ? -1 : 1);

  const container = $('#rides');
  container.innerHTML = '';

  if (rides.length === 0) {
    container.innerHTML = '<p class="col-span-full text-center text-gray-500">Keine Fahrten gefunden.</p>';
    return;
  }

  rides.forEach(r => {
    const card = document.createElement('article');
    card.className = `
      p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm 
      flex justify-between items-center transition hover:shadow-md
      ${r.is_open ? '' : 'opacity-50'}
    `;
    card.innerHTML = `
      <span class="font-medium">${r.name}</span>
      <span class="text-lg font-semibold">
        ${r.is_open ? r.wait_time + ' min' : 'geschlossen'}
      </span>
    `;
    container.append(card);
  });
}

async function fetchData() {
  const url = `https://api.allorigins.win/raw?url=${encodeURIComponent('https://queue-times.com/parks/56/queue_times.json')}?t=${Date.now()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Netzwerkfehler');
  return res.json();
}

async function update() {
  const offline = !navigator.onLine;
  setOffline(offline);

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const { data, timestamp } = JSON.parse(stored);
    renderRides(data);
    $('#last-update').textContent = new Date(timestamp).toLocaleTimeString('de-DE');
  }

  if (offline) return;

  try {
    const fresh = await fetchData();
    const now = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: fresh, timestamp: now }));
    renderRides(fresh);
    $('#last-update').textContent = new Date(now).toLocaleTimeString('de-DE');
  } catch {
    setOffline(true);
  }
}

$('#refresh-btn').addEventListener('click', update);
window.addEventListener('online', update);
window.addEventListener('offline', () => setOffline(true));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js', { scope: '.' });
  });
}

update();
setInterval(update, 15_000);
