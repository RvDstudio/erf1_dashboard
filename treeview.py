import os

def print_directory_tree(root, indent=""):
    exclude_dirs = {'node_modules', 'objects', 'venv'}
    include_extensions = {'.html', '.js', '.json', '.css', '.py', '.ttf'}

    for filename in os.listdir(root):
        file_path = os.path.join(root, filename)
        if os.path.isdir(file_path):
            if filename not in exclude_dirs:
                print(indent + "|-- " + filename)
                print_directory_tree(file_path, indent + "|   ")
        else:
            if os.path.splitext(filename)[1] in include_extensions:
                print(indent + "|-- " + filename)

if __name__ == "__main__":
    script_directory = os.path.dirname(os.path.realpath(__file__))
    print(f"Directory structure of {script_directory}:")
    print_directory_tree(script_directory)
