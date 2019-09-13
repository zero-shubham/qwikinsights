import smtplib
import time
import calendar
import random
from datetime import date, timedelta
import os
import jinja2
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def get_html(inject_str) -> str:
    template_filename = "./template.html"
    render_vars = dict()
    render_vars["TEXT"] = inject_str

    script_path = os.path.dirname(os.path.abspath(__file__))

    environment = jinja2.Environment(loader=jinja2.FileSystemLoader(script_path))
    output_text = environment.get_template(template_filename).render(render_vars)
    return output_text


TODAY = date.today().strftime("%dth %B %Y")
VALID_TILL = (date.today() + timedelta(days=3)).strftime("%dth %B %Y")
SUBJECT = 'Account activation code'
TEXT = 'Here is your activation code {} generated on {}, and is valid till {}.'

gmail_sender = 'qwikinsights@gmail.com'
gmail_passwd = 'qgkGieejzVW9USn'


def generate_code() -> int:
    random.seed(calendar.timegm(time.gmtime()) * random.random())
    code = int(random.random() * 1000000)
    while code < 100000:
        random.seed(calendar.timegm(time.gmtime()) * random.random())
        code = int(random.random() * 1000000)
    return code


def send_code(to: str) -> tuple:
    global TEXT
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.ehlo()
    server.starttls()
    server.login(gmail_sender, gmail_passwd)

    code = generate_code()
    TEXT = TEXT.format(code, TODAY, VALID_TILL)
    html = get_html(TEXT)
    print(html)
    msg = MIMEMultipart('alternative')
    msg['Subject'] = SUBJECT
    msg['From'] = gmail_sender
    msg['To'] = to

    body = MIMEText(html, 'html')
    msg.attach(body)
    try:
        server.sendmail(gmail_sender, [to], msg.as_string())
        server.quit()
        return code, date.today()
    except:
        server.quit()
        return ()
