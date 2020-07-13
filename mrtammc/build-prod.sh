#!/bin/bash

unlink /home/sawangpong/app/mrtammcproj/mrtammc/dist/mrtammc/assets/dist/public
ng build --prod

sudo systemctl restart mrta-app1 && sudo systemctl restart mrta-app2

#unlink  /home/mee/AngularProj/mrtammcproj/mrtammc/dist/mrtammc/assets/dist/public  && ng build

#echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p