# US Mass Shootings 1966-2017
**Interactive Data visualisation Web Application**

This Web App was built as a course project. It is a Data Visualisation project using Pythons *Flask* framework.

## Live Demo

**Follow this link to view deployed version of the web app https://us-mass-shootings.herokuapp.com/**

## Built with 
1. Flask 
2. Python
2. HTML
3. CSS
4. Bootstrap
5. MongoDB database
6. JavaScript Libraries:
    * d3.js
    * dc.js
    * crossfilter.js
    * queue.js
7. A dataset obtained [here](https://www.kaggle.com/zusmani/us-mass-shootings-last-50-years)

## Components

#### Flask
A Python micro-framework that was used to serve the data and render the HTML pages for this Application.

#### Python
A Python file name mass_shootings.py renders a index.html template and builds a web server using pymongo to interact with MongoDB.

#### MongoDB database
NoSQL database that converts and presents data in JSON format. The dataset resource was downloaded as a csv file from [here](https://www.kaggle.com/zusmani/us-mass-shootings-last-50-years). Additional column for the states was added.

#### Crossfilter.js
A Javascript based data manipulation library that enables two way data binding - you will see this in action when a section of a graph is clicked, all the other graphs filter.

#### D3.js
A JavaScript based visualisation engine that renders interactive charts and graphs in svg format when given data, which are then passed in to divs in index.html.

#### Dc.js
A Javascript based wrapper library for d3.js - this made plotting the charts easier.


## Deployment / Hosting

This Application was deployed and is hosted on Heroku - gunicorn Python package runs the http server for the app, the Procfile gives Heroku the information to run the app, and requirements.txt is a file that contains all the Python packages required to run the app. mLab MongoDB was chosen to host the dataset on the server.


## Installation

Follow the below instructions to get this project up & running:

1. Create a new folder for the project and copy the code there
2. Create and activate a new Virtual Environment in terminal: Create: `$ virtualenv --no-site-packages .` Activate: `$ source bin/activate`
3. Install the project dependancies: `$ pip install -r requirements.txt`
4. Connect to the MongoDB
6. Run'mass_shootings.py' and you should see the address where it's running below:
    `$ python mass_shootings.py`

## Acknowledgments
Number count from http://jsfiddle.net/jfriend00/CPtTQ/.
