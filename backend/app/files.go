package app

import (
	"github.com/wailsapp/wails/v3/pkg/application"
)

func (a *App) ChooseCertFile(title string) (string, error) {
	selection, err := a.app.Dialog.OpenFileWithOptions(&application.OpenFileDialogOptions{
		Title: title,
		Filters: []application.FileFilter{
			{
				DisplayName: "Certificate Files (*.crt;*.cer;*.key;*.pem;*.jks;*.der;*.pfx)",
				Pattern:     "*.crt;*.cer;*.key;*.pem;*.jks;*.der;*.pfx",
			},
		},
		ShowHiddenFiles: true,
	}).PromptForSingleSelection()
	if err != nil {
		return "", err
	}
	return selection, nil
}

func (a *App) ChooseDirectory(title string) (string, error) {
	selection, err := a.app.Dialog.OpenFileWithOptions(&application.OpenFileDialogOptions{
		Title:                title,
		ShowHiddenFiles:      true,
		CanChooseDirectories: true,
		CanChooseFiles:       false,
	}).PromptForSingleSelection()
	if err != nil {
		return "", err
	}
	return selection, nil
}
