export async function importRawFile() {
	try {
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = ".html";

		fileInput.addEventListener("change", async (event) => {
			const file = event.target.files[0];
			if (!file) {
				await showAlert("No file selected.", "No File");
				return;
			}

			const reader = new FileReader();
			reader.onload = async (e) => {
				const fileContent = e.target.result;
				const confirmation = await showConfirm("The current editor content will be replaced. Do you want to proceed?", "Replace Content");
				if (confirmation && window.editorInstance) {
					window.editorInstance.setData(fileContent);
				}
			};
			reader.onerror = async () => {
				await showAlert("Error reading the file.", "Read Error");
			};
			reader.readAsText(file);
		});

		fileInput.click();
	} catch (error) {
		console.error("Error while importing raw file:", error);
	}
}
