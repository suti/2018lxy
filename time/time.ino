#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <FS.h>
#include <Adafruit_Fingerprint.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>
// extern "C" {
// #include "user_interface.h"
// }

int flag = 0;
int lastId = 0;
int fingerStatus = 0;
String dataStr;

// int runFlag(int i){
//   flag = i;
//   return flag;
// }

void setup(void)
{
  pinMode(0, OUTPUT);
  pinMode(2, OUTPUT);
  pinMode(D5, OUTPUT);
  pinMode(D6, OUTPUT);
  digitalWrite(0, HIGH);
  digitalWrite(2, HIGH);
  digitalWrite(D5, HIGH);
  digitalWrite(D6, HIGH);
  Serial.begin(115200);
  Serial.println("start!!");
  Serial.setDebugOutput(true);
  initSPIFFS();
  initWifi();
  initFingerprint();
  HttpServerRouter();
}

void loop(void)
{
  HttpServerStart();
}
