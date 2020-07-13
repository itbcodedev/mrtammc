
const blue_chalearm_path_in = require('./parted_blue_chalearm_in.json')
const blue_chalearm_path_out = require('./parted_blue_chalearm_out.json')
// const blue_in = require('./blue_in.json')
//const blue_out = require('./blue_out.json')
const blue_in = require('./BlueLine_in.json')
const blue_out = require('./BlueLine_out.json')
const purple_1_in = require('./purple_1_in.json')
const purple_1_out = require('./purple_1_out.json')
const purple_2_in = require('./purple_2_in.json')
const purple_2_out = require('./purple_2_out.json')

const purple_3_in = require('./purple_3_in.json')
const purple_3_out = require('./purple_3_out.json')
const purple_4_in = require('./purple_4_in.json')
const purple_4_out = require('./purple_4_out.json')

const purple_5_in = require('./purple_5_in.json')
const purple_5_out = require('./purple_5_out.json')
const purple_6_in = require('./purple_6_in.json')
const purple_6_out = require('./purple_6_out.json')

const purple_7_in = require('./purple_7_in.json')
const purple_7_out = require('./purple_7_out.json')
const purple_8_in = require('./purple_8_in.json')
const purple_8_out = require('./purple_8_out.json')

const purplenorth_in = require('./purplenorthline_in.json')
const purplenorth_out = require('./purplenorthline_out.json')


exports.blue_chalearm_path_in  = blue_chalearm_path_in
exports.blue_chalearm_path_out = blue_chalearm_path_out

exports.blue_in = blue_in
exports.blue_out = blue_out
exports.purple_1_in = purple_1_in
exports.purple_1_out = purple_1_out
exports.purple_2_in = purple_2_in
exports.purple_2_out = purple_2_out

exports.purple_3_in = purple_3_in
exports.purple_3_out = purple_3_out
exports.purple_4_in = purple_4_in
exports.purple_4_out = purple_4_out

exports.purple_5_in = purple_5_in
exports.purple_5_out = purple_5_out
exports.purple_6_in = purple_6_in
exports.purple_6_out = purple_6_out

exports.purple_7_in = purple_7_in
exports.purple_7_out = purple_7_out
exports.purple_8_in = purple_8_in
exports.purple_8_out = purple_8_out

exports.purplenorth_in = purplenorth_in
exports.purplenorth_out = purplenorth_out


exports.config = [
  {
    route_name: "blue", direction: "0", file: "blue_in"
  },
  {
    route_name: "blue", direction: "1", file: "blue_out"
  },
  {
    route_name: "purple", direction: "0",  file: "purplenorth_in"
  },
  {
    route_name: "purple", direction: "1",  file: "purplenorth_out"
  }
]

// in - 0, out - 1