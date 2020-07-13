const cctv = require('./process/cctv_process.js')

const cctv1 = new cctv('sawangpong@192.168.3.48','cctv') 


const getstatus = async function () {
    const status = await cctv1.getStatus();
    return status
}

cctv1.getStatus().then(result => {
    console.log(result)
})