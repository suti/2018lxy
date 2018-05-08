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

int runFlag(int i){
  flag = i;
  return flag;
}

void setup(void){
  // pinMode(D8, OUTPUT);
  Serial.begin(115200);
  Serial.print("start!!\n");
  Serial.setDebugOutput(true);
  initSPIFFS();
  initWifi();
  initFingerprint();
  HttpServerRouter();
}

void loop(void){
  HttpServerStart();
  if(runFlag(flag) == 1){
    fingerSatus = getFingerprintID();
    // if(fingerSatus ==0 ) lastId = finger.fingerID;
    delay(500);
  }
}
