from queue import Queue
import threading

class Matcher:
  def __init__(self):
    self._queue = Queue(maxsize = 100)
    self._matches = dict()
    self._lock = threading.Lock()

  # Very simple matching atm. Currently you match with
  # anyone waiting for a chat.
  # Button maching resulting in several request from the
  # same person must be handeled in the mobile application
  def findMatch(self, user: str) -> str:
    matchedUser = None
    if user not in self._queue.queue:
      self._queue.put(user)
    
      while user not in self._matches:
        
        self._lock.acquire()
        if self._queue.qsize() > 1:
          user1 = self._queue.get()
          user2 = self._queue.get()
          if user1 == user2:
            self._queue.put(user1)
          else:
            self._matches[user1] = user2
            self._matches[user2] = user1
        self._lock.release()

      matchedUser = self._matches[user]
      del self._matches[user]  
    
    return matchedUser


