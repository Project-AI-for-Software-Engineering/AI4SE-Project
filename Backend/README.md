# User Guide Backend | AI4SE-Project

## How to run?

- 1. Open the folder 'Backend' as a project in vscode or other similar IDE.
- 2. Create a virtual enviroment with the command `python -m venv venv`.
- 3. Open the virtual enviroment you created `venv/Scripts/activate`.
- 4. Install all requirements with `pip install -r requirements.txt`.
- 5. Create a posgress data base called _aise5_, user _postgres_, password _123_ .
- 6. Lunch the database.
- 7. Migrate database `python manage.py migrate`.
- 8. Migrate database `python manage.py makemigrations`.
- 9. Run the backend with the command `python manage.py runserver`.
