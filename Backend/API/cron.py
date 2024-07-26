from django_cron import CronJobBase, Schedule
from .views import send_mails

class SendMailsCronJob(CronJobBase):
    RUN_EVERY_MINS = 1

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'API.send_mails_cron_job'  # a unique code

    def do(self):
        send_mails(None)
