#include <Arduino.h>

// int runFlag(int);

void HttpServerRouter()
{

    server.on("/list", HTTP_GET, handleFileList);
    server.on("/edit", HTTP_GET, []() {
        if (!handleFileRead("/edit.htm"))
            server.send(404, "text/plain", "FileNotFound");
    });
    server.on("/edit", HTTP_PUT, handleFileCreate);
    server.on("/edit", HTTP_DELETE, handleFileDelete);
    server.on("/edit", HTTP_POST, []() { server.send(200, "text/plain", ""); }, handleFileUpload);
    server.onNotFound([]() {
        if (!handleFileRead(server.uri()))
            server.send(404, "text/plain", "FileNotFound");
    });
    server.on("/save", HTTP_POST, jsonDatabaseUpload);

    server.on("/apiSaveData", HTTP_POST, dataSave);
    server.on("/apiLastId", HTTP_GET, []() {
        StaticJsonBuffer<50> jsonBuffer;
        JsonObject &JsonRoot = jsonBuffer.createObject();
        JsonRoot["id"] = lastId;
        String output;
        JsonRoot.printTo(output);
        server.send(200, "text/plain", output);
    });
    server.on("/apiFingerStatus", HTTP_GET, []() {
        StaticJsonBuffer<50> jsonBuffer;
        JsonObject &JsonRoot = jsonBuffer.createObject();
        JsonRoot["fingerStatus"] = fingerStatus;
        String output;
        JsonRoot.printTo(output);
        server.send(200, "text/plain", output);
    });
    server.on("/apiRun", HTTP_GET, []() {
        StaticJsonBuffer<50> jsonBuffer;
        JsonObject &JsonRoot = jsonBuffer.createObject();
        JsonRoot["status"] = 1;
        int count = 0;
        while (count < 3)
        {
            fingerStatus = getFingerprintID();
            if (fingerStatus != 2)
            {
                break;
            }
            count++;
        }
        JsonRoot["fingerStatus"] = fingerStatus;
        String output;
        JsonRoot.printTo(output);
        server.send(200, "text/plain", output);
    });
    server.on("/apiStop", HTTP_GET, []() {
        //   runFlag(0);
        StaticJsonBuffer<50> jsonBuffer;
        JsonObject &JsonRoot = jsonBuffer.createObject();
        JsonRoot["status"] = 1;
        String output;
        JsonRoot.printTo(output);
        server.send(200, "text/plain", output);
    });
    server.on("/apiGetImage", HTTP_GET, []() {
        StaticJsonBuffer<50> jsonBuffer;
        JsonObject &JsonRoot = jsonBuffer.createObject();
        int count = 0;
        int fingerStatus = 2;
        while (count < 3)
        {
            fingerStatus = apiGetImage();
            if (fingerStatus != 2)
            {
                break;
            }
            count++;
        }
        JsonRoot["status"] = fingerStatus;
        String output;
        JsonRoot.printTo(output);
        server.send(200, "text/plain", output);
    });
    server.on("/apiImage2Tz1", HTTP_GET, []() {
        StaticJsonBuffer<50> jsonBuffer;
        JsonObject &JsonRoot = jsonBuffer.createObject();
        JsonRoot["status"] = apiImage2Tz(1);
        String output;
        JsonRoot.printTo(output);
        server.send(200, "text/plain", output);
    });
    server.on("/apiImage2Tz2", HTTP_GET, []() {
        StaticJsonBuffer<50> jsonBuffer;
        JsonObject &JsonRoot = jsonBuffer.createObject();
        JsonRoot["status"] = apiImage2Tz(2);
        String output;
        JsonRoot.printTo(output);
        server.send(200, "text/plain", output);
    });
    server.on("/apiStorefinger", HTTP_POST, []() {
        if (!server.hasArg("fingerId"))
        {
            return server.send(200, "text/plain", "{status: 15}");
        }
        StaticJsonBuffer<50> jsonBuffer;
        JsonObject &JsonRoot = jsonBuffer.createObject();
        JsonRoot["status"] = apiStoreFinger(server.arg("fingerId").toInt());
        String output;
        JsonRoot.printTo(output);
        server.send(200, "text/plain", output);
    });
    server.on("/apiDeletefinger", HTTP_POST, []() {
        if (!server.hasArg("fingerId"))
        {
            return server.send(200, "text/plain", "{status: 15}");
        }
        StaticJsonBuffer<50> jsonBuffer;
        JsonObject &JsonRoot = jsonBuffer.createObject();
        JsonRoot["status"] = deleteFingerprint(server.arg("fingerId").toInt());
        String output;
        JsonRoot.printTo(output);
        server.send(200, "text/plain", output);
    });
    server.on("/apiScan", HTTP_GET, []() {
        uint8_t fingerStatus = 0;
        for (char i = 0; i < 3; i++)
        {
            fingerStatus = getFingerprintID();
            Serial.println(fingerStatus);
            if (fingerStatus == FINGERPRINT_OK)
            {
                break;
            }
        }
        if (fingerStatus == FINGERPRINT_OK)
        {
            StaticJsonBuffer<100> jsonBuffer;
            JsonObject &JsonRoot = jsonBuffer.createObject();
            //  JsonRoot["name"] = "食指君";
            JsonRoot["fingerId"] = getFingerID();
            JsonRoot["status"] = 0;
            String output;
            JsonRoot.printTo(output);
            server.send(200, "text/plain", String(output));
        }
        else
        {
            StaticJsonBuffer<100> jsonBuffer;
            JsonObject &JsonRoot = jsonBuffer.createObject();
            JsonRoot["status"] = fingerStatus;
            String output;
            JsonRoot.printTo(output);
            server.send(200, "text/json", output);
        }
    });
    server.on("/all", HTTP_GET, []() {
        String json = "{";
        json += "\"heap\":" + String(ESP.getFreeHeap());
        json += ", \"analog\":" + String(analogRead(A0));
        json += ", \"gpio\":" + String((uint32_t)(((GPI | GPO) & 0xFFFF) | ((GP16I & 0x01) << 16)));
        json += "}";
        server.send(200, "text/json", json);
        json = String();
    });
    server.begin();
    Serial.println("HTTP server started");
}
