import pickle
import os
from libs import databook

from configs import volume
loaded_databooks = dict()


def load_databook(user_id, file_path, databook_name, datastore_name):
    # allow only premium accounts for multiple dtbk loads
    if user_id in loaded_databooks.keys() and databook_name in loaded_databooks[user_id].keys():
        datastore_name = loaded_databooks[user_id][databook_name].get_all_datastore()
        return {"databook_name": databook_name, "datastore_names": datastore_name}

    if not datastore_name:
        datastore_name = "df"

    file_type = file_path.split(".")[-1]

    loaded_databooks[user_id] = dict()
    loaded_databooks[user_id][databook_name] = databook.Databook(file_path, datastore_name, file_type)
    return {"databook_name": databook_name, "datastore_names": [datastore_name]}


def unpickle_databook(user_id, databook_name):
    # allow only premium accounts for multiple dtbk loads
    if user_id in loaded_databooks.keys() and databook_name in loaded_databooks[user_id].keys():
        datastore_name = loaded_databooks[user_id][databook_name].get_all_datastore()
        return {"databook_name": databook_name, "datastore_names": datastore_name}

    with open("{}/pickle_obj/{}/{}.dtbk".format(volume, user_id, databook_name), "rb") as dbk:
        loaded_databooks[user_id] = dict()
        loaded_databooks[user_id][databook_name] = pickle.load(dbk)

    datastore_name = loaded_databooks[user_id][databook_name].get_all_datastore()
    return {"databook_name": databook_name, "datastore_names": datastore_name}


def pickle_databook(user_id, databook_name):
    # allow only premium accounts for multiple dtbk loads
    if user_id not in loaded_databooks.keys() and databook_name not in loaded_databooks[user_id].keys():
        return False

    if not os.path.exists("{}/pickle_obj/{}".format(volume, user_id)):
        os.makedirs("{}/pickle_obj/{}".format(volume, user_id))
    with open("{}/pickle_obj/{}/{}.dtbk".format(volume, user_id, databook_name), "wb") as dbk:
        pickle.dump(loaded_databooks[user_id][databook_name], dbk)
    return True


def unload_databook(user_id, databook_name):
    if databook_name == "all" and user_id in loaded_databooks:
        for dtbk in list(loaded_databooks[user_id]):
            if pickle_databook(user_id, dtbk):
                del loaded_databooks[user_id][dtbk]
        return True
    elif user_id in loaded_databooks and pickle_databook(user_id, databook_name):
        del loaded_databooks[user_id][databook_name]
        return True

    return False


def get_data_for_datastore(user_id, databook_name, datastore_name):
    return loaded_databooks[user_id][databook_name].get_data_as_dict(datastore_name)


def get_methods_and_attr(user_id: int, databook_name: str, datastore_name: str, _type: str) -> dict:
    return loaded_databooks[user_id][databook_name].get_methods_and_attr(datastore_name, _type)


def apply_method(user_id, databook_name, datastore_name, new_datastore_name, method: dict, parameters: dict):
    return loaded_databooks[user_id][databook_name].apply_method(
        datastore_name,
        new_datastore_name,
        method,
        parameters
    )


def delete_datastore(user_id: int, databook_name: str, datastore_name: str):
    if user_id in loaded_databooks.keys() and databook_name in loaded_databooks[user_id].keys():
        return loaded_databooks[user_id][databook_name].delete_datastore(datastore_name)
    else:
        return False
