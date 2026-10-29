(() => {
  const container = document.getElementById('petMap');
  const status = document.getElementById('petMapStatus');
  const count = document.getElementById('petMapCount');
  const list = document.getElementById('petMapList');
  const locateButton = document.getElementById('petMapLocate');
  const refreshButton = document.getElementById('petMapRefresh');
  const searchInput = document.getElementById('petMapSearch');
  const showAllButton = document.getElementById('petMapShowAll');
  const searchAreaButton = document.getElementById('petMapSearchArea');
  const filterButtons = [...document.querySelectorAll('[data-map-filter]')];
  if (!container || !window.maplibregl) {
    if (status) status.textContent = 'The map could not load. Check your internet connection and refresh.';
    return;
  }

  const home = [-79.5199, 8.9824];
  let activeCenter = [home[1], home[0]];
  let activeFilter = 'all';
  let allPlaces = [];
  let pins = [];
  let requestSequence = 0;
  const map = new maplibregl.Map({
    container,
    style: 'https://tiles.openfreemap.org/styles/bright',
    center: home,
    zoom: 12,
    pitch: 0,
    attributionControl: true
  });
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const setStatus = (message, visible = true) => {
    if (!status) return;
    status.textContent = message;
    status.hidden = !visible;
  };
  const getPlaceType = tags => {
    if (tags.amenity === 'veterinary' || tags.healthcare === 'veterinary' || tags.healthcare === 'vet') return 'Veterinary clinic';
    return 'Pet shop';
  };
  const distanceKm = (lat, lon, origin = activeCenter) => {
    const radians = value => value * Math.PI / 180;
    const [originLat, originLon] = origin;
    const latDelta = radians(lat - originLat);
    const lonDelta = radians(lon - originLon);
    const arc = Math.sin(latDelta / 2) ** 2 + Math.cos(radians(originLat)) * Math.cos(radians(lat)) * Math.sin(lonDelta / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc));
  };
  const distanceLabel = km => km < 1 ? (Math.max(50, Math.round(km * 1000 / 50) * 50) + ' m away') : (km.toFixed(1) + ' km away');
  const makePaw = type => {
    const element = document.createElement('button');
    element.type = 'button';
    element.className = `pet-paw-pin ${type === 'Veterinary clinic' ? 'is-veterinary' : 'is-shop'}`;
    element.setAttribute('aria-label', `Show ${type.toLowerCase()} location`);
    element.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="9" cy="15" rx="4.5" ry="6"/><ellipse cx="19" cy="9" rx="4.5" ry="6"/><ellipse cx="30" cy="9" rx="4.5" ry="6"/><ellipse cx="40" cy="15" rx="4.5" ry="6"/><path d="M24 19c-5 0-8 4-10 9-2 4-2 8 1 10 2 2 5 1 8-1 1-1 3-1 4 0 3 2 6 3 8 1 3-2 3-6 1-10-2-5-5-9-10-9z"/></svg>';
    return element;
  };
  const clearPlaces = () => {
    pins.forEach(entry => entry.marker.remove());
    pins = [];
    allPlaces = [];
    list?.replaceChildren();
  };

  function applyFilters() {
    const term = (searchInput?.value || '').trim().toLowerCase();
    let visible = 0;
    pins.forEach(({ marker, place, item }) => {
      const categoryTypes = { vets: 'Veterinary clinic', shops: 'Pet shop' };
      const categoryMatches = activeFilter === 'all' || place.type === categoryTypes[activeFilter];
      const textMatches = !term || (place.name + ' ' + place.address + ' ' + place.type).toLowerCase().includes(term);
      const show = categoryMatches && textMatches;
      item.hidden = !show;
      marker.getElement().hidden = !show;
      if (show) visible++;
    });
    if (count) count.textContent = `${visible} shown`;
    if (allPlaces.length && visible === 0) setStatus('No places match those filters. Try another search.');
    else if (visible) setStatus('', false);
    else if (!allPlaces.length) setStatus('No mapped pet shops or veterinary clinics found nearby. Try another location.');
  }

  async function loadPlaces(lat, lon) {
    const sequence = ++requestSequence;
    clearPlaces();
    if (searchAreaButton) searchAreaButton.hidden = true;
    if (count) count.textContent = 'Loading...';
    if (refreshButton) refreshButton.disabled = true;
    setStatus('Finding nearby shops and veterinary clinics...');
    const query = `[out:json][timeout:25];(
      nwr["shop"="pet"](around:9000,${lat},${lon});
      nwr["amenity"="veterinary"](around:9000,${lat},${lon});
      nwr["healthcare"~"^(vet|veterinary)$"](around:9000,${lat},${lon});
    );out center tags;`;
    const endpoints = ['https://overpass-api.de/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];
    let data = null;
    let lastError = null;
    for (const endpoint of endpoints) {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), endpoint.includes('overpass-api.de') ? 27000 : 20000);
      try {
        const response = await fetch(`${endpoint}?data=${encodeURIComponent(query)}`, { signal: controller.signal, mode: 'cors' });
        if (!response.ok) throw new Error(`Location request failed (${response.status})`);
        const payload = await response.json();
        if (payload.remark) throw new Error(payload.remark);
        data = payload;
        break;
      } catch (error) {
        lastError = error;
      } finally {
        window.clearTimeout(timeout);
      }
    }
    if (sequence !== requestSequence) return;
    if (!data) {
      if (count) count.textContent = 'Unavailable';
      setStatus('Live place data is unavailable right now. Tap Refresh places to try again.');
      if (refreshButton) refreshButton.disabled = false;
      return;
    }

    const seen = new Set();
    allPlaces = (data.elements || []).map(element => {
      const tags = element.tags || {};
      const point = element.center || element;
      const key = `${element.type}/${element.id}`;
      if (seen.has(key) || typeof point.lat !== 'number' || typeof point.lon !== 'number') return null;
      seen.add(key);
      return {
        lat: point.lat,
        lon: point.lon,
        name: tags.name || getPlaceType(tags),
        type: getPlaceType(tags),
        address: [tags['addr:street'], tags['addr:housenumber'], tags['addr:city']].filter(Boolean).join(' '), distanceKm: distanceKm(point.lat, point.lon),
        phone: tags.phone || tags['contact:phone'] || '',
        website: tags.website || tags['contact:website'] || ''
      };
    }).filter(Boolean).sort((a, b) => a.distanceKm - b.distanceKm);

    allPlaces.forEach((place, index) => {
      const pin = makePaw(place.type);
      pin.setAttribute('aria-label', 'Show ' + place.name + ', ' + place.type);
      const directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=' + place.lat + ',' + place.lon;
      const directions = '<a href="' + directionsUrl + '" target="_blank" rel="noopener noreferrer">Get directions</a>';
      const phone = place.phone ? '<a href="tel:' + escapeHtml(place.phone.replace(/[^\d+]/g, '')) + '">Call ' + escapeHtml(place.phone) + '</a>' : '';
      const website = place.website ? '<a href="' + escapeHtml(place.website) + '" target="_blank" rel="noopener noreferrer">Visit website</a>' : '';
      const popupHtml = '<div class="pet-map-popup"><span>' + escapeHtml(place.type) + '</span><strong>' + escapeHtml(place.name) + '</strong>' +
        (place.address ? '<small>' + escapeHtml(place.address) + '</small>' : '') + phone + website + directions +
        '<a href="https://www.openstreetmap.org/?mlat=' + place.lat + '&mlon=' + place.lon + '#map=17/' + place.lat + '/' + place.lon + '" target="_blank" rel="noopener noreferrer">Open in OpenStreetMap</a></div>';
      const popup = new maplibregl.Popup({ offset: 30, maxWidth: '260px' }).setHTML(popupHtml);
      const marker = new maplibregl.Marker({ element: pin, anchor: 'bottom' }).setLngLat([place.lon, place.lat]).setPopup(popup).addTo(map);
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'pet-map-result';
      button.innerHTML = `<span class="pet-map-result-number">${String(index + 1).padStart(2, '0')}</span><span class="pet-map-result-copy"><strong>${escapeHtml(place.name)}</strong><small class="pet-map-result-type">${escapeHtml(place.type)}</small>${place.address ? `<small>${escapeHtml(place.address)}</small>` : ''}</span><span class="pet-map-result-arrow" aria-hidden="true">&gt;</span>`;
      const distance = document.createElement('small');
      distance.className = 'pet-map-result-distance';
      distance.textContent = distanceLabel(place.distanceKm);
      button.querySelector('.pet-map-result-copy').append(distance);
      button.addEventListener('click', () => {
        map.flyTo({ center: [place.lon, place.lat], zoom: 16, duration: 650 });
        marker.togglePopup();
      });
      item.append(button);
      list.append(item);
      pins.push({ marker, place, item });
    });

    if (pins.length > 1) {
      const bounds = new maplibregl.LngLatBounds();
      allPlaces.forEach(place => bounds.extend([place.lon, place.lat]));
      map.fitBounds(bounds, { padding: 70, maxZoom: 14, duration: 450 });
    }
    if (refreshButton) refreshButton.disabled = false;
    applyFilters();
  }

  searchInput?.addEventListener('input', applyFilters);
  filterButtons.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.mapFilter;
    filterButtons.forEach(filter => {
      const selected = filter === button;
      filter.classList.toggle('is-active', selected);
      filter.setAttribute('aria-pressed', String(selected));
    });
    applyFilters();
  }));
  showAllButton?.addEventListener('click', () => {
    const visible = pins.filter(({ item }) => !item.hidden).map(({ place }) => place);
    if (visible.length > 1) {
      const bounds = new maplibregl.LngLatBounds();
      visible.forEach(place => bounds.extend([place.lon, place.lat]));
      map.fitBounds(bounds, { padding: 70, maxZoom: 14, duration: 500 });
    } else if (visible.length === 1) {
      map.flyTo({ center: home, zoom: 12, duration: 500 });
    }
  });
  refreshButton?.addEventListener('click', () => loadPlaces(activeCenter[0], activeCenter[1]));
  searchAreaButton?.addEventListener('click', () => {
    const center = map.getCenter();
    activeCenter = [center.lat, center.lng];
    loadPlaces(center.lat, center.lng);
  });
  const revealSearchArea = event => {
    if (event.originalEvent && searchAreaButton) searchAreaButton.hidden = false;
  };
  map.on('dragend', revealSearchArea);
  map.on('zoomend', revealSearchArea);
  map.on('load', () => {
    map.resize();
    loadPlaces(home[1], home[0]);
  });
  map.on('error', () => {
    if (!map.isStyleLoaded()) setStatus('The map style could not load. Check your connection and refresh.');
  });
  if ('ResizeObserver' in window) new ResizeObserver(() => map.resize()).observe(container);
  window.addEventListener('resize', () => map.resize(), { passive: true });

  locateButton?.addEventListener('click', () => {
    if (!navigator.geolocation) {
      setStatus('Location is not available in this browser.');
      return;
    }
    locateButton.disabled = true;
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      activeCenter = [latitude, longitude];
      if (searchAreaButton) searchAreaButton.hidden = true;
      map.flyTo({ center: [longitude, latitude], zoom: 13, duration: 700 });
      loadPlaces(latitude, longitude);
      locateButton.disabled = false;
    }, () => {
      setStatus('Location permission was not granted. Panama City is still available on the map.');
      locateButton.disabled = false;
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
  });
})();
