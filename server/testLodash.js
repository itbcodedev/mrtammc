const _ = require("lodash")

const ver = _.VERSION
console.log(ver); 

// _.each() iterates, _.map() projects, i.e. builds a new array from the one passed as input, using the function you specify to build the new elements
const tours = [{"id":1,"price":200, prop: 'prop1' },{"id":1,"price":300, prop: 'prop1'},{"id":3,"price":150},{"id":2,"price":110},{"id":3,"price":120},{"id":2,"price":100}];
const out1 = _.each(tours, (doc) => {
    doc.add = doc.price - 112
})
const out2 = _.filter(out1, (doc) => { 
    return doc.add >= 0 
})



// filter 
const result = _.minBy(tours, "add")

console.log(result)
console.log(out1)
console.log(out2)

const result2 = _.minBy(out2, "add")
console.log(result2)