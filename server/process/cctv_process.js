const { exec } = require('child_process');

module.exports = function (ip,service) {
    // sawangpong@192.168.3.48
    this.ip = ip
    this.service = service
    this.getStatus = function() {
        
        const cmd = `systemctl --host  ${this.ip}  status  ${this.service}.service`
        console.log(cmd)
        return new Promise((resolve,reject) =>{ 
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                 console.warn(error);
                }
                resolve(stdout? stdout : stderr);
            });
        })
    }

    this.restart = function() {
        const cmd = `ssh  ${this.ip}  sudo systemctl restart  ${this.service}.service`
        console.log(cmd)
        return new Promise((resolve,reject) =>{ 
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                 console.warn(error);
                }
                resolve(stdout? stdout : stderr);
            });
        })
    }
}