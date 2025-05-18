const pictureRouter = (app, fs) => {

    const dataPath = './data/apod.json';

    const { authenticateToken, authorizeRole } = require('./middlewares/auth.js');
    /**
    * @swagger
    * /apod:
    *   get:
    *     summary: Get all APOD entries
    *     responses:
    *       200:
    *         description: List of APOD entries
    *         content:
    *           application/json:
    *             schema:
    *               type: array
    *               items:
    *                 type: object
    */

    // READ all
    app.get('/apod', authenticateToken, (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                res.status(500).send('Error reading file');
                return;
            }
            res.send(JSON.parse(data));
        });
    });

    /**
     * @swagger
     * /apod/date/{date}:
     *   get:
     *     summary: Get APOD by date
     *     tags: [APOD]
     *     parameters:
     *       - in: path
     *         name: date
     *         schema:
     *           type: string
     *         required: true
     *         description: Date of the APOD entry
     *     responses:
     *       200:
     *         description: APOD found
     *       404:
     *         description: APOD not found
     */
    // READ by date
    app.get('/apod/date/:date',authenticateToken, (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                res.status(500).send('Error reading file');
                return;
            }
            const apods = JSON.parse(data);
            const apod = apods.find(a => a.date === req.params.date);
            if (!apod) {
                res.status(404).send('APOD not found');
                return;
            }
            res.send(apod);
        });
    });

    /**
     * @swagger
     * /apod/liked:
     *   get:
     *     summary: Get all liked APODs
     *     tags: [APOD]
     *     responses:
     *       200:
     *         description: List of liked APODs
     */

    //READ by liked pictures
    app.get('/apod/liked', authenticateToken,(req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                res.status(500).send('Error reading file');
                return;
            }
            const apods = JSON.parse(data);
            const likedApods = apods.filter(a => a.liked === true);
            res.send(likedApods);
        });
    });

    /**
     * @swagger
     * /apod:
     *   post:
     *     summary: Create a new APOD entry
     *     tags: [APOD]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *     responses:
     *       201:
     *         description: APOD created
     *       500:
     *         description: Error writing file
     */
    // CREATE
    app.post('/apod', authenticateToken, authorizeRole('admin'), (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                res.status(500).send('Error reading file');
                return;
            }
            const apods = JSON.parse(data);
            const newApod = req.body;
            apods.push(newApod);
            fs.writeFile(dataPath, JSON.stringify(apods, null, 2), err => {
                if (err) {
                    res.status(500).send('Error writing file');
                    return;
                }
                res.status(201).send(newApod);
            });
        });
    });

    /**
     * @swagger
     * /apod/date/{date}:
     *   put:
     *     summary: Update an APOD entry by date
     *     tags: [APOD]
     *     parameters:
     *       - in: path
     *         name: date
     *         schema:
     *           type: string
     *         required: true
     *         description: Date of the APOD entry
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *     responses:
     *       200:
     *         description: APOD updated
     *       404:
     *         description: APOD not found
     */

    // UPDATE by date
    app.put('/apod/date/:date', authenticateToken, authorizeRole('admin'), (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }
        let apods = JSON.parse(data);
        const apodIndex = apods.findIndex(a => a.date === req.params.date);
        if (apodIndex === -1) {
            res.status(404).send('APOD not found');
            return;
        }
        apods[apodIndex] = { ...apods[apodIndex], ...req.body };
        fs.writeFile(dataPath, JSON.stringify(apods, null, 2), err => {
            if (err) {
                res.status(500).send('Error writing file');
                return;
            }
            res.send(apods[apodIndex]);
        });
    });
});
 
     /**
     * @swagger
     * /apod/like/{date}:
     *   put:
     *     summary: Toggle like for an APOD by date
     *     tags: [APOD]
     *     parameters:
     *       - in: path
     *         name: date
     *         schema:
     *           type: string
     *         required: true
     *         description: Date of the APOD entry
     *     responses:
     *       200:
     *         description: APOD like toggled
     *       404:
     *         description: APOD not found
     */

    //UPDATE - like by date
    app.put('/apod/like/:date',  authenticateToken, authorizeRole('admin'),(req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                res.status(500).send('Error reading file');
                return;
            }
            let apods = JSON.parse(data);
            const apodIndex = apods.findIndex(a => a.date === req.params.date);
            if (apodIndex === -1) {
                res.status(404).send('APOD not found');
                return;
            }
            apods[apodIndex].liked = !apods[apodIndex].liked;
            fs.writeFile(dataPath, JSON.stringify(apods, null, 2), err => {
                if (err) {
                    res.status(500).send('Error writing file');
                    return;
                }
                res.send(apods[apodIndex]);
            });
        });
    });

     /**
     * @swagger
     * /apod/unlike/{date}:
     *   put:
     *     summary: Unlike an APOD entry by date
     *     tags: [APOD]
     *     parameters:
     *       - in: path
     *         name: date
     *         schema:
     *           type: string
     *         required: true
     *         description: Date of the APOD entry
     *     responses:
     *       200:
     *         description: APOD unliked
     *       404:
     *         description: APOD not found
     */
    //UPDATE - unlike by date
    app.put('/apod/unlike/:date',  authenticateToken, authorizeRole('admin'),(req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                res.status(500).send('Error reading file');
                return;
            }
            let apods = JSON.parse(data);
            const apodIndex = apods.findIndex(a => a.date === req.params.date);
            if (apodIndex === -1) {
                res.status(404).send('APOD not found');
                return;
            }
            apods[apodIndex].liked = false;
            fs.writeFile(dataPath, JSON.stringify(apods, null, 2), err => {
                if (err) {
                    res.status(500).send('Error writing file');
                    return;
                }
                res.send(apods[apodIndex]);
            });
        });
    });

    /**
     * @swagger
     * /apod/date/{date}:
     *   delete:
     *     summary: Delete an APOD entry by date
     *     tags: [APOD]
     *     parameters:
     *       - in: path
     *         name: date
     *         schema:
     *           type: string
     *         required: true
     *         description: Date of the APOD entry
     *     responses:
     *       200:
     *         description: APOD deleted
     *       404:
     *         description: APOD not found
     */
    // DELETE by date
    app.delete('/apod/date/:date', authenticateToken, authorizeRole('admin'), (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }
        let apods = JSON.parse(data);
        const apodIndex = apods.findIndex(a => a.date === req.params.date);
        if (apodIndex === -1) {
            res.status(404).send('APOD not found');
            return;
        }
        const deleted = apods.splice(apodIndex, 1);
        fs.writeFile(dataPath, JSON.stringify(apods, null, 2), err => {
            if (err) {
                res.status(500).send('Error writing file');
                return;
            }
            res.send(deleted[0]);
        });
    });
});
}

module.exports = pictureRouter;