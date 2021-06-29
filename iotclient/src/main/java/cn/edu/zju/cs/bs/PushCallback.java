package cn.edu.zju.cs.bs;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;
import org.bson.Document;
import com.mongodb.client.MongoDatabase;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttMessage;

public class PushCallback implements MqttCallback {
    private MongoDatabase mongoDatabase;

    public PushCallback(MongoDatabase db) {
        mongoDatabase = db;
    }

    public void connectionLost(Throwable cause) {
        System.out.println("connectionLost---------连接断开，可以做重连");
    }

    public void deliveryComplete(IMqttDeliveryToken token) {
        System.out.println("deliveryComplete---------" + token.isComplete());
    }

    public void messageArrived(String topic, MqttMessage message) throws Exception {
        //System.out.println("接收消息主题 : " + topic);
        //System.out.println("接收消息Qos : " + message.getQos());
        String res = new String(message.getPayload());
        System.out.println("接收消息内容 : " + res);
        Document document = Document.parse(res);

        String tempId = document.getString("clientId");
        String tempName = document.getString("deviceName");
        double tempLat = document.getDouble("lat");
        double tempLng = document.getDouble("lng");
        int tempVal = document.getInteger("value");
        int tempAlert = document.getInteger("alert");
        long tempTime = document.getLong("timestamp");
        Document equipment_document = new Document("deviceId", tempId).append("deviceName",tempName).append("lat", tempLat).append("lng", tempLng).append("value", tempVal).append("alert", tempAlert).append("time", tempTime);

        MongoCollection<Document> messages_collection = mongoDatabase.getCollection("messages");
        messages_collection.insertOne(document);
        MongoCollection<Document> equipments_collection = mongoDatabase.getCollection("equipments");
        equipments_collection.findOneAndReplace(Filters.eq("deviceId", tempId), equipment_document);
        //通过上下文的方式获取Service，然后在这个地方保存数据即可
    }
}
