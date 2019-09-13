import time
import os
import json
from configs import volume
# this function works on the logic of "Least Recently Used" file, it deleted LRU file
# this function gets called only when the app downloads a file from s3 and cache it to local disk


def update_record(user_id: str, filename: str, file_path: str, file_size: int, allowed_size: int):
    global data, total_size
    get_file_flag = False
    total_size = 0

    if not os.path.exists("{}/data/{}".format(volume, user_id)):
        os.makedirs("{}/data/{}".format(volume, user_id))

    # current size of the directory
    if os.path.isfile("{}/data/{}/total_size.json".format(volume, user_id)):
        with open("{}/data/{}/total_size.json".format(volume, user_id), "r") as file:
            size = json.load(file)
            total_size = size["size"]

    # ========================================================================
    if os.path.isfile("{}/data/{}/timestamp.json".format(volume, user_id)):
        with open("{}/data/{}/timestamp.json".format(volume, user_id), "r") as file:
            data = json.load(file)

        # lowest timestamp
        low = 0
        low_key = ''
        with open("{}/data/{}/timestamp.json".format(volume, user_id), "w") as file:
            if filename not in data.keys():
                # filename is not present no matter what get the file
                get_file_flag = True
                # if there is not enough slot remove the least recently used file
                if total_size + file_size > allowed_size:
                    for key, value in data.items():
                        if low == 0:
                            low = value
                            low_key = key
                        else:
                            if value < low:
                                low = value
                                low_key = key
                    if low_key != "":
                        del data[low_key]
                        # below line deletes the file
                        os.remove("{}/data/{}/{}/{}".format(volume, user_id, file_path, low_key))

            data[filename] = time.time()
            json.dump(data, file)

    else:
        # if the file is being created for the first time surely file is to be downloaded
        with open("{}/data/{}/timestamp.json".format(volume, user_id), "w") as file:
            data = dict()
            data[filename] = time.time()
            json.dump(data, file)
            get_file_flag = True

    update_size(user_id, file_size)
    return get_file_flag


def delete_record(user_id: str, filename: str):
    global data
    if os.path.isfile("{}/data/{}/timestamp.json".format(volume, user_id)):
        with open("{}/data/{}/timestamp.json".format(volume, user_id), "r") as file:
            data = json.load(file)

        try:
            del data[filename]
            os.remove(filename)
            update_size(user_id)
        except Exception:
            pass

        with open("{}/data/{}/timestamp.json".format(volume, user_id), "w") as file:
            json.dump(data, file)


# get the current size and add it with the file size
def update_size(user_id, current_file_size):
    with open("{}/data/{}/total_size.json".format(volume, user_id), "w") as file:
        size = dict()
        size["size"] = recursive_dir_size("{}/data/{}".format(volume, user_id)) + current_file_size
        json.dump(size, file)


def recursive_dir_size(path):
    size = 0

    for x in os.listdir(path):
        if not os.path.isdir(os.path.join(path, x)):
            size += os.stat(os.path.join(path, x)).st_size
        else:
            size += recursive_dir_size(os.path.join(path, x))

    return size
