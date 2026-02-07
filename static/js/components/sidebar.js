function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("-translate-x-full");
    sidebar.classList.toggle("translate-x-0");
}

function toggleSection(sectionId) {
    const content = document.getElementById(`section-content-${sectionId}`);
    const chevron = document.getElementById(`chevron-${sectionId}`);

    if (content && chevron) {
        content.classList.toggle("hidden");
        chevron.classList.toggle("rotate-180");

        // Save collapsed state
        const config = window.SIDEBAR_CONFIG;
        const section = config.sections.find(s => s.id === sectionId);
        if (section) {
            section.collapsed = content.classList.contains("hidden");
        }
    }
}

function renderSidebarItem(item) {
    switch (item.type) {
        case "file-input":
            return `
                <div class="mb-3">
                    ${item.label ? `<label class="text-xs font-medium text-foreground block mb-2">${item.label}</label>` : ''}
                    <input
                        type="file"
                        id="${item.id}"
                        ${item.accept ? `accept="${item.accept}"` : ''}
                        class="w-full p-2.5 text-sm text-foreground bg-muted border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all box-border file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                    />
                </div>
            `;

        case "button":
            const variantClasses = {
                primary: "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold",
                secondary: "bg-muted text-foreground border border-border hover:bg-accent"
            };
            return `
                <button
                    ${item.id ? `id="${item.id}"` : ''}
                    ${item.onClick ? `onclick="${item.onClick}()"` : ''}
                    class="w-full p-2.5 text-sm rounded-md transition-all hover:shadow-md cursor-pointer border-none ${variantClasses[item.variant || 'secondary']} ${item.class || ''}"
                >
                    ${item.label}
                </button>
            `;

        case "checkbox":
            return `
                <div class="flex items-center gap-2 mb-3">
                    <input
                        type="checkbox"
                        id="${item.id}"
                        ${item.checked ? 'checked' : ''}
                        class="w-4 h-4 accent-primary cursor-pointer"
                    />
                    <label class="text-sm text-foreground cursor-pointer" for="${item.id}">${item.label}</label>
                </div>
            `;

        case "select":
            return `
                <div class="mb-3">
                    ${item.label ? `<label class="text-xs font-medium text-foreground block mb-2">${item.label}</label>` : ''}
                    <select
                        id="${item.id}"
                        class="w-full p-2.5 text-sm text-foreground bg-muted border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                    >
                        ${item.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
                    </select>
                </div>
            `;

        case "radio-group":
            return `
                <div class="space-y-2">
                    ${item.options.map(opt => `
                        <div class="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                            <input
                                type="radio"
                                id="${opt.id}"
                                name="${item.name}"
                                value="${opt.value}"
                                ${opt.checked ? 'checked' : ''}
                                class="w-4 h-4 accent-primary cursor-pointer"
                            />
                            <label for="${opt.id}" class="text-sm text-foreground cursor-pointer flex-1">${opt.label}</label>
                        </div>
                    `).join('')}
                </div>
            `;

        case "multi-select-search":
            return `
                <div class="mb-3">
                    ${item.label ? `<label class="text-xs font-medium text-foreground block mb-2">${item.label}</label>` : ''}
                    <div class="relative">
                        <input
                            type="text"
                            id="${item.id}-search"
                            placeholder="${item.placeholder || 'Search...'}"
                            class="w-full p-2 text-sm text-foreground bg-muted border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <div id="${item.id}-selected" class="flex flex-wrap gap-1 mt-2 min-h-[32px]"></div>
                        <div id="${item.id}-dropdown" class="hidden absolute z-50 w-full max-h-48 overflow-y-auto bg-background border border-border rounded-md shadow-lg mt-1">
                        </div>
                    </div>
                    <input type="hidden" id="${item.id}" />
                </div>
            `;

        default:
            return '';
    }
}

function renderSidebarSection(section) {
    const itemsHTML = section.items.map(item => renderSidebarItem(item)).join('');

    return `
        <div class="mb-4">
            <button
                onclick="toggleSection('${section.id}')"
                class="w-full flex items-center justify-between px-6 py-3 text-left hover:bg-muted/30 transition-colors group"
            >
                <div class="flex items-center gap-2">
                    <span class="text-primary">${section.icon}</span>
                    <span class="text-sm font-semibold text-foreground">${section.title}</span>
                </div>
                <svg
                    id="chevron-${section.id}"
                    class="w-4 h-4 text-foreground transition-transform duration-200 ${section.collapsed ? '' : 'rotate-180'}"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            <div
                id="section-content-${section.id}"
                class="px-6 py-3 space-y-2 ${section.collapsed ? 'hidden' : ''}"
            >
                ${itemsHTML}
            </div>
        </div>
    `;
}

