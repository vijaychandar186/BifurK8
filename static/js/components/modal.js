const ModalComponent = {
    overlay: null,

    init() {
        if (this.overlay) return;


        this.overlay = document.createElement('div');
        this.overlay.id = 'custom-modal-overlay';
        this.overlay.className = 'fixed inset-0 bg-background/80 backdrop-blur-sm z-[9999] flex items-center justify-center opacity-0 invisible transition-all duration-300';
        this.overlay.innerHTML = `
            <div id="custom-modal" class="bg-background border border-border rounded-lg shadow-2xl max-w-md w-full mx-4 transform scale-95 transition-all duration-300">
                <div class="p-6">
                    <h3 id="modal-title" class="text-lg font-semibold text-foreground mb-3"></h3>
                    <p id="modal-message" class="text-sm text-muted-foreground mb-6"></p>
                    <div id="modal-buttons" class="flex gap-3 justify-end"></div>
                </div>
            </div>
        `;
        document.body.appendChild(this.overlay);

        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('opacity-100')) {
                this.close(false);
            }
        });
    },

    show() {
        this.overlay.classList.remove('invisible');
        setTimeout(() => {
            this.overlay.classList.add('opacity-100');
            this.overlay.querySelector('#custom-modal').classList.add('scale-100');
            this.overlay.querySelector('#custom-modal').classList.remove('scale-95');
        }, 10);
    },

    hide() {
        this.overlay.classList.remove('opacity-100');
        this.overlay.querySelector('#custom-modal').classList.add('scale-95');
        this.overlay.querySelector('#custom-modal').classList.remove('scale-100');
        setTimeout(() => {
            this.overlay.classList.add('invisible');
        }, 300);
    },

    close(result) {
        this.hide();
        if (this.resolveCallback) {
            this.resolveCallback(result);
            this.resolveCallback = null;
        }
    },

    alert(message, title = 'Alert') {
        return new Promise((resolve) => {
            this.init();
            this.resolveCallback = resolve;

            document.getElementById('modal-title').textContent = title;
            document.getElementById('modal-message').textContent = message;

            const buttonsContainer = document.getElementById('modal-buttons');
            buttonsContainer.innerHTML = `
                <button id="modal-ok" class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    OK
                </button>
            `;

            this.show();

            const okButton = document.getElementById('modal-ok');
            okButton.focus();
            okButton.addEventListener('click', () => this.close(true));
        });
    },

    confirm(message, title = 'Confirm') {
        return new Promise((resolve) => {
            this.init();
            this.resolveCallback = resolve;

            document.getElementById('modal-title').textContent = title;
            document.getElementById('modal-message').textContent = message;

            const buttonsContainer = document.getElementById('modal-buttons');
            buttonsContainer.innerHTML = `
                <button id="modal-cancel" class="px-4 py-2 text-sm font-medium bg-muted text-foreground rounded-md hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-border">
                    Cancel
                </button>
                <button id="modal-confirm" class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    Confirm
                </button>
            `;

            this.show();

            const confirmButton = document.getElementById('modal-confirm');
            const cancelButton = document.getElementById('modal-cancel');

            confirmButton.focus();
            confirmButton.addEventListener('click', () => this.close(true));
            cancelButton.addEventListener('click', () => this.close(false));
        });
    }
};

window.showAlert = (message, title) => ModalComponent.alert(message, title);
window.showConfirm = (message, title) => ModalComponent.confirm(message, title);