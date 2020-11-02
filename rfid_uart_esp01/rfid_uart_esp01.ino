#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <MFRC522.h>
#include "TagManager.hpp"
using namespace TagManager;

// Replace with your network credentials
const char* ssid     = "Lucas";
const char* password = "982198151";
ESP8266WebServer server(80);

unsigned long antes = 0;
MFRC522_UART mfrc522(2);
MFRC522 rfid(&mfrc522);

void setup() {
  initTagManager();
  
  // Connect to Wi-Fi network with SSID and password
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  
  // Webserver
  server.on("/addTag", HTTP_POST, handleAddTag);
  server.on("/removeTag", HTTP_POST, handleRemoveTag);
  server.on("/removePending", HTTP_POST, handleRemovePending);
  server.on("/approved", HTTP_POST, handleApproved);
  server.on("/pending", HTTP_POST, handlePending);
  server.on("/", HTTP_GET, handleRequest);
  server.onNotFound(handleRequest);
  server.begin();

  // MDNS
  MDNS.begin("rfid");

  // RFID
  rfid.PCD_Init();
  rfid.PCD_SetAntennaGain(MFRC522::RxGain_max);
}

void loop(){
  server.handleClient();
  MDNS.update();
  char tagCode[20] = { 0 };

  unsigned long agora = millis();
  if ((agora - antes) > 100) {
    antes = agora;
    if (rfid.PICC_IsNewCardPresent()) {
      if (rfid.PICC_ReadCardSerial()) {
        bytesToHexString(rfid.uid.uidByte, rfid.uid.size, tagCode);
        if (isTagAllowed(tagCode)) {
          
        } else {
          addPending(tagCode);
        }
      }
    }
  }
}

void handleRequest() {
  String path = server.uri();
  if (path.indexOf('.') < 0) path = "/public/index.html";
  
  if (SPIFFS.exists(path)) {
    File file = SPIFFS.open(path, "r");
    server.streamFile(file, "text/html");
    file.close();
  } else {
    server.send(404, "text/plain", "Sem sorte!");
  }
}

void handleAddTag() {
  int separator = server.arg("plain").indexOf(',');
  if (separator > 0) {
    String code = server.arg("plain").substring(0, separator);
    String owner = server.arg("plain").substring(separator + 1);

    if (owner.length() > 0 && allowPending(code.c_str(), owner.c_str())) {
      server.send(200, "text/plain", "OK");
    } else {
      server.send(400, "text/plain", "Formato incorreto!");
    }
  }
  server.send(200, "text/plain", "OK");
}

void handleRemoveTag() {
  if (disallowTag(server.arg("plain").c_str())) {
    server.send(200, "text/plain", "OK");
  } else {
    server.send(404, "text/plain", "Registro não encontrado");
  }
}

void handleRemovePending() {
  if (removePending(server.arg("plain").c_str())) {
    server.send(200, "text/plain", "OK");
  } else {
    server.send(404, "text/plain", "Registro não encontrado");
  }
}

void handleApproved() {
  sendFile(server, ALLOWED_FILE_PATH);
}

void handlePending() {
  sendFile(server, PENDING_FILE_PATH);
}

void sendFile(ESP8266WebServer& server, const char* path) {
  if (SPIFFS.exists(path)) {
    File file = SPIFFS.open(path, "r");
    if (file) {
      server.streamFile(file, "text/plain");
    } else {
      server.send(404, "Not found!");
    }
  }
}

// outBuffer deve ter no mínimo o dobro de len
void bytesToHexString(const byte* values, int len, char* outBuffer) {
  for (int i = 0, j = 0; i < len; ++i,  j += 2) {
   sprintf(&outBuffer[j], "%02x", values[i]);
  }
}
