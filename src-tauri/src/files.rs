use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};
use serde_json;
use std::{
    collections::HashMap,
    fmt,
    fs::{self, read_to_string},
    time::UNIX_EPOCH,
};

#[derive(Serialize, Deserialize)]
pub struct MonolithFile {
    title: String,
    description: String,
    associated_files: Vec<FileMetadata>,
    canvas_annotations: String,
    markdown: String,
}

#[derive(Serialize, Deserialize)]
pub struct Config {
    files: FileConfig,
}
#[derive(Serialize, Deserialize)]
struct FileConfig {
    home_directory: String,
}

#[derive(Serialize, Deserialize)]
pub enum Entry {
    File(FileMetadata),
    Directory(String),
}

#[derive(Serialize, Deserialize)]
pub struct FileMetadata {
    name: String,
    path: String,
    size: u64,
    modified: String,
    accessed: String,
    created: String,
}

impl Default for Config {
    fn default() -> Self {
        let files = FileConfig {
            home_directory: String::from("./Base"),
        };

        Config { files }
    }
}

impl std::fmt::Debug for Config {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("Config")
            .field("files", &self.files)
            .finish()
    }
}

impl std::fmt::Debug for FileConfig {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("FileConfig")
            .field("homeDirectory", &self.home_directory)
            .finish()
    }
}

impl fmt::Debug for Entry {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Entry::File(metadata) => f.debug_tuple("Entry::File").field(metadata).finish(),
            Entry::Directory(map) => f.debug_tuple("Entry::Directory").field(map).finish(),
        }
    }
}

impl fmt::Debug for FileMetadata {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("FileMetadata")
            .field("name", &self.name)
            //.field("path", &self.size)
            .field("size", &self.size)
            .field("modified", &self.modified)
            .field("accessed", &self.accessed)
            .field("created", &self.created)
            .finish()
    }
}

impl FileMetadata {
    fn new(
        name: String,
        path: String,
        size: u64,
        modified: String,
        accessed: String,
        created: String,
    ) -> Self {
        FileMetadata {
            name,
            path,
            size,
            modified,
            accessed,
            created,
        }
    }
}
impl MonolithFile {
    pub fn new(
        title: String,
        description: String,
        associated_files: Vec<FileMetadata>,
        canvas_annotations: String,
        markdown: String,
    ) -> Self {
        MonolithFile {
            title,
            description,
            associated_files,
            canvas_annotations,
            markdown,
        }
    }
}
impl Default for MonolithFile {
    fn default() -> Self {
        MonolithFile {
            title: String::new(),
            description: String::new(),
            associated_files: Vec::new(),
            canvas_annotations: String::new(),
            markdown: String::new(),
        }
    }
}

#[tauri::command]
pub fn locate_all_hierarchical_order(home_directory: String) -> HashMap<String, Entry> {
    println!("Locating all files within directory");
    match directory_to_hashmap(&home_directory) {
        Ok(Some(map)) => {
            println!("Successfully discovered all MD files");
            map
        }
        Ok(None) => {
            println!("No compatible Markdown files found.");
            HashMap::default()
        }
        Err(err) => {
            eprintln!("Error reading directory: {}", err);
            HashMap::default()
        }
    }
}

#[tauri::command]
pub fn locate_all_chronological_order(home_directory: String) -> Vec<FileMetadata> {
    println!("Locating all files within directory");
    match directory_to_vector(&home_directory) {
        Ok(Some(vec)) => {
            println!("Successfully discovered all MD files");
            vec
        }
        Ok(None) => {
            println!("No compatible Markdown files found.");
            Vec::default()
        }
        Err(err) => {
            eprintln!("Error reading directory: {}", err);
            Vec::default()
        }
    }
}

