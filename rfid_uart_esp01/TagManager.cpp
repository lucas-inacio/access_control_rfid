#include "TagManager.hpp"
#include <Arduino.h>
#include <FS.h>

namespace TagManager {
  const char* ALLOWED_FILE_PATH = "/approved.csv";
  const char* PENDING_FILE_PATH = "/pending.csv";
  const char* TEMP_FILE_PATH = "/tmp.csv";
  const unsigned short MAX_LIST_SIZE = 30;
  int countAllowed = 0;
  int countPending = 0;

  bool initTagManager() {
    if (!SPIFFS.begin()) return false;
  
    if (SPIFFS.exists(ALLOWED_FILE_PATH) &&
        SPIFFS.exists(PENDING_FILE_PATH)) {
      countAllowed = countFileLines(ALLOWED_FILE_PATH);
      countPending = countFileLines(PENDING_FILE_PATH);

      return (TagManager::countAllowed >= 0 && TagManager::countPending >= 0);
    }

    return false;
  }

  bool allowPending(const char* tag, const char* owner) {
    if (TagManager::countAllowed >= TagManager::MAX_LIST_SIZE)
      return false;
      
    do {
      if (removeTag(tag, TagManager::PENDING_FILE_PATH)) {
        --TagManager::countPending;
      } else {
        break;
      }

      if (addTag(tag, owner, TagManager::ALLOWED_FILE_PATH)) {
        ++TagManager::countAllowed;
        return true;
      }
    } while (false);
    
    return false;
  }
  
  bool addPending(const char* tag) {
    if (TagManager::countPending < TagManager::MAX_LIST_SIZE &&
        findTagIndex(tag, TagManager::ALLOWED_FILE_PATH) < 0) {

      if (addTag(tag, NULL, TagManager::PENDING_FILE_PATH)) {
        ++TagManager::countPending;
        return true;
      }
    }
    return false;
  }

  bool disallowTag(const char* tag) {
    if (removeTag(tag, TagManager::ALLOWED_FILE_PATH)) {
      --TagManager::countAllowed;
      return true;
    }
    return false;
  }

  bool removePending(const char* tag) {
    if (removeTag(tag, PENDING_FILE_PATH)) {
      --TagManager::countPending;
      return true;
    }
    return false;
  }

  bool addTag(const char* tag, const char* owner, const char* path) {
    if (findTagIndex(tag, path) < 0) {
      File file = SPIFFS.open(path, "a");
      if (file) {
        file.print(tag);
        if (owner) {
          file.print(',');
          file.print(owner);
        }
        file.print('\n');
        file.close();
        return true;
      }
    }
    return false;
  }

  bool removeTag(const char* tag, const char* path) {
    int index = TagManager::findTagIndex(tag, path);
    if (index >= 0) {
      if (TagManager::removeLineFromFile(path, index)) {
        return true;
      }
    }
    return false;
  }
  
  int countFileLines(const char* path) {
    String line;
    File file = SPIFFS.open(path, "r");
    if (!file) return -1;

    int count = 0;
    while ((line = file.readStringUntil('\n')).length() > 0) ++count;
    file.close();
    return count;
  }
  
  bool isTagAllowed(const char* tag) {
    return (TagManager::findTagIndex(tag, TagManager::ALLOWED_FILE_PATH) >= 0);
  }
  
  int findTagIndex(const char* tag, const char* path) {
    int index = 0;
    File file = SPIFFS.open(path, "r");
    if (file) {
      String line;
      while ((line = file.readStringUntil('\n')).length() > 0) {
        if (line.indexOf(tag) >= 0) break;
        ++index;
      }
      file.close();

      if (line.length() > 0) return index;
    }
    return -1;
  }
  
  bool removeLineFromFile(const char* path, int index) {
    File file = SPIFFS.open(path, "r");
    File tempFile = SPIFFS.open(TagManager::TEMP_FILE_PATH, "w");
    
    if (tempFile && file) {
      String line;
      int count = 0;
      while ((line = file.readStringUntil('\n')).length() > 0) {
        if (count == index) {
          ++count;
          continue;
        }
        
        tempFile.println(line);
        ++count;
      }
      tempFile.close();
      file.close();
  
      return (SPIFFS.remove(path) &&
              SPIFFS.rename(TagManager::TEMP_FILE_PATH, path));
    }
    return false;
  }
  
  void debugFile(const char* path) {
    if (SPIFFS.exists(path)) {
      File file = SPIFFS.open(path, "r");
      String line;
      while ((line = file.readStringUntil('\n')).length() > 0) {
        Serial.println(line);
      }
      file.close();
    } else {
      Serial.println("File not found!");
    }
  }
}
