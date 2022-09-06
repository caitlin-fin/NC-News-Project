const {selectTopics} = require('../models/topics.model')

exports.getTopics = (req, res) => {
    selectTopics().then((output) => {
        res.status(200).send({topics: output})
    }) 
}