fn directory_to_hashmap(
    home_directory: &str,
) -> Result<Option<HashMap<String, Entry>>, Box<dyn std::error::Error>> {
    let mut directory_map: HashMap<String, Entry> = HashMap::new();
    let entries = fs::read_dir(home_directory)?;

    for entry in entries {
        let entry = entry?;
        let metadata = entry.metadata()?;

        let name = entry
            .path()
            .file_stem()
            .map(|stem| stem.to_string_lossy().into_owned())
            .unwrap_or_else(|| entry.file_name().to_string_lossy().into_owned());

        if metadata.is_dir() {
            if let Some(subdirectory_map) = directory_to_hashmap(entry.path().to_str().unwrap())? {
                if !subdirectory_map.is_empty() {
                    directory_map.insert(
                        name.clone(),
                        Entry::Directory(entry.path().to_string_lossy().into_owned()),
                    );
                }
            }
        } else {
            let path = entry.path().to_string_lossy().into_owned();
            let size = metadata.len();
            let raw_accessed: DateTime<Local> =
                metadata.accessed().unwrap_or_else(|_| UNIX_EPOCH).into();
            let accessed = raw_accessed.to_string();
            let raw_created: DateTime<Local> =
                metadata.created().unwrap_or_else(|_| UNIX_EPOCH).into();
            let created = raw_created.to_string();
            let raw_modified: DateTime<Local> =
                metadata.modified().unwrap_or_else(|_| UNIX_EPOCH).into();
            let modified = raw_modified.to_string();

            if let Some(extension) = entry.path().extension() {
                if extension.to_string_lossy().eq_ignore_ascii_case("md") {
                    directory_map.insert(
                        name.clone(),
                        Entry::File(FileMetadata::new(
                            name, path, size, modified, accessed, created,
                        )),
                    );
                }
            }
        }
    }

    if !directory_map.is_empty() {
        Ok(Some(directory_map))
    } else {
        Ok(None)
    }
}

fn directory_to_vector(
    home_directory: &str,
) -> Result<Option<Vec<FileMetadata>>, Box<dyn std::error::Error>> {
    let mut file_vector: Vec<FileMetadata> = Vec::new();
    let entries = fs::read_dir(home_directory)?;

    for entry in entries {
        let entry = entry?;
        let metadata = entry.metadata()?;
        if metadata.is_dir() {
            if let Some(subdirectory_files) = directory_to_vector(entry.path().to_str().unwrap())? {
                if !subdirectory_files.is_empty() {
                    file_vector.extend(subdirectory_files);
                }
            }
        } else if let Some(extension) = entry.path().extension() {
            if extension.to_string_lossy().eq_ignore_ascii_case("md") {
                let name = entry
                    .path()
                    .file_stem()
                    .map(|stem| stem.to_string_lossy().into_owned())
                    .unwrap_or_else(|| entry.file_name().to_string_lossy().into_owned());
                let path = entry.path().to_string_lossy().into_owned();
                let size = metadata.len();
                let raw_accessed: DateTime<Local> =
                    metadata.accessed().unwrap_or_else(|_| UNIX_EPOCH).into();
                let accessed = raw_accessed.to_string();
                let raw_created: DateTime<Local> =
                    metadata.created().unwrap_or_else(|_| UNIX_EPOCH).into();
                let created = raw_created.to_string();
                let raw_modified: DateTime<Local> =
                    metadata.modified().unwrap_or_else(|_| UNIX_EPOCH).into();
                let modified = raw_modified.to_string();

                file_vector.push(FileMetadata::new(
                    name, path, size, modified, accessed, created,
                ));
            }
        }
    }

    file_vector.sort_by(|a, b| a.modified.cmp(&b.modified));

    if !file_vector.is_empty() {
        Ok(Some(file_vector))
    } else {
        Ok(None)
    }
}

#[tauri::command]
pub fn load_config() -> Config {
    match read_config() {
        Ok(config) => {
            println!("Config file successfully read, loading preferences");
            config
        }
        Err(err) => {
            eprintln!("Error reading config: {}", err);
            Config::default()
        }
    }
}

fn read_config() -> Result<Config, Box<dyn std::error::Error>> {
    let json_raw = fs::read_to_string("../../config.json")?;
    let config: Config = serde_json::from_str(&json_raw)?;
    Ok(config)
}

#[tauri::command]
pub fn load_file(path: String) -> MonolithFile {
    match read_to_string(path) {
        Ok(raw) => {
            MonolithFile::default()
        }
        Err(err) => {
            eprintln!("Error reading file: {}", err);
            MonolithFile::default()
        }
    }
}
