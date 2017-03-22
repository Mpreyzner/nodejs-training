'use strict';

const mongoose = require('mongoose')
    , _ = require('lodash')
    , Schema = mongoose.Schema
    , schema = new Schema(
    {
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true},
    },
    {collection: `user_view`}
);

schema.pre('save', function (next) {
    //prepersist
    const now = new Date();

    if (this.isNew) {
        this.createdAt = now;
    }

    this.updatedAt = now;

    next();
});

module.exports = mongoose.model('UserView', schema);

