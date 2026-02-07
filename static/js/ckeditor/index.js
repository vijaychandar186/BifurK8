import { DecoupledEditor } from './plugins.js';
import { getEditorConfig } from './config.js';
import { setupTabEventListeners, updateAddTabButton, cleanupOrphanedTabs, restoreTabs, getActiveTab, saveTabsState } from './tabs.js';
import { importRawFile } from './import.js';

DecoupledEditor.create(document.querySelector('#editor'), getEditorConfig()).then(editor => {
	window.editorInstance = editor;

	document.querySelector('#editor-toolbar').appendChild(editor.ui.view.toolbar.element);
	document.querySelector('#editor-menu-bar').appendChild(editor.ui.view.menuBarView.element);

	setupTabEventListeners(editor);

	editor.editing.view.document.on('clipboardInput', (evt, data) => {
		const plainText = data.dataTransfer.getData('text/plain')
			.replace(/\r\n/g, '\n')
			.replace(/\r/g, '\n');

		evt.stop();

		editor.model.change(writer => {
			const insertPosition = editor.model.document.selection.getFirstPosition();
			writer.insertText(plainText, insertPosition);
		});
	});

	updateAddTabButton();
	cleanupOrphanedTabs();
	restoreTabs(editor);

	window.importRawFile = importRawFile;

	return editor;
}).catch(error => {
	console.error(error);
});
