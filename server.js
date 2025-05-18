
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { authenticateToken, SECRET_KEY } = require('./routes/middlewares/auth.js');

const app = express();
const port = 3000;

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'APOD API',
            version: '1.0.0',
            description: 'API for Astronomy Picture of the Day (APOD)',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/login', (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: 'Username required' });

    const user = { username, role: 'admin' }; 

    const token = jwt.sign(
        { username: user.username, role: user.role },
        SECRET_KEY,
        { expiresIn: '1h' }
    );
    res.json({ token });
});

require('./routes/routes.js')(app, fs, authenticateToken);

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`API documentation is available at http://localhost:${port}/api-docs`);
});
