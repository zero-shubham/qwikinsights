import boto3
import os
from libs import lru_record
from configs import volume

s3 = boto3.resource("s3")

bucket = s3.Bucket("qwikinsights-store")

s3_client = boto3.client("s3",
                         aws_access_key_id="",
                         aws_secret_access_key="",
                         config=boto3.session.Config(signature_version='s3v4')
                         )


def get_upload_url(filename: str, user_id: str, file_path: str):
    if file_path:
        return s3_client.generate_presigned_post("qwikinsights-store",  "{}/{}/{}".format(user_id, file_path, filename))
    else:
        return s3_client.generate_presigned_post("qwikinsights-store",  "{}/{}".format(user_id, filename))


def get_file_to_local(filename: str, user_id: str, file_path: str, file_size: int, allowed_size: int):
    # delete least_recently_used file if there is no available space
    if lru_record.update_record(user_id, filename, file_path, file_size, allowed_size):
        if file_path:
            resp = s3_client.get_object(Bucket="qwikinsights-store", Key="{}/{}/{}".format(user_id, file_path, filename))
            if not os.path.exists("{}/data/{}/{}".format(volume, user_id, file_path)):
                os.makedirs("{}/data/{}/{}".format(volume, user_id, file_path))
            with open(file="{}/data/{}/{}/{}".format(volume, user_id, file_path, filename), mode="wb") as file:
                file.write(resp["Body"].read())
        else:
            resp = s3_client.get_object(Bucket="qwikinsights-store", Key="{}/{}".format(user_id, filename))
            with open(file="{}/data/{}/{}".format(volume, user_id, filename), mode="wb") as file:
                file.write(resp["Body"].read())


def delete_file(filename: str, user_id: str, file_path: str):
    lru_record.delete_record(user_id, filename)
    try:
        if file_path:
            s3_client.delete_object(Bucket="qwikinsights-store", Key="{}/{}/{}".format(user_id, file_path, filename))
        else:
            s3_client.delete_object(Bucket="qwikinsights-store", Key="{}/{}".format(user_id, filename))
    except Exception as e:
        print(e)

