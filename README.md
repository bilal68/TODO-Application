# glints_rms
### Project Setup
Once you clone or download project go into you folder

>create file **.env**

### Installing
```
> npm install or yarn install  (this will install all dependent libraries)
```

### Database Config Setup
Create new database (let's say i'm going to use mysql and my database name is **express-sequelize-api**).
so in my **.env** file will set below parameters.
```
DB_HOST=localhost               # database connection host
DB_USER=root                    # database username
DB_PASS=                        # database password
DB_NAME=glints_rms              # database name
DB_DIALECT=mysql                # database dialect
DB_PORT=3306                    # database port
```
some other inportant parameters/keys in **.env** file
```
APP_HOST=localhost      # application host name
APP_PORT=3000           # application port
```
### Migration and Seeders run
After creating and updating .env file run below commands
```
> yarn migrate:up
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