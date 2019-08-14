import time
import queue
import threading
import struct
import sys
import os
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler

if __name__ == "__main__" :
	patterns = ".*"
	ignore_patterns = ""
	ignore_directories = False
	case_sensitive = True
	queue = queue.Queue()

	my_event_handler = PatternMatchingEventHandler(patterns, ignore_patterns, ignore_directories, case_sensitive)

	def on_created(event) :
		filenameList = ''.join({event.src_path})
		filenameList1 = filenameList.split("/")
		filename = filenameList1[len(filenameList1)-1]
		absPath = "/home/othai/Downloads/JS_files/"
		if not filename.endswith('crdownload') :
			os.system('python3 is_js.py --f /home/othai/Downloads/JS_files/' + filename)

	#def on_deleted(event) :
		#print(f"{event.src_path} has been deleted.")
	'''
	def read_messages(queue) :
		message_number = 0
		while 1 :
			message_length_bytes = sys.stdin.read(4)
			if len(message_length_bytes) == 0 :
				if queue:
					queue.put(None)
				sys.exit(0)

			message_length = struct.unpack('i', message_length_bytes)[0]

			message = sys.stdin.read(message_length).decode('utf-8')
			#print("message")
			if queue :
				queue.put(message)
			else :
				send_message('{"echo": %s}' % text)
	'''

	my_event_handler.on_created = on_created

	path = "../../../JS_files/"
	my_observer = Observer()
	my_observer.schedule(my_event_handler, path, recursive=True)

	#thread = threading.Thread(target=read_messages, args=(queue,))
	#thread.daemon = True

	#thread.start()
	my_observer.start()

	try :
		while True :
			time.sleep(1)
	except KeyboardInterrupt :
		my_observer.stop()
	my_observer.join()