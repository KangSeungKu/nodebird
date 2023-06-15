export default {
  "development": {
    "username": "root",
    "password": "nodejsbook",
    "database": "nodebird",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "nodejsbook",
    "database": "nodebird_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": "nodejsbook",
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
} as const;
