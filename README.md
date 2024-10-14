# Dan's simple notetaking app
This is a very simple note taking app I created using NextJS, NextAuth and a Prisma/SQLite DB.

This was create for fun, but it's live and can be used at notes.danielflood.com

I have no further plans to maintain this project but feel free to use it.

## Running your own version locally
### Prerequisites
- NodeJS (I've only tested this with version 20.18.0).
- A Google Cloud Platform account and the knowledge of how to setup Oauth2 credentials.

### Steps
1. Clone the repo.
2. Setup your environment variables, you will need to create Oauth2 credentials on Google Cloud.
```.env
GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXTAUTH_URL=http://localhost:3000 #Your redirect URI
NEXTAUTH_SECRET=xxxxxxxxxxxxxxxxxxxxxxx #Your personal app secret
```
4. Run `npm i`
5. Run `npx prisma migrate dev`
6. Run `npm run dev`
7. Enjoy x

## Notes
- The hardest part for running this project is probably to create your Oauth2 credentials. However, there are plenty resources for this on YouTube. 
- I started creating a template endpoint for analytics at /api/log, I didn't bother adding it in the end, but I may come back to it someday. If anyone want's to give it a go please feel free.
