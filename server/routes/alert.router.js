var express = require('express');
var router = express.Router();
var Alert = require('../models/alert');
var MobileMessage = require('../models/mobilemessage')
const requestIp = require('request-ip');

router.post('/',  (req,res,next) => {
  const alert = new Alert({
    type: req.body.type,
    source: req.body.source,
    ipaddr: requestIp.getClientIp(req),
    summary: req.body.summary,
    description: req.body.description,
    status: req.body.status,
    priority: req.body.priority,
    level: req.body.level,
    create_on: Date.now(),
    owner_by: req.body.owner_by
  });

  alert.save((err, alert) => {
    if (err) {
      return next(err);
    }
    const message = {
      message: "Alerts create successfully",
      data: alert
    }
    return res.status(201).json(message)
  });
});

router.get('/', (req,res,next) => {
  Alert.find({}).sort({create_on: -1}).exec( (err, alerts) => {
    return res.status(200).json(alerts);
  });
});

router.post('/mobile', (req,res,next) => {
  const mobilemassage = new MobileMessage({
    stop_group: req.body.stop_group,
    stop_id:  req.body.stop_id,
    title_line:  req.body.title_line,
    title_line_en:  req.body.title_line_en,
    notify_date:  req.body.notify_date,
    message:  req.body.message,
    message_en:  req.body.message_en
  })

  mobilemassage.save((err, alert) => {
    if (err) {
      return next(err);
    }
    const message = {
      message: "Message create successfully",
      data: alert
    }
    return res.status(201).json(message)
  });
 
});

router.get('/mobile', (req,res,next) =>{
  MobileMessage.find({}).sort({notify_date: -1}).exec( (err, alerts) => {
    return res.status(200).json(alerts);
  });
});
module.exports = router;
