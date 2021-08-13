## Inspiration
We came across this hackathon and wanted to help straight away.
Being fullstack developers we knew this was something we could build and in the process help JGI streamline their conservation science and mapping lifecycle. But conservation planning is very complex. Multiple review cycles, multiple stakeholders and what not.

## What it does

We have successfuly built an application that helps JGI to faster review, change, update and approve the changes to the Eastern Chimpanzee Range dynamic conservation maps. Leveraging Esri’s ArcGIS Online platform and the DocuSign eSignature API, we have hypothesised a frictionless process. This process makes commnunication between the multiple stakeholders & GIS Users a piece of cake.


## How we built it

It is full stack application built entirely using `Typescript`, `ReactJS` & `NodeJS`.

#### Frontend

 ReactJs & Material UI power the frontend of the application. The state management is made possible using Redux. Formik & Yup are used for making elegant forms with dynamic error handling. ArcGIS API For Javascript handles the maps in the application.
 The map is edited in the web application itself using the Editor widget. The stakeholders can use the Sketch Widget to draw on the shared eastern chimpanzee ranges map new points, lines, or polygons. How do we save these Sketch Maps? These Sketch maps are uploaded in an S3 bucket as high-resolution images.

#### Backend

Nodejs and Typescript are used to build the backend. Express is used as a middleware to handle incoming requests from the React-based frontend. A PostgreSQL database hosted on elephantsql.com serves as the data store for the application to keep track of the audit data, the user data & the revision request data. TypeORM is an ORM (Object-relational Mapper) that is used with the Nodejs backend to connect to the SQL database.


 #### DocuSign Usage

 We use the JWT Grant authentication along with the eSignature API. This is because we want the Stakeholders to sign documents irrespective of whether they have a DocuSign account or not. To enable a smooth user flow, we use embedded signing. The Audit Reports are made using PDFkit. The audit report contains the following data - name of the audit, start date, end date, stakeholder details, revision requests & map URLs.  The stakeholders can sign the final audit report from within the app. We also use the anchor tabs to get the name, email & signature of the signer.

## Challenges we ran into
Where do I begin?

Firstly, understanding the problem that Jane Goodall Institute is trying to solve.


![Add a heading](https://user-images.githubusercontent.com/42542489/129284865-8555bc51-9dec-43d3-9483-a51663e5ae6f.png)


## Accomplishments that we're proud of

We were able to build an end-to-end solution for Jane Goodall Institute within the hackathon period. Hope they can use it to save the Chimpanzees in the Eastern Chimpanzee Range. Working as a team of 2 we were able to design a decent UI for the Stakeholders & ArcGIS users.


## What we learned
<ol>
<li>Setting up a fullstack MERN application</li>
<li>Managing multiple codebases</li>
<li>Setting up a REST API with Nodejs</li>
<li>Deployment to Linode.</li>
</ol>

## What's next for Save Chimps ❤️

<ol>
<li>We plan to work with the Jane Goodall Institute to improve the application.</li>
<li>Making the application better suited to solve real-world collaboration problems</li>
<li>Work in production DocuSign environments</li>
<li>Tweek the User Interfaces & Dashboards to display more relevant data</li>
<li>
Enable email notifications for all the Stakeholders & Chimpanzee experts.
</li>


</ol>

