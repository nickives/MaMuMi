<!-- TOC -->

- [MaMuMi](#mamumi)
    - [Current Status](#current-status)
- [Docker Configuration](#docker-configuration)
- [MariaDB](#mariadb)
    - [IMPORTANT SETUP CONFIGURATION](#important-setup-configuration)
- [Journey Classes](#journey-classes)
- [Populate Journeys](#populate-journeys)

<!-- /TOC -->
# MaMuMi
MaMuMi “Mapping the Music of Migration” is a two-year European, Erasmus+ musical inheritance project focused on talking about music and song as a tool for intercultural competency. It involves the collection, editing and uploading of “Song Stories”, stories about music to an interactive app. These stories focus on “inheritance tracks”; the songs or music that migrants have inherited, the discussion of which acts as a platform for diversity awareness in dedicated MaMuMi “Song Worlds” Workshops’.

## Current Status
Currently a map view is displayed with geoJSON data.

# Docker Configuration
There are 3 Docker configurations. Production, debug, and dev. Production is the release configuration. Debug is built with dev-dependancies and also has a debugger listening. This should be used with the debug run configuration in your IDE to allow you to step through code. Dev mounts the current working directory as a bind volume and runs with nodemon. This reloads node.js whenever a file is modified, meaning changes are reflected instantly.

To run the dev container:
`docker-compose -f docker-compose.dev.yml up --build`

To run the unit tests on a running container:
`docker exect -it mamumi npm test`

# MariaDB
The database schema is in lib/db/db.sql. This script should populate the database with required tables. The dev container has the database open on port 3306.

## IMPORTANT SETUP CONFIGURATION
Currently there exists a file lib/db/pool-secret-template.js. This file should be configured with the database connection details and copied to pool-secret.js. In future it would be better to just have pool.js for the DB connection pool and populate those values with environment variables, but this will do for now. The default values in the template will work fine for the default configuration of the dev container. Obviously this is not secure.

# Journey Classes
These can be found in static/js/lib. 

```
const Point = require('../static/js/lib/point');
var point = new Point();

const Journey = require('../static/js/lib/journey');
var journey = new Journey();
```

It is advised to use the class constructors to populate the required members. These are documented. Journey has add/remove point methods to further populate the journey.

# Populate Journeys
`/journeys/insert-random/{number}` will insert a random amount of random journeys with random points.