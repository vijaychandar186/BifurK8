import * as Plugins from './plugins.js';
import { getActiveTab, getLocalStoragePrefix } from './tabs.js';

export function getEditorConfig() {
	return {
		toolbar: {
			items: [
				'undo',
				'redo',
				'|',
				'fontSize',
				'fontFamily',
				'fontColor',
				'fontBackgroundColor',
				'|',
				'bold',
				'italic',
				'underline',
				'strikethrough',
				'subscript',
				'superscript',
				'|',
				'link',
				'insertImage',
				'insertTable',
				'highlight',
				'blockQuote',
				'|',
				'alignment',
				'|',
				'bulletedList',
				'numberedList',
				'todoList',
				'outdent',
				'indent'
			],
			shouldNotGroupWhenFull: false
		},
		plugins: [
			Plugins.AccessibilityHelp,
			Plugins.Alignment,
			Plugins.Autoformat,
			Plugins.AutoImage,
			Plugins.AutoLink,
			Plugins.Autosave,
			Plugins.BlockQuote,
			Plugins.BlockToolbar,
			Plugins.Bold,
			Plugins.Code,
			Plugins.Essentials,
			Plugins.FindAndReplace,
			Plugins.FontBackgroundColor,
			Plugins.FontColor,
			Plugins.FontFamily,
			Plugins.FontSize,
			Plugins.GeneralHtmlSupport,
			Plugins.Highlight,
			Plugins.HorizontalLine,
			Plugins.ImageBlock,
			Plugins.ImageCaption,
			Plugins.ImageInline,
			Plugins.ImageInsert,
			Plugins.ImageInsertViaUrl,
			Plugins.ImageResize,
			Plugins.ImageStyle,
			Plugins.ImageTextAlternative,
			Plugins.ImageToolbar,
			Plugins.ImageUpload,
			Plugins.Indent,
			Plugins.IndentBlock,
			Plugins.Italic,
			Plugins.Link,
			Plugins.LinkImage,
			Plugins.List,
			Plugins.ListProperties,
			Plugins.Markdown,
			Plugins.MediaEmbed,
			Plugins.Mention,
			Plugins.Minimap,
			Plugins.PageBreak,
			Plugins.Paragraph,
			Plugins.PasteFromMarkdownExperimental,
			Plugins.PasteFromOffice,
			Plugins.RemoveFormat,
			Plugins.SelectAll,
			Plugins.SimpleUploadAdapter,
			Plugins.SpecialCharacters,
			Plugins.SpecialCharactersArrows,
			Plugins.SpecialCharactersCurrency,
			Plugins.SpecialCharactersEssentials,
			Plugins.SpecialCharactersLatin,
			Plugins.SpecialCharactersMathematical,
			Plugins.SpecialCharactersText,
			Plugins.Strikethrough,
			Plugins.Subscript,
			Plugins.Superscript,
			Plugins.Table,
			Plugins.TableCaption,
			Plugins.TableCellProperties,
			Plugins.TableColumnResize,
			Plugins.TableProperties,
			Plugins.TableToolbar,
			Plugins.TextPartLanguage,
			Plugins.TextTransformation,
			Plugins.TodoList,
			Plugins.Underline,
			Plugins.Undo
		],
		blockToolbar: [
			'fontSize',
			'fontColor',
			'fontBackgroundColor',
			'|',
			'bold',
			'italic',
			'|',
			'link',
			'insertImage',
			'insertTable',
			'|',
			'bulletedList',
			'numberedList',
			'outdent',
			'indent'
		],
		fontFamily: {
			supportAllValues: true
		},
		fontSize: {
			options: [10, 12, 14, 'default', 18, 20, 22],
			supportAllValues: true
		},
		heading: {
			options: [
				{ model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
				{ model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
				{ model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
				{ model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
				{ model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
				{ model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
				{ model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
			]
		},
		htmlSupport: {
			allow: [
				{ name: /^.*$/, styles: true, attributes: true, classes: true }
			]
		},
		image: {
			toolbar: [
				'toggleImageCaption',
				'imageTextAlternative',
				'|',
				'imageStyle:inline',
				'imageStyle:wrapText',
				'imageStyle:breakText',
				'|',
				'resizeImage'
			]
		},
		link: {
			addTargetToExternalLinks: true,
			defaultProtocol: 'https://',
			decorators: {
				toggleDownloadable: {
					mode: 'manual',
					label: 'Downloadable',
					attributes: { download: 'file' }
				}
			}
		},
		list: {
			properties: {
				styles: true,
				startIndex: true,
				reversed: true
			}
		},
		mention: {
			feeds: [
				{ marker: '@', feed: [] }
			]
		},
		menuBar: {
			isVisible: true
		},
		minimap: {
			container: document.querySelector('#editor-minimap'),
			extraClasses: 'editor-container_include-minimap ck-minimap__iframe-content'
		},
		placeholder: 'Type or paste your content here!',
		style: {
			definitions: [
				{ name: 'Article category', element: 'h3', classes: ['category'] },
				{ name: 'Title', element: 'h2', classes: ['document-title'] },
				{ name: 'Subtitle', element: 'h3', classes: ['document-subtitle'] },
				{ name: 'Info box', element: 'p', classes: ['info-box'] },
				{ name: 'Side quote', element: 'blockquote', classes: ['side-quote'] },
				{ name: 'Marker', element: 'span', classes: ['marker'] },
				{ name: 'Spoiler', element: 'span', classes: ['spoiler'] },
				{ name: 'Code (dark)', element: 'pre', classes: ['fancy-code', 'fancy-code-dark'] },
				{ name: 'Code (bright)', element: 'pre', classes: ['fancy-code', 'fancy-code-bright'] }
			]
		},
		table: {
			contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
		},
		autosave: {
			save(editor) {
				const editorData = document.getElementById('editor').innerHTML;
				const activeTab = getActiveTab();
				const localStoragePrefix = getLocalStoragePrefix();
				if (activeTab) {
					localStorage.setItem(`${localStoragePrefix}${activeTab}`, editorData);
				}
				return Promise.resolve();
			}
		}
	};
}
