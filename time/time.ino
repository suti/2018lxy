#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <FS.h>
#include <Adafruit_Fingerprint.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>

int flag = 0;
int lastId = 0;
int fingerSatus = 0;
String dataStr;

int runFlag(int i){
  flag = i;
  return flag;
}

JsonObject& readFile2Json (void) {
  String str = "{\"test\":\"test\"}";
  File file = SPIFFS.open("/db/user.json","r");
  str = file.readString();
  file.close();
  DynamicJsonBuffer jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject(str);
  return root;
}

void setDataInfo(JsonObject& root){
  StaticJsonBuffer<256> jsonBuffer1;
  JsonObject& newJson = jsonBuffer1.createObject();
  StaticJsonBuffer<256> jsonBuffer;
  JsonObject& json = jsonBuffer.parseObject(dataStr);
  for (auto j : root) {
    JsonObject& nestJson = newJson.createNestedObject(String(j.key));
    nestJson["name"] = root[String(j.key)]["name"];
    nestJson["other"] = root[String(j.key)]["other"];
    if(json.containsKey(String(j.key))){
      nestJson["isOnline"] = json[String(j.key)]["isOnline"];
    } else {
      nestJson["isOnline"] = false;
    }
  }
  jsonBuffer.clear();
  jsonBuffer1.clear();
  newJson.printTo(dataStr);
  Serial.println(dataStr);
}

void setup(void){
  // pinMode(D8, OUTPUT);
  Serial.begin(115200);
  Serial.println("start!!");
  Serial.setDebugOutput(true);
  initSPIFFS();
  initWifi();
  initFingerprint();
  HttpServerRouter();
  JsonObject& root = readFile2Json();
  if(!root.success()){
    Serial.println("parser Json Error!");
  }else{
    setDataInfo(root);
  }
  
}

void loop(void){
  HttpServerStart();
  if(runFlag(flag) == 1){
    fingerSatus = getFingerprintID();
    // if(fingerSatus ==0 ) lastId = finger.fingerID;
    delay(500);
  }
}
