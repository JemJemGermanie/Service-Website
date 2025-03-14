# Service-Website
Template web page for a service-based business.


## Background
This project was built in the context of an introductory web programming course, Therefore,
this is **not meant for commercial application**.

The frontend and backend are only expected to be run from a single machine,and addition tweaking
to the source code, as well as web hosting services would be required to use this as an actual
web service.

It is also worth mentionning that the payment system is simply not implemented, as such a feature
would have been well outside the scope of this beginner project.


## Deployment
Here is a step by step deployment guide:

1. Download and extract the source files from this repository

1. Install [XAMPP](https://www.apachefriends.org/download.html)
  
2. From XAMPP, start **Apache** and **MySQL**

3. Navigate to http://localhost:80 on your web browser

4. Navigate to **phpMyAdmin**

5. Create a database called **service_website**

6. Use the import function on either **empty_database.sql** or **example_database.sql**


7. Run the server using node or nodemon by opening a clj (**Terminal** on MacOS or **cmd** on Windows),
   navigating to the project directory, and entering the following command.

   ```nodemon server.js```

8. If everything was done correctly, you should be provided with a link to the running website!


## User Guide
We have provided a guide to help users navigate the website:

[Guide](https://github.com/JemJemGermanie/Service-Website/blob/main/Deliverables/User%20Guide.pdf)

