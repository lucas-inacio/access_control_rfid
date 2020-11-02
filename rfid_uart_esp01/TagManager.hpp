#ifndef TAG_MANAGER_HPP
#define TAG_MANAGER_HPP

namespace TagManager {
  extern const char* ALLOWED_FILE_PATH;
  extern const char* PENDING_FILE_PATH;
  extern const char* TEMP_FILE_PATH;
  extern const unsigned short MAX_LIST_SIZE;
  extern int countAllowed;
  extern int countPending;

  bool initTagManager();

  // Remove a tag da lista de espera e adiciona à lista de autorizados
  bool allowPending(const char* tag, const char* owner);

  // Adiciona uma tag à lista de espera
  bool addPending(const char* tag);

  // Remove a tag da lista de autorizados
  bool disallowTag(const char* tag);

  // Remove uma tag da lista de espera
  bool removePending(const char* tag);

  // Adiciona um novo registro ao arquivo especificado por path.
  // Se owner não for nulo é adicionado após uma vírgula depois de tag.
  // Ao menos tag deve ser fornecido
  bool addTag(const char* tag, const char* owner, const char* path);

  bool removeTag(const char* tag, const char* path);
  
  int countFileLines(const char* path);
  
  bool isTagAllowed(const char* tag);

  // Retorna o índice da prinmeira correspondência de tag no arquivo.
  // Retorna -1 se não encontrar
  int findTagIndex(const char* tag, const char* path);
  
  bool removeLineFromFile(const char* path, int index);
  
  void debugFile(const char* path);
}

#endif // TAG_MANAGER_HPP
