# RelaxG 
A mobile-first tool to help with manga upscaling
Self-hosted solution that take care of your local DRM-less books, improving their visual quality without the hassle of typing a command 200 times.
The hosted demonstration does not allow any downloading at the moment, as sharing protected media over the internet is prohibed. The output files are only produced locally.

## Getting Started (development)
Install project dependencies :
```bash
pnpm install
pnpm approve-builds
```
Create and start the Docker container :
```bash
docker compose -f docker-compose.dev.yml up
```

Setup and run the API along ([project here](https://github.com/kuroi-9/relaxg_api_reworked)) ;

Get back-end scripts and specify their paths editing the API ([here](https://github.com/kuroi-9/relax_tools)) ;

Finally, open [http://localhost:3000](http://localhost:3001) with your browser.
