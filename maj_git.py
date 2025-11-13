import subprocess
import os
import shutil
import re

# Config
fake_files_dir = r"C:\Users\oliu\Desktop\ORION\create_fake_data\dfs_fake_csv"
current_year_folder = "2025"
specific_files = ["constat_2025.csv", "attractivite_capacite_2025.csv", "parcoursup_rs_2025.csv"]
repo_dir = "."  # le script est exécuté depuis le dépôt orion

# --- 1️⃣ Vérifie qu'on est bien dans le dépôt ---
os.chdir(repo_dir)
print(f"📂 Répertoire courant : {os.getcwd()}")

# --- 2️⃣ Copier les fichiers fake ---
# Créer le dossier pour l'année courante
year_folder_path = os.path.join("server/static/files", current_year_folder)
os.makedirs(year_folder_path, exist_ok=True)

# Copier les fichiers spécifiques
for f in specific_files:
    shutil.copy(os.path.join(fake_files_dir, f), year_folder_path)

# Copier tous les autres fichiers dans server/static/files/
for f in os.listdir(fake_files_dir):
    if f not in specific_files:
        shutil.copy(os.path.join(fake_files_dir, f), "server/static/files/")

# --- 3️⃣ Modifier les fichiers shared/time ---
# CURRENT_IJ_MILLESIME.ts
with open("shared/time/CURRENT_IJ_MILLESIME.ts", "w") as f:
    f.write('export const CURRENT_IJ_MILLESIME = "2023_2024";\n')

# CURRENT_RENTREE.ts
with open("shared/time/CURRENT_RENTREE.ts", "w") as f:
    f.write("export const CURRENT_RENTREE = 2025;\n")

# --- 4️⃣ Modifier millesimes.ts sans écraser le contenu existant ---
file_path = "shared/time/millesimes.ts"
new_millesimes = ["2023_2024", "2024_2025"]
new_rentrees = ["2025"]

with open(file_path, "r") as f:
    content = f.read()

def add_to_export(export_name, new_values):
    pattern = rf'(export const {export_name} = \[)([^\]]*)(\];)'
    match = re.search(pattern, content)
    if match:
        existing = match.group(2).strip()
        existing_list = [v.strip().strip('"') for v in existing.split(",") if v.strip()]
        updated_list = existing_list + [v for v in new_values if v not in existing_list]
        values_str = ", ".join(f'"{v}"' for v in updated_list)
        new_line = f'{match.group(1)}{values_str}{match.group(3)}'
        return re.sub(pattern, new_line, content)
    else:
        return content

content = add_to_export("MILLESIMES_IJ", new_millesimes)
content = add_to_export("MILLESIMES_IJ_REG", new_millesimes)
content = add_to_export("MILLESIMES_IJ_ETAB", new_millesimes)
content = add_to_export("RENTREES_SCOLAIRES", new_rentrees)

with open(file_path, "w") as f:
    f.write(content)

# --- 5️⃣ Ajouter, committer et push ---
subprocess.run(["git", "add", "server/static/files", "shared/time/*"])
subprocess.run(["git", "commit", "-m", "MAJ millésime 2023_2024 et rentrée 2025, ajout fichiers fake"])
subprocess.run(["git", "push", "origin", "test-maj-jav26"])

print("✅ Branche test-maj-jav26 créée et push réussie !")