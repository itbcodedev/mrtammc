#/bin/bash

unlink /home/sawangpong/app/mrtammc/mrtammc/dist/mrtammc/assets/dist/public
cd /home/sawangpong/app/mrtammc/mrtammc

ng build --prod

sudo systemctl restart  mrta-app1 && sudo systemctl restart mrta-app2
