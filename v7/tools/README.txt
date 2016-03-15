From: https://stackoverflow.com/questions/5778245/expressjs-how-to-structure-an-application/19724428#19724428

Directory server structure
├── cmd      // js pack command line code
├── public   // The public directory (client-side code)
└── server   // server code
    ├── app.js   // main entry
    ├── config   // The configuration of my applications (logger, global config, ...)
    ├── models   // The model data (e.g. Mongoose model)
    ├── routes   // The route definitions and implementations
    ├── services // The standalone services (Database service, Email service, ...)
    └── views    // The view rendered by the server to the client (e.g. Jade, EJS, ...)









