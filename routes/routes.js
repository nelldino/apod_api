const pictureRouter = require ('./apod');
const appRouter = (app, fs) => {

    app.get('/', (req, res) => {
        res.send('Welcome to the API');
    });

    pictureRouter(app, fs);
};

module.exports=appRouter;