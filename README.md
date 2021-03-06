# JAMMED
Visualization of Lviv traffic information.
> [![Build Status](https://travis-ci.org/PetrushynskyiOleksii/jammed.svg?branch=develop)](https://travis-ci.org/PetrushynskyiOleksii/jammed)

### How to run?
1. Create `.env` file in the root of the project with the variables provided in [.env](#environment-variables).
2. Run backend stuff in docker containers:
    ```shell script
    docker-compose up
    ```
3. Install frontend dependencies from the `ui` directory:
    ```shell script
    yarn install
    ```
4. Run react server from the `ui` directory:
    ```shell script
    yarn start
    ```

### Environment variables
```shell script
LOG_DIR=
SERVER_MODE=

MONGO_URI=
MONGO_SERVER_TIMEOUT=
MONGO_INITDB_ROOT_USERNAME=
MONGO_INITDB_ROOT_PASSWORD=

REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
REDIS_URI=
```
