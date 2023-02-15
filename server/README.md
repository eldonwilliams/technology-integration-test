|   **Key**   | **Default** | **Description**                   |
|:-----------:|:-----------:|-----------------------------------|
|  REST_PORT  |     8000    | The port express will listen on.  |
| SOCKET_PORT |     7979    | The port socketio will listen on. |
|GEN_TEST_REPORTS|  true    | Will Jest test reports be made?   |
|  JWT_KEY    |    random   |  The key JWTs will be signed with, if not set it will default to 128 random bytes saved in memory.    |
| REDIS_URL            |   redis://redis:6379          |  The url redis will connect to.                                 |
| CORS_ORIGINS | localhost |  A list of origins that cors will accept, split by space. |