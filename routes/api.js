const router = require('express').Router();
const Workout = require('../models/workout');
const path = require('path');
const mongoose = require('mongoose');

router.get('/', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, "../public")});
});

router.get('/api/workouts', (req, res) => {
    Workout.find({}).sort({date: 1}).then(data => {
        res.send(data);
    });
});

router.post('/api/workouts', ({body}, res) => {
    Workout.create(body).then(data => {
        res.json(data);
    });
});

router.get('/exercise', (req, res) => {
    res.sendFile('exercise.html', {root: path.join(__dirname, "../public")});
});

router.put('/api/workouts/:id', (req, res) => {
    Workout.updateOne({_id: req.params.id}, {$push: {exercises:  req.body}, $inc: {totalDuration: req.body.duration}})
    .then(data => {
        res.json(data);
    });
});

router.get('/stats', (req, res) => {
    res.sendFile('stats.html', {root: path.join(__dirname, "../public")});
});

router.get('/api/workouts/range', (req, res) => {
    Workout.aggregate([{
        $addFields: {
            totalWeight: {
                $sum: '$exercises.weight'
            }
        }
    }]).then(workouts => {
        res.send(workouts.filter(workout => {
            return new Date(workout.day) >= new Date(new Date().setDate(new Date().getDate() - 7))
        }));
    });
});

module.exports = router;