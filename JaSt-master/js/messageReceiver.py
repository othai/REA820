import sys
import json

def get_message() :
	raw_length = sys.stdin.read(4)
	if not raw_length :
		sys.exit(0)

	message_length = struct.unpack('@I', raw_length.encode())[0]
	message = sys.stdin.read(message_length)

	return json.loads(message)

while True :
	message = get_message()