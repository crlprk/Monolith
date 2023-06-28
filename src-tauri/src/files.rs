use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};
use serde_json;
use gray_matter::Matter;
use gray_matter::engine::YAML;
use tauri::command;
use std::{
    collections::HashMap,
    fs::{self, read_to_string, metadata},
    time::UNIX_EPOCH,
};

#[derive(Serialize, Deserialize)]
pub struct MonolithFile {
    title: String,
    description: String,
    associated_files: Vec<String>,
    canvas_annotations: Vec<u8>,
    markdown: String,
}

#[derive(Serialize, Deserialize)]
pub struct MonolithData {
    title: String,
    description: String,
    associated_files: Vec<String>,
    canvas_annotations: Vec<u8>,
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

impl FileMetadata {
    fn new(
        path: String,
        size: u64,
        modified: String,
        accessed: String,
        created: String,
    ) -> Self {
        FileMetadata {
            path,
            size,
            modified,
            accessed,
            created,
        }
    }
}

impl Default for FileMetadata {
    fn default() -> Self {
        Self {
            path: String::default(),
            size: u64::default(),
            modified: String::default(),
            accessed: String::default(),
            created: String::default(),
        }
    }
}

impl MonolithFile {
    fn new(
        title: String,
        description: String,
        associated_files: Vec::<String>,
        canvas_annotations: Vec::<u8>,
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
            associated_files: Vec::<String>::new(),
            canvas_annotations: Vec::<u8>::new(),
            markdown: String::new(),
        }
    }
}

#[command]
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

#[command]
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
        let path = entry.path().to_string_lossy().into_owned();
        if metadata.is_dir() {
            if let Some(subdirectory_map) = directory_to_hashmap(entry.path().to_str().unwrap())? {
                if !subdirectory_map.is_empty() {
                    directory_map.insert(
                        path.clone(),
                        Entry::Directory(path),
                    );
                }
            }
        } else {
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
                        path.clone(),
                        Entry::File(FileMetadata::new(
                            path, size, modified, accessed, created,
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
                    path, size, modified, accessed, created,
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

#[command]
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

#[command]
pub fn load_file(path: String) -> MonolithFile {
    match read_to_string(path) {
        Ok(raw) => {
            let matter = Matter::<YAML>::new();

            match matter.parse_with_struct::<MonolithData>(&raw) {
                Some(monolith_file) => MonolithFile::new(monolith_file.data.title, monolith_file.data.description, monolith_file.data.associated_files, monolith_file.data.canvas_annotations, monolith_file.content),
                None => MonolithFile::default()
            }
        }
        Err(err) => {
            eprintln!("Error reading file: {}", err);
            MonolithFile::default()
        }
    }
}

#[command]
pub fn load_file_metadata(path: String) -> FileMetadata {
    match metadata(&path) {
        Ok(raw) => {
            let size = raw.len();
            let raw_accessed: DateTime<Local> =
                raw.accessed().unwrap_or_else(|_| UNIX_EPOCH).into();
            let accessed = raw_accessed.to_string();
            let raw_created: DateTime<Local> =
                raw.created().unwrap_or_else(|_| UNIX_EPOCH).into();
            let created = raw_created.to_string();
            let raw_modified: DateTime<Local> =
                raw.modified().unwrap_or_else(|_| UNIX_EPOCH).into();
            let modified = raw_modified.to_string();
            FileMetadata::new(path, size, modified, accessed, created)
        }
        Err(err) => {
            eprintln!("Error reading file metadata: {}", err);
            FileMetadata::default()
        }
    }
}

#[command]
pub fn load_file_metadata_multi(files: Vec<String>) -> Vec<FileMetadata> {
    let mut metadata_vec: Vec<FileMetadata> = Vec::new();
    for file in files {
        metadata_vec.push(load_file_metadata(file));
    }
    metadata_vec
}