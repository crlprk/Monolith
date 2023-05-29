// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod files;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            files::locate_all,
            files::load_config
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
