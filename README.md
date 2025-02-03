Design

Backend
- account-service -> for accounts
- devices-service -> For devices linked to account id's
- gateway-service -> Both to be linked by the front end

Frontend
- expo-app

Use of apollo Server

Needs to install and build every folder

To start backend

docker-compose up --build 

To start expo app

npx expo start

Example query for Devices

query ExampleQuery {
  devices {
    id
    name
  }
}

Example Query for Accounts

query ExampleQuery {
  accounts {
    email
  }
}

Example Query for both

 query test {
  accounts {
      id
      name
      email
        devices {
          id
          name
        }
    }
}
