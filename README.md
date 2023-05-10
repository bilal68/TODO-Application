# TODO_LIST_EMUMBA
### Project Setup
Once you clone or download project go into you folder

>create file **.env**

### Installing
```
> npm install or yarn install  (this will install all dependent libraries)
```

### Database Config Setup
so in my **.env** file will set below parameters.
```
DB_HOST=localhost               # database connection host
DB_USER=root                    # database username
DB_PASS=1234                    # database password
DB_NAME=todo_application_db     # database name
DB_DIALECT=mysql                # database dialect
DB_PORT=3306                    # database port              
```
some other important parameters/keys in **.env** file

APP_HOST=localhost      
APP_PORT=3000
JWT_SECRET_KEY="emumba_secret_key"
JWT_EXPIRE_TIME=1h         
MAILTRAP_USERNAME=5ad9ef9605b9f0
MAILTRAP_PASSWORD=1147d6c9b49d12

CLIENT_ID=1036345270095-4tn6uso6ufpbglsfinp5084v5p42vbdl.apps.googleusercontent.com
CLIENT_SECRET=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
CALLBACK_URL=http://localhost:3000/auth/google/callback
```
APP_HOST=localhost      # application host name
APP_PORT=3000           # application port
```
### Migration and Seeders run
After creating and updating .env file run below commands
```
> yarn seed:all
```
Migration will add index on table and seeds will add data in the DB

`yarn start` `npm start` to run your project 
>Everything is setup and you are good to go now.



# Other Information about setup/commands
## Routing files
> Currently I have added 1 routing file 
```
> public.js   # public routing access everyone can access this APIs
```