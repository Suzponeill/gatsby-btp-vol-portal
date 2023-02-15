<h1>Books to Prisoners Volunteer Portal</h1>

<h2>Description</h2>
<p>
This gatsby application reads from and writes to the Boks to Prisoners Volunteer Hours Google Sheet. Upon arrival, an admin will log into the site and then volunteers may check themselves in and out of their shifts.  This will obviate the need for an additional volunteer to manually transcribe a checkin sheet after the fact.  It is a serverless site with no back end and is deployed on the Gatsby Cloud
</p>

<h2>Core Dependencies</h2>
<ul>
  <li>Gatsby</li>
  <li>google-spreadsheet</li>
  <li>dotenv</li>
  <li>react (part of the gatsby initialization)</li> 
  <li>react-dom (part of the gatsby initialization)</li> 
</ul>

<h2>Webpack Dependencies</h2>
<ul>
  <li>assert</li>
  <li>crypto-browserify</li>
  <li>fs</li>
  <li>https-browserify</li>
  <li>os-browserify</li>
  <li>path-browserify</li>
  <li>stream-browserify</li>
  <li>url</li>
  <li>util</li>
</ul>

<h2>Set up Instructions</h2>
<ol>
  <li>install gatsby CLI with $npm install -g gatsby-cli</li>
  <li>create your app and follow prompts after $gatsby new</li>
  <li>Set up a service account, enable the google sheets API and create new keys for you target google sheet</li>
  <li>Add your service account email as an editor to your Google Sheet</li>
  <li>install dotenv</li>
  <li>Add your API keys to your .env</li>
  <li>Add this to your gatsby-config.js require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "production"}`,
});</li>
</ol>