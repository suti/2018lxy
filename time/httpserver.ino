#include <Arduino.h>

File fsUploadFile;
ESP8266WebServer server(80);

void HttpServerStart()
{
  return server.handleClient();
}
String getContentType(String filename)
{
  if (server.hasArg("download"))
    return "application/octet-stream";
  else if (filename.endsWith(".htm"))
    return "text/html";
  else if (filename.endsWith(".html"))
    return "text/html";
  else if (filename.endsWith(".css"))
    return "text/css";
  else if (filename.endsWith(".js"))
    return "application/javascript";
  else if (filename.endsWith(".png"))
    return "image/png";
  else if (filename.endsWith(".gif"))
    return "image/gif";
  else if (filename.endsWith(".jpg"))
    return "image/jpeg";
  else if (filename.endsWith(".ico"))
    return "image/x-icon";
  else if (filename.endsWith(".xml"))
    return "text/xml";
  else if (filename.endsWith(".pdf"))
    return "application/x-pdf";
  else if (filename.endsWith(".zip"))
    return "application/x-zip";
  else if (filename.endsWith(".gz"))
    return "application/x-gzip";
  else if (filename.endsWith(".json"))
    return "application/json";
  return "text/plain";
}

bool handleFileRead(String path)
{
  Serial.println("handleFileRead: " + path);
  if (path.endsWith("/"))
    path += "index.htm";
  String contentType = getContentType(path);
  String pathWithGz = path + ".gz";
  if (SPIFFS.exists(pathWithGz) || SPIFFS.exists(path))
  {
    if (SPIFFS.exists(pathWithGz))
      path += ".gz";
    File file = SPIFFS.open(path, "r");
    size_t sent = server.streamFile(file, contentType);
    file.close();
    return true;
  }
  return false;
}

void handleFileUpload()
{
  if (server.uri() != "/edit")
    return;
  HTTPUpload &upload = server.upload();
  if (upload.status == UPLOAD_FILE_START)
  {
    String filename = upload.filename;
    if (!filename.startsWith("/"))
      filename = "/" + filename;
    Serial.print("handleFileUpload Name: ");
    Serial.println(filename);
    fsUploadFile = SPIFFS.open(filename, "w");
    filename = String();
  }
  else if (upload.status == UPLOAD_FILE_WRITE)
  {
    //DBG_OUTPUT_PORT.print("handleFileUpload Data: "); DBG_OUTPUT_PORT.println(upload.currentSize);
    if (fsUploadFile)
      fsUploadFile.write(upload.buf, upload.currentSize);
  }
  else if (upload.status == UPLOAD_FILE_END)
  {
    if (fsUploadFile)
      fsUploadFile.close();
    Serial.print("handleFileUpload Size: ");
    Serial.println(upload.totalSize);
  }
}
void jsonDatabaseUpload()
{
  File file;
  if (server.hasArg("time"))
    file = SPIFFS.open("/db/data/" + String(server.arg("time")), "w");
  else if (server.hasArg("user"))
    file = SPIFFS.open("/db/user.json", "w");
  else
    return server.send(200, "text/plain", "{'status':'fail,please post time or user'}");
  file.print(server.arg("json"));
  file.close();
  Serial.print("jsonDatabaseUpload:\n");
  Serial.println(server.arg("json"));
  server.send(200, "text/plain", "{'status':'sucess'}");
}

void dataSave()
{
  File file;
  if (server.hasArg("data"))
    file = SPIFFS.open("/db/user.json", "w");
  else
    return server.send(200, "text/plain", "{'status':'fail,please post time or user'}");
  file.print(server.arg("data"));
  file.close();
  Serial.print("dataSave:\n");
  Serial.println(server.arg("data"));
  server.send(200, "text/plain", "{'status':'success'}");
}

void blink()
{
  if (server.hasArg("id"))
    switch (server.arg("id").toInt())
    {
    case 1:
      digitalWrite(0, server.arg("value").toInt() == 1 ? LOW : HIGH);
      break;
    case 2:
      digitalWrite(2, server.arg("value").toInt() == 1 ? LOW : HIGH);
      break;
    case 3:
      digitalWrite(D5, server.arg("value").toInt() == 1 ? LOW : HIGH);
      break;
    case 4:
      digitalWrite(D6, server.arg("value").toInt() == 1 ? LOW : HIGH);
      break;
    }
  else
    return server.send(200, "text/plain", "{'status':'fail,please post time or user'}");
  Serial.println("blink: " + server.arg("id") + ' ' + server.arg("value"));
  server.send(200, "text/plain", "{'status':'success'}");
}

void handleFileDelete()
{
  if (server.args() == 0)
    return server.send(500, "text/plain", "BAD ARGS");
  String path = server.arg(0);
  Serial.println("handleFileDelete: " + path);
  if (path == "/")
    return server.send(500, "text/plain", "BAD PATH");
  if (!SPIFFS.exists(path))
    return server.send(404, "text/plain", "FileNotFound");
  SPIFFS.remove(path);
  server.send(200, "text/plain", "");
  path = String();
}

void handleFileCreate()
{
  if (server.args() == 0)
    return server.send(500, "text/plain", "BAD ARGS");
  String path = server.arg(0);
  Serial.println("handleFileCreate: " + path);
  if (path == "/")
    return server.send(500, "text/plain", "BAD PATH");
  if (SPIFFS.exists(path))
    return server.send(500, "text/plain", "FILE EXISTS");
  File file = SPIFFS.open(path, "w");
  if (file)
    file.close();
  else
    return server.send(500, "text/plain", "CREATE FAILED");
  server.send(200, "text/plain", "");
  path = String();
}

void handleFileList()
{
  if (!server.hasArg("dir"))
  {
    server.send(500, "text/plain", "BAD ARGS");
    return;
  }

  String path = server.arg("dir");
  Serial.println("handleFileList: " + path);
  Dir dir = SPIFFS.openDir(path);
  path = String();

  String output = "[";
  String filepath;
  while (dir.next())
  {
    File entry = dir.openFile("r");
    if (output != "[")
      output += ',';
    bool isDir = false;
    filepath = String(entry.name()).substring(1);
    output += "{\"type\":\"";
    output += (isDir) ? "dir" : "file";
    output += "\",\"filename\":\"";
    output += filepath.substring(filepath.lastIndexOf("/") + 1);
    output += "\",\"name\":\"";
    output += filepath;
    output += "\"}";
    entry.close();
  }

  output += "]";
  server.send(200, "text/json", output);
}
