## 1 文件结构说明

- report 文件夹：所有的文档，包括设计文档和系统文档，系统文档中又包含了使用手册、测试报告以及开发体会与小结
- src 文件夹：源代码
  - iotclient 文件夹：物联网设备模拟器工程文件夹，且在老师提供代码的基础上添加了接收相应数据并存储到本地MongoDB数据库的功能
  
  - lx-WebIOT 文件夹：物联网应用网站工程文件夹
  
    

## 2 项目运行配置说明

- 操作系统：Windows 10 64bit
- 开发工具：IntelliJ IDEA 2020.2.1 x64 
- 依赖环境
  - [node.js  v14.16.1](http://nodejs.cn/download/current/)
  - [JDK 1.8](https://www.oracle.com/cn/java/technologies/javase/javase-jdk8-downloads.html)
  - [mosquitto-2.0.10](https://mosquitto.org/download/)
  - [MongoDB-4.2.14](https://www.mongodb.com/try/download/community)
  - [Maven 3.8.1](http://maven.apache.org/download.cgi)



#### 2.1 运行物联网设备模拟器与接收器

1. 启动mosquitto服务与MongoDB服务，最好是没有用户验证，如果有则需要修改iotclient中有关连接MQTT服务器和连接MongoDB数据库的代码

2. 使用IntelliJ IDEA打开iotclient文件夹，或者直接在命令行进入该文件夹

3. 在terminal中运行以下命令进行代码编译

   ``` java
   mvn clean package
   ```

4. 进入代码编译生成的target文件夹，将iot.properties文件放在iotclient-1.0.0.jar同一目录，根据需求修改iot.properties配置，然后在terminal中运行以下命令来启动程序

   ``` java
   java -jar iotclient-1.0.0.jar
   ```

5. 经过以上操作后，物联网设备模拟器将不断产生模拟数据，并存储到MongoDB数据库中



#### 2.2 运行物联网网站

1. 使用IntelliJ IDEA打开lx-WebIOT文件夹，或者直接在命令行进入该文件夹

2. 在terminal中运行以下命令来安装项目依赖

   ``` java
   npm install
   ```

3. 项目依赖安装完成后，在terminal中运行以下命令来使用webpack将前端项目打包为静态文件，生成dist目录

   ``` java
   npm run build:prod
   ```

4. dist目录生成后，在terminal中运行以下命令来启动服务端

   ```java
   npm run start
   ```

5. 启动成功之后，访问http://localhost:3000/即可访问物联网应用网站



> 注：没有提供MongoDB的建库建表文件，这是因为在运行物联网设备模拟器与接收器时，会自动建立iotdb数据库，equipments表和messages表。在运行物联网网站后如果进行注册，会自动建立users表。
