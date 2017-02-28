# SphereCase


1. 先运行 `npm i` 命令安装好依赖

2. 如果安装依赖很慢, 先在全局环境 nrm, 它用来方便切换npm的镜像源:

`npm i -g nrm`,

之后使用 `nrm ls` 可以列出可切换的镜像,

使用 `nrm use taobao` 切换成taobao的镜像或列表给出的其他镜像

然后就可以忘记它了, 以后正常 使用npm命令安装模块即可

3. 先使用 `npm run s` 把项目编译一遍, 编译后的文件在 `dist` 目录

4. 再运行 `gulp bs` 运行 运行这个命令之前你可能需要先安装好`browsersync`

** 这个项目现在应该已经跑起来了, 如果你的浏览器默认打开不是chrome, 关掉, 看看你的_控制台_给你的网址: `localhost:3000`, 在手动在chrome打开**
