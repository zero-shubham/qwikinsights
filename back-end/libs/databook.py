import pandas as pd
import inspect

from libs import retn_methods

class Databook:
    # so load is called internally at time of initialization
    def __init__(self, datafile: str, init_df_name: str, datafile_type: str):
        self.datastore = dict()
        self.datafile = datafile
        self.datastore[init_df_name] = self.load(datafile_type)

    def load(self, file_type: str):
        if file_type == "csv":
            return pd.read_csv(self.datafile)
        elif file_type == "json":
            return pd.read_json(self.datafile)
        elif file_type == "excel":
            return pd.read_excel(self.datafile)

    def get_data_as_dict(self, datastore_name: str):
        if datastore_name in self.datastore.keys():
            if type(self.datastore[datastore_name]) == pd.DataFrame:
                ret_data = dict()
                ret_data["data"] = self.datastore[datastore_name].to_json()
                ret_data["columns"] = list(self.datastore[datastore_name].columns)
            elif type(self.datastore[datastore_name]) == pd.Series:
                ret_data = dict()
                ret_data["data"] = list(self.datastore[datastore_name])
                ret_data["columns"] = "list"
            elif type(self.datastore[datastore_name]) == pd.Index:
                ret_data = dict()
                ret_data["data"] = list(self.datastore[datastore_name])
                ret_data["columns"] = "list"
            else:
                ret_data = dict()
                ret_data["data"] = str(self.datastore[datastore_name])
                ret_data["columns"] = "var"

            return ret_data

    def get_all_datastore(self):
        return list(self.datastore.keys())

    def get_methods_and_attr(self, datastore_name: str, _type: str) -> dict:
        method_and_attr = dict()
        if _type == "datastore":
            method_and_attr["methods"] = retn_methods.method
            method_and_attr["attributes"] = retn_methods.attr
        else:
            method_and_attr["msg"] = {
                "msg": "This type doesn't have methods or attributes, or are not yet available for user"
            }
        return method_and_attr

    def apply_method(self, datastore_name, new_datastore_name, method, parameters):
        if method["_type"] == "method":
            apply_method = inspect.getattr_static(self.datastore[datastore_name], method["name"])
            self.datastore[new_datastore_name] = apply_method(self.datastore[datastore_name], **parameters)
        elif method["_type"] == "callable-attribute":
            tuple_pass = (parameters["rows"], parameters["columns"])
            self.datastore[new_datastore_name] = getattr(self.datastore[datastore_name], "iloc").__getitem__(tuple_pass)
        elif method["_type"] == "attribute":
            apply_method = inspect.getattr_static(self.datastore[datastore_name], method["name"])
            self.datastore[new_datastore_name] = apply_method.__get__(self.datastore[datastore_name])

        return self.get_all_datastore()

    def delete_datastore(self, datastore_name: str) -> list:
        if datastore_name in self.datastore.keys():
            del self.datastore[datastore_name]
            return self.get_all_datastore()
        else:
            return []
