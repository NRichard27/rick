# Rick

A Discord music bot. (YouTube and Spotify supported)

_Tested only with NodeJS version 18.12.0_

# Usage

## Step 1: Creating the .env file

Create a file named '.env' and paste this in:

```
DC_BOT_TOKEN=value-here
DC_APP_ID=value-here
DC_DEV_USER_ID=value-here(optional)

SPOTIFY_CLIENT_ID=value-here
SPOTIFY_CLIENT_SECRET=value-here
SPOTIFY_REFRESH_TOKEN=value-here
SPOTIFY_MARKET=US

```

Replace the variables with your own values.

## Step 2: Inviting your bot to a server

https://discord.com/api/oauth2/authorize?client_id={YOURAPPIDHERE}&permissions=8&scope=bot%20applications.commands

_Replace {YOURAPPIDHERE} with your App Id!_

MUST HAVE PERMISSIONS TO WORK PROPERLY:

-   View Channels
-   Send Messages
-   Read Message History
-   Manage Messages
-   Embed Links
-   Connect
-   Speak
-   Use Voice Activity

## Step 3: Installing the dependencies:

Run:

```
npm install
```

## Step 4: Deploying commands

Run:

```
npm run deploy-commands
```

## Step 5: Starting

Run:

```
npm start
```
