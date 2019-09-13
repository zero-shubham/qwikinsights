import time
import os
import json
from configs import volume
# this function works on the logic of Least Recently Used file, it deleted LRU file


def update_timestamp(user_id: str, filename: str):
    global data
    get_file_flag = True

    if os.path.isfile("{}/data/{}/timestamp.json".format(volume, user_id)):
        with open("{}/data/{}/timestamp.json".format(volume, user_id), "r") as file:
            data = json.load(file)

        low = 0
        low_key = ''
        with open("{}/data/{}/timestamp.json".format(volume, user_id), "w") as file:
            if len(data) > 4 and filename not in data.keys():
                for key, value in data.items():
                    print(value, "<==")
                    if low == 0:
                        low = value
                        low_key = key
                    else:
                        if value < low:
                            low = value
                            low_key = key

                # if something is deleted get the file else don't get it, it is already present
                if low_key != "":
                    del data[low_key]
                    os.remove(low_key)
                else:
                    get_file_flag = False

            data[filename] = time.time()
            json.dump(data, file)

    else:
        with open("{}/data/{}/timestamp.json".format(volume, user_id), "w") as file:
            data = dict()
            data[filename] = time.time()
            json.dump(data, file)

    return get_file_flag

