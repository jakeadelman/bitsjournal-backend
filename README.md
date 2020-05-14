# Bitsjournal backend

### Set up postgres:

```
1. create postgres database "instagauge"
2. create postgres user "manx" using password "jakeadelman"
3. grant all privileges to manx
```

### Steps to run server:

```
Make sure you have yarn installed globally - "npm i -g yarn"

IMPORTANT: make folder bitsjournal and enter the folder

1. git clone https://github.com/jakeadelman/type-graphql-server backend
2. git checkout working
3. yarn install
4. yarn start
```

(if not working you may have to set up and run redis)

### Import test data:

```
1. yarn run populate-trades


This should start the importing process - wait util it's complete.
Always leave yarn start running when developing the frontend. Now move on to the frontend setup.
```

### Processes:

```
run once-->
yarn populate-trades: populate candle table with inital candle data

always running-->>>
yarn fetch-execution: run continuous fetch of execution data for all users (every 5 minutes)
yarn fetch-trades: run continuous fetch of candle data (every 5 minutes)

```
