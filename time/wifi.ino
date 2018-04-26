#include <Arduino.h>

const char* ssid = "Chuangkit";//"Andy-Router";
const char* password ="4008718211";//"Andy1234";
const char* host = "esp8266fs";

IPAddress local_IP(192,168,4,1);
IPAddress gateway(192,168,4,1);
IPAddress subnet(255,255,255,0);

void initWifi(){
    Serial.printf("Connecting to %s\n", ssid);
    if (String(WiFi.SSID()) != String(ssid)) {
      WiFi.mode(WIFI_AP_STA);
      Serial.print("Setting soft-AP configuration ... ");
      WiFi.softAPConfig(local_IP, gateway, subnet);
      // Serial.println( ? "Ready" : "Failed!");
      Serial.print("Setting soft-AP ... ");
      WiFi.softAP("ESP","Andy-Attence");
      // Serial.println( ? "Ready" : "Failed!");
      
      Serial.print("Soft-AP IP address = ");
      Serial.println(WiFi.softAPIP());
      WiFi.begin(ssid, password);
    }   
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
  Serial.println("");
  Serial.print("Connected! IP address: ");
  Serial.println(WiFi.localIP());
  MDNS.begin(host);
  Serial.print("Open http://");
  Serial.print(host);
  Serial.println(".local/edit to see the file browser");
}
  
