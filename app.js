/* NO PLACEHOLDERS - CORE LOGIC */
const DEFAULTS = {
    architecture: ['Forest', 'Swamp', 'Ruins', 'Temple', 'Cave', 'Void', 'Celestial', 'Cyber-Grid'],
    vibe: ['Overgrown', 'Cosmic', 'Misty', 'Neon', 'Dark'],
    origin: ['Modern', 'Fantasy', 'Sci-Fi', 'Cultivation', 'Glitch'],
    role: ['Host', 'Major NPC', 'Villain', 'Companion'],
    drive: ['DRV:REVENGE', 'DRV:LOYALTY', 'DRV:SURVIVAL', 'DRV:KNOWLEDGE'],
    trauma: ['TRM:EXILE', 'TRM:BETRAYAL', 'TRM:LOSS'],
    power: ['Meritocracy', 'Sect', 'Dynasty', 'Corporation', 'Anarchy']
};

document.addEventListener('DOMContentLoaded', () => {
    initLoom();
    setupNavigation();
    setupPersistence();
});

function initLoom() {
    // Populate Datalists
    Object.keys(DEFAULTS).forEach(key => {
        const stored = JSON.parse(localStorage.getItem(`loom_list_${key}`)) || [];
        const combined = [...new Set([...DEFAULTS[key], ...stored])];
        const dl = document.querySelector(`datalist[id*="${key}"]`) || 
                   document.querySelector(`#dl-${key}`) || (function(){
                       // Fallback to match UI logic
                       if(key === 'architecture') return document.getElementById('dl-architecture');
                       if(key === 'vibe') return document.getElementById('dl-env-vibe');
                       if(key === 'origin') return document.getElementById('dl-origin');
                       if(key === 'role') return document.getElementById('dl-role');
                       if(key === 'drive') return document.getElementById('dl-drive');
                       if(key === 'trauma') return document.getElementById('dl-trauma');
                       if(key === 'power') return document.getElementById('dl-power');
                   })();

        if (dl) {
            dl.innerHTML = combined.map(v => `<option value="${v}">`).join('');
        }
    });

    // Load Drafts
    ['world-root', 'life-seed', 'soul-weaver', 'world-pulse'].forEach(id => {
        const draft = JSON.parse(localStorage.getItem(`draft_${id}`));
        if (draft) {
            Object.keys(draft).forEach(key => {
                const el = document.getElementById(key);
                if (el) el.value = draft[key];
            });
        }
    });
}

function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.nav-btn, .form-mode').forEach(el => el.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.target).classList.add('active');
            window.scrollTo(0,0);
        };
    });
}

function setupPersistence() {
    // Auto Save
    document.querySelectorAll('input, textarea').forEach(el => {
        el.oninput = () => {
            const section = el.closest('section').id;
            const inputs = document.getElementById(section).querySelectorAll('input, textarea');
            const data = {};
            inputs.forEach(i => data[i.id] = i.value);
            localStorage.setItem(`draft_${section}`, JSON.stringify(data));
        };
    });

    // Knit (Save File)
    document.getElementById('knit-btn').onclick = () => {
        const activeSection = document.querySelector('.form-mode.active');
        const id = activeSection.id;
        const inputs = activeSection.querySelectorAll('input, textarea');
        const data = { timestamp: new Date().toISOString() };
        
        inputs.forEach(i => {
            data[i.id] = i.value;
            // Update dynamic lists if it's a datalist input
            if (i.list) {
                const listKey = i.id.split('-').pop(); // e.g. root-arch -> arch
                const keyMap = {'arch':'architecture', 'vibe':'vibe', 'origin':'origin', 'role':'role', 'drive':'drive', 'trauma':'trauma', 'power':'power'};
                const realKey = keyMap[listKey] || listKey;
                if (DEFAULTS[realKey] && i.value && !DEFAULTS[realKey].includes(i.value)) {
                    const stored = JSON.parse(localStorage.getItem(`loom_list_${realKey}`)) || [];
                    if (!stored.includes(i.value)) {
                        stored.push(i.value);
                        localStorage.setItem(`loom_list_${realKey}`, JSON.stringify(stored));
                    }
                }
            }
        });

        const filename = `${id.replace('-', '_')}_${(data[Object.keys(data)[1]] || 'unnamed').replace(/\W/g, '_')}.json`;
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename; a.click();
        initLoom(); // Refresh lists
    };

    // Clear
    document.getElementById('clear-btn').onclick = () => {
        if (confirm('Burn the loom? This draft will vanish into the void.')) {
            const activeSection = document.querySelector('.form-mode.active');
            activeSection.querySelectorAll('input, textarea').forEach(i => i.value = (i.type === 'number' ? 10 : ''));
            localStorage.removeItem(`draft_${activeSection.id}`);
        }
    };
}
