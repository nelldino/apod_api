const pictureRouter = (app, fs) => {

    const dataPath = './data/apod.json';

    // READ all
    app.get('/apod', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                res.status(500).send('Error reading file');
                return;
            }
            res.send(JSON.parse(data));
        });
    });

    // READ by date
    app.get('/apod/date/:date', (req, res) => {
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
    //READ by liked pictures
    app.get('/apod/liked', (req, res) => {
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

    // CREATE
    app.post('/apod', (req, res) => {
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

    // UPDATE by date
    app.put('/apod/date/:date', (req, res) => {
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
 
    //UPDATE - like by date
    app.put('/apod/like/:date', (req, res) => {
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

    //UPDATE - unlike by date
    app.put('/apod/unlike/:date', (req, res) => {
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
    
    // DELETE by date
    app.delete('/apod/date/:date', (req, res) => {
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