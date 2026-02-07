let activeTab = null;
const localStoragePrefix = 'editorTab_';
const tabsStateKey = 'editorTabsState';
const editorTabs = document.getElementById('editor-tabs');
let usedTabNumbers = new Set();
const MAX_TABS = 5;

export function getActiveTab() {
	return activeTab;
}

export function getLocalStoragePrefix() {
	return localStoragePrefix;
}

export function cleanupOrphanedTabs() {
	const state = JSON.parse(localStorage.getItem(tabsStateKey) || '{"tabs":[]}');
	const validTabIds = new Set(state.tabs.map(tab => tab.id));

	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key && key.startsWith(localStoragePrefix)) {
			const tabId = key.replace(localStoragePrefix, '');
			if (!validTabIds.has(tabId)) {
				localStorage.removeItem(key);
			}
		}
	}
}

export function saveTabsState() {
	const tabs = Array.from(document.querySelectorAll('.tab')).map(tab => {
		const tabId = tab.getAttribute('data-tab-id');
		return {
			id: tabId,
			name: tab.querySelector('.tab-name').textContent
		};
	});

	const state = { tabs, activeTab };
	localStorage.setItem(tabsStateKey, JSON.stringify(state));
}

function validateTabName(newName, currentTabId) {
	newName = newName.trim();

	if (newName === '') {
		const tabNumber = currentTabId.split('_')[1];
		return `Tab ${tabNumber}`;
	}

	const existingTabs = document.querySelectorAll('.tab .tab-name');
	const isDuplicate = Array.from(existingTabs)
		.some(tab =>
			tab.textContent.trim() === newName &&
			tab.closest('.tab').getAttribute('data-tab-id') !== currentTabId
		);

	if (isDuplicate) {
		const tabNumber = currentTabId.split('_')[1];
		return `Tab ${tabNumber}`;
	}

	return newName;
}

export function updateAddTabButton() {
	const addTabButton = document.getElementById('add-tab');
	const currentTabCount = document.querySelectorAll('.tab').length;
	addTabButton.disabled = currentTabCount >= MAX_TABS;
}

export async function createNewTab(editor, name = null, tabId = null, content = null) {
	const currentTabCount = document.querySelectorAll('.tab').length;
	if (currentTabCount >= MAX_TABS) {
		await showAlert('Maximum number of tabs (5) has been reached. Close a tab to create a new one.', 'Tab Limit Reached');
		return;
	}

	if (!tabId) {
		let tabNumber = 1;
		while (usedTabNumbers.has(tabNumber)) {
			tabNumber++;
		}
		tabId = `tab_${tabNumber}`;
		usedTabNumbers.add(tabNumber);
	} else {
		const tabNumber = parseInt(tabId.split('_')[1], 10);
		usedTabNumbers.add(tabNumber);
	}

	if (document.querySelector(`[data-tab-id="${tabId}"]`)) {
		return;
	}

	const defaultName = name || `Tab ${tabId.split('_')[1]}`;
	const defaultContent = '';

	const newTab = document.createElement('div');
	newTab.className = 'tab';
	newTab.setAttribute('data-tab-id', tabId);
	newTab.innerHTML = `
		<span class="tab-name" contenteditable="false">${defaultName}</span>
		<button class="close-tab">x</button>
	`;

	editorTabs.insertBefore(newTab, document.getElementById('add-tab'));

	if (content !== null) {
		localStorage.setItem(`${localStoragePrefix}${tabId}`, content);
	} else if (!localStorage.getItem(`${localStoragePrefix}${tabId}`)) {
		localStorage.setItem(`${localStoragePrefix}${tabId}`, defaultContent);
	}

	switchToTab(tabId, editor);
	saveTabsState();
	updateAddTabButton();
}

export function switchToTab(tabId, editor) {
	if (activeTab && document.querySelector(`[data-tab-id="${activeTab}"]`)) {
		const currentContent = document.getElementById('editor').innerHTML;
		localStorage.setItem(`${localStoragePrefix}${activeTab}`, currentContent);
	}

	let tabContent = localStorage.getItem(`${localStoragePrefix}${tabId}`);
	if (tabContent) {
		tabContent = tabContent.replace(/<br>/g, '');
	}
	editor.setData(tabContent || '');

	activeTab = tabId;

	document.querySelectorAll('.tab').forEach(tab => {
		tab.classList.remove('active-tab');
	});

	const activeTabElement = document.querySelector(`[data-tab-id="${tabId}"]`);
	if (activeTabElement) {
		activeTabElement.classList.add('active-tab');
	}

	saveTabsState();
}