function initializeSidebar() {
    const config = window.SIDEBAR_CONFIG;
    if (!config) {
        console.error("SIDEBAR_CONFIG not found");
        return;
    }

    const sidebarContent = document.getElementById("sidebar-content");
    if (!sidebarContent) {
        console.error("sidebar-content element not found");
        return;
    }

    // Render header
    const header = `<h2 class="text-xl text-foreground text-center font-bold mb-6 border-b-2 border-primary pb-4 mx-6">${config.title}</h2>`;

    // Render sections
    const sectionsHTML = config.sections.map((section, index) => {
        const separator = index < config.sections.length - 1
            ? '<hr class="border-none h-px bg-gradient-to-r from-transparent via-border to-transparent my-1 mx-6" />'
            : '';
        return renderSidebarSection(section) + separator;
    }).join('');

    sidebarContent.innerHTML = header + sectionsHTML;

    // Initialize multi-select language picker
    initializeLanguageMultiSelect();
}

function initializeLanguageMultiSelect() {
    if (typeof OCR_LANGUAGES === 'undefined') return;

    const searchInput = document.getElementById('ocr-languages-search');
    const dropdown = document.getElementById('ocr-languages-dropdown');
    const selectedContainer = document.getElementById('ocr-languages-selected');
    const hiddenInput = document.getElementById('ocr-languages');

    if (!searchInput || !dropdown || !selectedContainer || !hiddenInput) return;

    let selectedLanguages = ['eng']; // Default to English

    function updateHiddenInput() {
        hiddenInput.value = selectedLanguages.join('+');
    }

    function renderSelectedTags() {
        selectedContainer.innerHTML = selectedLanguages.map(langCode => {
            const lang = OCR_LANGUAGES.find(l => l.value === langCode);
            return `
                <span class="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded text-xs">
                    ${lang ? lang.name : langCode}
                    <button onclick="removeLanguage('${langCode}')" class="hover:bg-primary/80 rounded-full">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </span>
            `;
        }).join('');
        updateHiddenInput();
    }

    function renderDropdown(filter = '') {
        const filtered = OCR_LANGUAGES.filter(lang =>
            lang.name.toLowerCase().includes(filter.toLowerCase()) ||
            lang.value.toLowerCase().includes(filter.toLowerCase())
        );

        dropdown.innerHTML = filtered.map(lang => {
            const isSelected = selectedLanguages.includes(lang.value);
            return `
                <div class="flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer" data-lang="${lang.value}">
                    <input type="checkbox" ${isSelected ? 'checked' : ''} class="w-4 h-4 accent-primary pointer-events-none" />
                    <span class="text-sm text-foreground">${lang.name}</span>
                </div>
            `;
        }).join('');

        // Add click handlers
        dropdown.querySelectorAll('[data-lang]').forEach(item => {
            item.addEventListener('click', (e) => {
                const langCode = item.getAttribute('data-lang');
                if (selectedLanguages.includes(langCode)) {
                    selectedLanguages = selectedLanguages.filter(l => l !== langCode);
                } else {
                    selectedLanguages.push(langCode);
                }
                renderSelectedTags();
                renderDropdown(searchInput.value);
            });
        });
    }

    window.removeLanguage = function(langCode) {
        selectedLanguages = selectedLanguages.filter(l => l !== langCode);
        renderSelectedTags();
        renderDropdown(searchInput.value);
    };

    searchInput.addEventListener('focus', () => {
        dropdown.classList.remove('hidden');
        renderDropdown(searchInput.value);
    });

    searchInput.addEventListener('input', (e) => {
        renderDropdown(e.target.value);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });

    // Initial render
    renderSelectedTags();
    renderDropdown();
}

// Initialize sidebar when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSidebar);
} else {
    initializeSidebar();
}

window.toggleSidebar = toggleSidebar;
window.toggleSection = toggleSection;
