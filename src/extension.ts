import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

let myStatusBarItem: vscode.StatusBarItem;
const defaultRepoInfo = "user/repo";

export function activate(context: vscode.ExtensionContext) {
    myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 999999999);

    const repoInfo = getWorkspaceOriginInfo() ?? defaultRepoInfo;
    myStatusBarItem.text = `$(repo) ${repoInfo}`;
    myStatusBarItem.show();
}

function getWorkspaceOriginInfo(): string | null {
    try {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return null;
        }
        const workspacePath = workspaceFolders[0].uri.fsPath;
        return getOriginInfo(workspacePath);
    } catch (error) {
        console.error("Error getting git origin info:", error);
    }
    return null;
}

function getOriginInfo(workspacePath: string): string | null {
    const gitConfigPath = path.join(workspacePath, ".git", "config");

    if (!fs.existsSync(gitConfigPath)) {
        return null;
    }

    const configContent = fs.readFileSync(gitConfigPath, "utf-8");

    let match = configContent.match(/url = https:\/\/github\.com\/(.+)\.git/);
    if (match) {
        return match[1];
    }

    match = configContent.match(/url = git@github\.com:(.+)\.git/);
    if (match) {
        return match[1];
    }

    return null;
}
