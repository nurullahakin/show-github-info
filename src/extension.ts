import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

let myStatusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
	myStatusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Left,
		999999999
	);

	const repoInfo = getRepoAndAccountName();
	if (repoInfo) {
		myStatusBarItem.text = `$(repo) ${repoInfo}`;
		myStatusBarItem.show();
	}
}
function getRepoAndAccountName(): string | null {
	try {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders) {
			return null;
		}

		const workspacePath = workspaceFolders[0].uri.fsPath;
		const gitConfigPath = path.join(workspacePath, ".git", "config");

		if (!fs.existsSync(gitConfigPath)) {
			return null;
		}

		// .git/config dosyasını oku
		const configContent = fs.readFileSync(gitConfigPath, "utf-8");

		// HTTPS formatındaki URL'yi bul (örneğin: https://github.com/oktayaydogan/management-service.git)
		let match = configContent.match(/url = https:\/\/github\.com\/(.+)\.git/);
		if (match) {
			return match[1]; // oktayaydogan/management-service gibi bir string döndürür
		}

		// SSH formatındaki URL'yi bul (örneğin: git@github.com:turkpin/storefront-service.git)
		match = configContent.match(/url = git@github\.com:(.+)\.git/);
		if (match) {
			return match[1]; // turkpin/storefront-service gibi bir string döndürür
		}

		return null; // Eğer uygun bir eşleşme bulunmazsa null döndür
	} catch (error) {
		console.error("Error getting Git repo and account name:", error);
		return null;
	}
}
