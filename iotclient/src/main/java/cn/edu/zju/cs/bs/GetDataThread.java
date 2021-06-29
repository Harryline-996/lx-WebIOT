package cn.edu.zju.cs.bs;

import com.mongodb.client.MongoDatabase;
import lombok.Data;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;
import com.alibaba.fastjson.JSONObject;

@Data
public class GetDataThread extends Thread {
    private boolean running = true;
    private int deviceId;
    private String mqttServer;
    private String topic;
    private String clientPrefix;
    private MongoDatabase mongoDatabase;

    public void run() {
        try {
            String clientId;
            String content;
            int qos = 2;
            MemoryPersistence persistence = new MemoryPersistence();

            Random rand = new Random();

            clientId = clientPrefix + String.format("%04d", deviceId);
            MqttClient mqttClient = new MqttClient(mqttServer, clientId, persistence);
            MqttConnectOptions connOpts = new MqttConnectOptions();
            connOpts.setCleanSession(true);
            mqttClient.setCallback(new PushCallback(mongoDatabase));
            System.out.println("Connecting to broker: " + mqttServer);
            mqttClient.connect(connOpts);
            System.out.println("Connected");
            mqttClient.subscribe(topic);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}


