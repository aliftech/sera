# Contact API

This app is created to full fill the recruitment test of PT SERA.

## How to start

1. Clone the git repository by this command:

   ```bash
   git clone
   ```

2. Install all the dependency using the following command:

   ```bash
   npm install
   ```

## Migration

Before running the application, its necessary to run the migrations by the followings command. But, before running the migration, you need to make a table named "contact_database". For more detail you can fisit the [CONFIG.JSON](src/config/config.json)

```bash
npx sequelize-cli init
```

## Databse Migration

```bash
npx sequelize-cli db:migrate
```

## Running The Services

There are two service in this application, namely contact api and send email api. The contact api is CRUD REST API design to create, read, update, and delete the contact data. Meanwhile, the send email is a service used to send an email queue using rabbitMQ.

### Contact API

First, copy the env file and renamed it to .env. Then please setup the variables inside .env file as you need.

In order to start the application, you can run this following command:

```bash
npm run dev
```

or

```bash
npm start
```

After that, you can try the API service using the provided postman collection and environment.

[POSTMAN COLLECTION](./docs/sera.postman_collection.json).

[POSTMAN ENVIRONMENT](./docs/sera.postman_environment.json).

### Send Email Service

First, to run this service, you have to make sure that you are already install rabbitMQ in your machine.

After that, please check the .env setting and make sure that the setup is ok.

Then run the consumer service using this command:

```bash
npm run start:consumer
```

### Unit Test

To run unit test please run the following command

```bash
npm test
```
