BBG Vintage Racing Club Web Application
=======================================

Website: [http://bbgvintageracing.ch/](http://bbgvintageracing.ch/)


This project is based on the following templates:

1. [play-silhouette-angular-seed](https://github.com/mohiva/play-silhouette-angular-seed)
2. [play-silhouette-reactivemongo-seed](https://github.com/ezzahraoui/play-silhouette-reactivemongo-seed)
3. [play-silhouette-reactivemongo-angular-seed](https://github.com/AhmadMelegy/play-silhouette-reactivemongo-angular-seed)

## Authentication Infrastructure

* Sign Up
* Sign In (Credentials)
* JWT authentication
* Dependency Injection with Guice
* Publishing Events
* Avatar service
* Remember me functionality
* [Security headers](https://www.playframework.com/documentation/2.4.x/SecurityHeaders)
* [CSRF Protection](https://www.playframework.com/documentation/2.4.x/ScalaCsrf)


## Build Instructions

1. [Install MONGODB](https://docs.mongodb.org/v3.0/tutorial/#installation). To run MongoDb:

  ```
  mongod --config /usr/local/etc/mongod.conf
  ```

2. Make sure you have [Ruby](https://www.ruby-lang.org/de/) and [node.js](http://nodejs.org/) installed.

  Then you must install the node packages [yo](http://yeoman.io), [grunt](http://gruntjs.com/) and [bower](http://bower.io/):

  ```
  npm install -g yo grunt grunt-cli bower
  ```

  And the ruby packages [sass](http://sass-lang.com/) and [compass](http://compass-style.org/):

  ```
  gem install sass compass
  ```

  Alternative you can use Bundler to install the ruby packages:

  ```
  bundle install -j4 --path .bundle
  ```

4. Start sbt and run the following:

  ```
  $ update

  $ npm install

  $ bower install

  $ grunt build

  $ run
  ```


# Running Inside IntelliJ

You can run the created application and view the result in the default browser http://localhost:9000. To run a 
Play application:

1. Create a new Run Configuration – From the main menu, select Run -> Edit Configurations
2. Click on the + to add a new configuration
3. From the list of configurations, choose “SBT Task”
4. In the “tasks” input box, simply put “run”
5. Apply changes and select OK.
6. Now you can choose “Run” from the main Run menu and run your application

You can easily start a debugger session for a Play application using default Run/Debug Configuration settings.


# Deployment


Run the following command to generate the package:

    ./activator dist
    
In the server, run the following commands:

    $ unzip my-first-app-1.0.zip
    $ my-first-app-1.0/bin/my-first-app -Dplay.crypto.secret=abcdefghijk
    
You can also specify a different configuration file for a production environment, from the command line:

    $ my-first-app-1.0/bin/my-first-app -Dconfig.file=/full/path/to/conf/application-prod.conf
    
For a full description of usage invoke the start script with a -h option.

# TODO: Document Capistrano usage.

# License

The code is licensed under [Apache License v2.0](http://www.apache.org/licenses/LICENSE-2.0).
