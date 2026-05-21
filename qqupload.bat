echo %1 %2 %3 %4
docker pull qqminiapp/build:latest
docker run -e PLUGIN_VERSION=%1 -e PLUGIN_DESC=%2 -e PLUGIN_APPTOKEN=%3 -e PLUGIN_BUILDUSER=ci -e PLUGIN_USEPACKAGEJSON=false -e PLUGIN_NPMBUILD=false -v "%4":"/tmp" -w /tmp "qqminiapp/build:latest"