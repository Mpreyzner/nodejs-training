#!/usr/bin/env node

'use strict';

require('dotenv').config();

const debug = require('debug')('intern2-node-register-kornel:server')
    , async = require('async')

    , RabbitMq = require('../lib/rabbit_mq.js')
    , rabbitMq = new RabbitMq({connectionUri: process.env.RABBITMQ_URI})
    , _ = require('lodash')
;

const nodemailer = require('nodemailer');
let smtpuri = process.env.SMTP_URI;

let defaults = {};

const transporter = nodemailer.createTransport(smtpuri, defaults);


async.waterfall([
    (next) => {
        // INIT RABBIT CONNECTION
        rabbitMq.init((err) => {
            if (err) {
                console.error(`rabbitMq initialization error: ${err.message}`);
                return next(err);
            }

            next(null);
        });
    },
    (next) => {

        rabbitMq.getSubscriber({
                exchange: {
                    name: `ex-events-${_.snakeCase(process.env.TEAM_NAME)}`,
                    type: 'topic'
                },
                queue: {
                    name: `${_.snakeCase(process.env.TEAM_NAME)}_events`
                },
                routing: ['user_registration_event']
            }
            , (err, queue) => {
                if (err) {
                    console.error(`CreateSubscriber error: ${err.message}`);
                    return next(err);
                }

                queue.subscribe({
                    ack: true,
                    prefetchCount: 100
                }, (event, headers, deliveryInfo, ack) => {
                    console.log(`Got event: ${JSON.stringify(event)}`);

                    // let data = JSON.parse(event);
                    console.log(event.email);
                    let email = {
                        from: 'test@test.com',
                        to: process.env.EMAIL_RECIPIENT,
                        subject: 'Trzy kurczaki',
                        text: `Hello ${event.firstname} ${event.lastname}. Thanks for  reigtsering 
                        your mails is ${event.email}`,
                    };
                    let callback = (err, info) => {
                        if (err) {
                            console.log(err);
                            ack.reject(true);
                            return next(err);

                        }
                        console.log(info);
                        ack.acknowledge(false);
                    };
                    transporter.sendMail(email, callback);
                });

            });


    },

], (err) => {
    if (err) {
        process.exit(1);
    }

    console.log(`Email service launched`);
});
