/**
 * Excalidraw メインメニュー（公式デフォルトから Socials / Excalidraw links を除く）
 */
import React from "react";
import { MainMenu } from "@excalidraw/excalidraw";

/**
 * @param {object} [uiOptions] - Excalidraw UIOptions
 */
export function createExcalidrawMainMenu(uiOptions = {}) {
  const canvas = uiOptions.canvasActions ?? {};
  const items = [
    React.createElement(MainMenu.DefaultItems.LoadScene, { key: "load" }),
    React.createElement(MainMenu.DefaultItems.SaveToActiveFile, { key: "save" }),
  ];

  if (canvas.export) {
    items.push(React.createElement(MainMenu.DefaultItems.Export, { key: "export" }));
  }
  if (canvas.saveAsImage) {
    items.push(
      React.createElement(MainMenu.DefaultItems.SaveAsImage, { key: "saveAsImage" })
    );
  }

  items.push(
    React.createElement(MainMenu.DefaultItems.SearchMenu, { key: "search" }),
    React.createElement(MainMenu.DefaultItems.Help, { key: "help" }),
    React.createElement(MainMenu.DefaultItems.ClearCanvas, { key: "clear" }),
    React.createElement(MainMenu.Separator, { key: "sep" }),
    React.createElement(MainMenu.DefaultItems.ToggleTheme, { key: "theme" }),
    React.createElement(MainMenu.DefaultItems.ChangeCanvasBackground, { key: "bg" })
  );

  return React.createElement(MainMenu, null, ...items);
}
