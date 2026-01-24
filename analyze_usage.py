import os
import re

# Define source root
SRC_DIR = "/home/aditya/TechSolstice-26/src"

# Extensions to check
EXTENSIONS = {".tsx", ".ts", ".jsx", ".js"}

# Implicitly used files (entry points)
IMPLICIT_FILES = {
    "page.tsx", "layout.tsx", "loading.tsx", "error.tsx", 
    "not-found.tsx", "route.ts", "middleware.ts", "globals.css"
}

def get_all_source_files(root_dir):
    files_to_check = []
    all_files_for_search = []
    
    for dirpath, _, filenames in os.walk(root_dir):
        for f in filenames:
            ext = os.path.splitext(f)[1]
            if ext in EXTENSIONS:
                full_path = os.path.join(dirpath, f)
                all_files_for_search.append(full_path)
                
                # Check if this file is a candidate for being "unused"
                # i.e., not an implicit Next.js entry point
                if f not in IMPLICIT_FILES:
                    files_to_check.append(full_path)
                    
    return files_to_check, all_files_for_search

def check_usage(target_file, all_files):
    # Determine the import string key
    # e.g., /src/components/ui/button.tsx -> components/ui/button
    # We search for the filename without extension, or the path relative to src
    
    rel_path = os.path.relpath(target_file, SRC_DIR)
    rel_path_no_ext = os.path.splitext(rel_path)[0]
    filename_no_ext = os.path.splitext(os.path.basename(target_file))[0]
    
    # regex to find import
    # standard import: from "@/components/ui/button"
    # or relative: from "../ui/button"
    
    # Simple heuristic: Search for the filename in import statements
    # This might have false positives if two files have same name, but good for first pass
    
    usage_count = 0
    
    for f in all_files:
        if f == target_file:
            continue
            
        try:
            with open(f, 'r', encoding='utf-8') as content_file:
                content = content_file.read()
                
                # Check for strict import path usage
                # 1. Check for filename key in imports
                if filename_no_ext in content:
                    # Verify it's in an import or dynamic import line to be sure?
                    # or just general usage (e.g. <Button /> matches Button)
                    # But <Button /> matches Button.tsx, not necessarily valid if not imported.
                    # We strictly look for the import path mostly.
                    
                    # If we find the detailed path fragment
                    if rel_path_no_ext in content or filename_no_ext in content:
                         # Refining: Check if it looks like an import
                         # import ... from "..."
                         # require("...")
                         if re.search(f'[\'"][\.\/a-zA-Z0-9_\-@]*{filename_no_ext}[\'"]', content):
                             usage_count += 1
                             break # Found one usage, it's used.
        except Exception:
            pass
            
    return usage_count

def main():
    check_list, search_list = get_all_source_files(SRC_DIR)
    unused = []
    
    print(f"Checking {len(check_list)} files for usage...")
    
    for target in check_list:
        if check_usage(target, search_list) == 0:
            unused.append(target)
            
    print("\nPotential Unused Files Found:")
    for u in unused:
        print(u)

if __name__ == "__main__":
    main()
