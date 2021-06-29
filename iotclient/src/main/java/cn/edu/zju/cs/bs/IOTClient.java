package cn.edu.zju.cs.bs;

import java.io.FileInputStream;
import java.util.Date;
import java.util.Properties;
import java.util.Random;
import java.util.Vector;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoCollection;
import org.bson.Document;

public class IOTClient {
    public static void main(String[] args) {
        int devices = 1;
        String mqttServer = "tcp://localhost:1883";
        String topic = "testapp";
        String clientPrefix = "device";

        try {
            // 连接到 mongodb 服务
            MongoClient mongoClient = new MongoClient( "localhost" , 27017 );

            // 连接到数据库
            MongoDatabase mongoDatabase = mongoClient.getDatabase("iotdb");
            System.out.println("Connect to database successfully");

            try{
                mongoDatabase.getCollection("messages").drop();
                mongoDatabase.getCollection("equipments").drop();
            } catch (Exception e) {
                System.out.println("messages集合和equipments不存在！");
            }

            mongoDatabase.createCollection("messages");
            System.out.println("messages集合创建成功");
            mongoDatabase.createCollection("equipments");
            System.out.println("equipments集合创建成功");

            MongoCollection<Document> equipments_collection = mongoDatabase.getCollection("equipments");

            Properties properties = new Properties();
            FileInputStream in = new FileInputStream("iot.properties");
            properties.load(in);
            devices = Integer.parseInt(properties.getProperty("devices"));
            mqttServer = properties.getProperty("server");
            topic = properties.getProperty("topic");
            clientPrefix = properties.getProperty("prefix");
            String[] nameArray={"A","B","C","D","E","F","G","H","I","J","K","L","M","N","X","Y","Z"};
            Random rand = new Random();

            Vector<WorkerThread> threadVector = new Vector<WorkerThread>();
            for (int i = 0; i < devices; i++) {
                String randName = nameArray[rand.nextInt(16)] + nameArray[rand.nextInt(16)] + rand.nextInt(9) + "传感器";
                String deviceId = clientPrefix + String.format("%04d", i+1);
                Date now = new Date();
                Document document = new Document("deviceId", deviceId).append("deviceName",randName).append("lat", 30.10850400924683).append("lng", 120.41139966249466).append("value", 0).append("alert", 0).append("time", now.getTime());
                equipments_collection.insertOne(document);
                WorkerThread thread = new WorkerThread();
                thread.setDeviceId(i + 1);
                thread.setMqttServer(mqttServer);
                thread.setTopic(topic);
                thread.setClientPrefix(clientPrefix);
                thread.setDeviceName(randName);
                threadVector.add(thread);
                thread.start();
            }
            GetDataThread dataThread = new GetDataThread();
            dataThread.setDeviceId(devices + 1);
            dataThread.setMqttServer(mqttServer);
            dataThread.setTopic(topic);
            dataThread.setClientPrefix(clientPrefix);
            dataThread.setMongoDatabase(mongoDatabase);
            dataThread.start();
            for (WorkerThread thread : threadVector) {
                thread.join();
            }
            dataThread.join();
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println( e.getClass().getName() + ": " + e.getMessage() );
        }
    }
}
