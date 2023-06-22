import time
from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 10)

    headers = {
        "identification": "U2FsdGVkX1+UaElUa+9DfTT4lR71HuVaEquYI+j2YxJ/AofaIDBcnYteskoZkDrF",
    }

    @task
    def api_signin(self):
        params = {
            "password" : "Grupo01PTRPTI!2",
            "email" : "vavaw95089@camplvad.com",
            "result" : {
                "accessToken": "eyJraWQiOiJaTlwvNmdscTdiNXZmTHFjbzk0VWdHK0JuNWVXR00xMklnOENQQ3JyZk0xdz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJiNWE0MjBhMi0xOTg2LTRhOWMtODVlMC0zMWQ2OWM3ZTIzNjciLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0yLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMl9JOWtaNTRLb0oiLCJjbGllbnRfaWQiOiI1NW1jY3Y2ZW5oanRxdW80cWw5bGVkaTdkZyIsIm9yaWdpbl9qdGkiOiJkNTc5YzY3MS1iMWY1LTQzOTEtYjQ1Ny1kMmU4MjYwMzlmOTEiLCJldmVudF9pZCI6Ijc4MTRhYmM3LWZlMWUtNGU4Yy1iYTFkLTUxZTMxOWZiNTFhMSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2ODczNzU4ODYsImV4cCI6MTY4NzM3OTQ4NiwiaWF0IjoxNjg3Mzc1ODg2LCJqdGkiOiI5MGMyYTQ1Ni03YjY0LTRiMWQtYTA2MC0zZmFhZDIxYzFiYzIiLCJ1c2VybmFtZSI6ImI1YTQyMGEyLTE5ODYtNGE5Yy04NWUwLTMxZDY5YzdlMjM2NyJ9.F6POxQpQ-DaiB0Q3pTrVBuAgzi58d704qCLb_vI6-6zZO6V4PTdL-XJjar_FKT35biN0P3v2eHZ6Ot4Z2bpM8XZpJcop5ul4S8oRm26-CgMtBr5h657liLii7hhFwRL_DSRzsT1v4qzWpqqjN_mXyIR38QU_-KGl5oX-QQ9xdx7pP98Tcsp9IQzc7TyBcXCByJJANkmd3DFHzVhyH4I33ZWHRmCFxh_saE9ZhzpC2dhlAMCaDyZ5YPifVVvM69CoIk66dw183WujS0kbbq6Rf53x6kcnfQCYMx1x7OjpJA7yV1Gb9kjwldFClWvM7jf5HY5NCtuViMzj70RpUqTPEA",
                "client_id": "55mccv6enhjtquo4ql9ledi7dg",
                "idToken": "eyJraWQiOiI5TXgwbTlZNGhmUkNrbjVMaENuNUhOQW9YTXdPMWN6QkhhZjBXMVVxWnN3PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJiNWE0MjBhMi0xOTg2LTRhOWMtODVlMC0zMWQ2OWM3ZTIzNjciLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMi5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTJfSTlrWjU0S29KIiwiY29nbml0bzp1c2VybmFtZSI6ImI1YTQyMGEyLTE5ODYtNGE5Yy04NWUwLTMxZDY5YzdlMjM2NyIsIm9yaWdpbl9qdGkiOiJkNTc5YzY3MS1iMWY1LTQzOTEtYjQ1Ny1kMmU4MjYwMzlmOTEiLCJhdWQiOiI1NW1jY3Y2ZW5oanRxdW80cWw5bGVkaTdkZyIsImV2ZW50X2lkIjoiNzgxNGFiYzctZmUxZS00ZThjLWJhMWQtNTFlMzE5ZmI1MWExIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2ODczNzU4ODYsImV4cCI6MTY4NzM3OTQ4NiwiaWF0IjoxNjg3Mzc1ODg2LCJqdGkiOiJiYjUyMWQwYi1mMjAzLTRhMDMtODMyYi0wMThkOWNiZmI2M2MiLCJlbWFpbCI6InZhdmF3OTUwODlAY2FtcGx2YWQuY29tIn0.dj0Xd8V0k6ASmzuMbRZB8zGXO_rIFezr-6_KjRi1tpk8IYC_osRPOUj2VG_4NNlEBMLG2-Hp9gUGzTOf5FN30t4OsyC1ogcBdWdilRJ8ImwZMSGgHWbI8T12vuVFFkh0E9wu3AE5AMVyJStxj7pbUI1MXcgqt6a5Ka1sKkf63C_hFEZ0IACYdDU9IDLWNVJkQP0y5B_5UhgYmImg38Q84yPqZYiS_WGjsx-0Vw8b7YZT3TTGGW5dJJE5b-xpR-EoWOw1EGi_89Ku6ywuepq6co4cYWESMSh06i_REIgOGRwvqVfzFGLW42tSVxwqBLTY7zOr11ub3kJQe0-mPQ7FPQ"
            }
        }
        self.client.post(url="/signIn",headers=self.headers, params=params)