export async function closeTab(tabId, editor) {
	const tabElement = document.querySelector(`[data-tab-id="${tabId}"]`);
	if (!tabElement) return;

	const remainingTabs = document.querySelectorAll('.tab');
	if (remainingTabs.length <= 1) {
		await showAlert('At least one tab must remain.', 'Cannot Close Tab');
		return;
	}

	const confirmed = await showConfirm('Are you sure you want to close this tab?', 'Close Tab');
	if (!confirmed) return;

	localStorage.removeItem(`${localStoragePrefix}${tabId}`);

	const state = JSON.parse(localStorage.getItem(tabsStateKey) || '{"tabs":[]}');
	state.tabs = state.tabs.filter(tab => tab.id !== tabId);
	if (state.activeTab === tabId) {
		state.activeTab = null;
	}
	localStorage.setItem(tabsStateKey, JSON.stringify(state));

	const tabNumber = parseInt(tabId.split('_')[1], 10);
	usedTabNumbers.delete(tabNumber);
	tabElement.remove();

	if (activeTab === tabId) {
		const nextTab = document.querySelector('.tab');
		if (nextTab) {
			const nextTabId = nextTab.getAttribute('data-tab-id');
			activeTab = null;
			switchToTab(nextTabId, editor);
		} else {
			activeTab = null;
			editor.setData('');
		}
	}

	updateAddTabButton();
}

export function restoreTabs(editor) {
	Array.from(document.querySelectorAll('.tab')).forEach(tab => tab.remove());
	usedTabNumbers.clear();

	const savedState = localStorage.getItem(tabsStateKey);
	if (savedState) {
		const { tabs, activeTab: savedActiveTab } = JSON.parse(savedState);

		tabs.forEach(tab => {
			createNewTab(editor, tab.name, tab.id);
		});

		if (savedActiveTab && document.querySelector(`[data-tab-id="${savedActiveTab}"]`)) {
			switchToTab(savedActiveTab, editor);
		} else if (tabs.length > 0) {
			switchToTab(tabs[0].id, editor);
		}
	} else {
		createNewTab(editor);
	}
}

export function setupTabEventListeners(editor) {
	document.getElementById('add-tab').addEventListener('click', () => createNewTab(editor));

	editorTabs.addEventListener('click', event => {
		const tab = event.target.closest('.tab');
		if (tab) {
			const tabId = tab.getAttribute('data-tab-id');
			const tabNameElement = tab.querySelector('.tab-name');

			if (event.target.classList.contains('close-tab')) {
				closeTab(tabId, editor);
				return;
			}

			if (event.target === tabNameElement) {
				if (event.detail === 2) {
					tabNameElement.contentEditable = 'true';
					tabNameElement.focus();
					tabNameElement.setAttribute('data-original-name', tabNameElement.textContent.trim());

					const range = document.createRange();
					range.selectNodeContents(tabNameElement);
					const selection = window.getSelection();
					selection.removeAllRanges();
					selection.addRange(range);
				} else {
					switchToTab(tabId, editor);
				}
			} else {
				switchToTab(tabId, editor);
			}
		}
	});

	editorTabs.addEventListener('blur', event => {
		if (event.target.classList.contains('tab-name') && event.target.isContentEditable) {
			const tab = event.target.closest('.tab');
			const tabId = tab.getAttribute('data-tab-id');
			const newName = validateTabName(event.target.textContent, tabId);
			event.target.textContent = newName;
			event.target.contentEditable = 'false';
			saveTabsState();
		}
	}, true);

	editorTabs.addEventListener('keydown', event => {
		if (event.target.classList.contains('tab-name') && event.target.isContentEditable) {
			if (event.key === 'Enter') {
				event.preventDefault();
				event.target.blur();
			} else if (event.key === 'Escape') {
				const originalName = event.target.getAttribute('data-original-name') || event.target.textContent.trim();
				event.target.textContent = originalName;
				event.target.contentEditable = 'false';
			}
		}
	});

	window.addEventListener('beforeunload', () => {
		if (activeTab) {
			const currentContent = document.getElementById('editor').innerHTML;
			localStorage.setItem(`${localStoragePrefix}${activeTab}`, currentContent);
			saveTabsState();
		}
	});
}
