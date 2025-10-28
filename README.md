EOL repo NOTE: The project is no longer being worked on here. You can have a look at this article to preview what's next:
https://www.loicdelon.fr/blog/inferenceprocess


Then, you can check these repositories - They define the next iteration of the RelaxG project:
https://github.com/kuroi-9/relaxg_second_inference

https://github.com/kuroi-9/relaxg_second_server

https://github.com/kuroi-9/relaxg_second_front

# RelaxG 
A mobile-first tool to help with manga upscaling.

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
