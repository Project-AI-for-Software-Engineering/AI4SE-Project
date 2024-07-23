import http.client
import getpass
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Prompt for API key if not found in environment variables
if not os.environ.get("API_KEY-API_FOOTBALL"):
    os.environ["API_KEY-API_FOOTBALL"] = getpass.getpass("Enter your OpenAI API key: ")

api_key = os.environ["API_KEY-API_FOOTBALL"]

# Establish connection to the API
conn = http.client.HTTPSConnection("v3.football.api-sports.io")

headers = {
    'x-rapidapi-host': "v3.football.api-sports.io",
    'x-rapidapi-key': api_key
}

# Make the request
conn.request("GET", "/fixtures/rounds?season=2019&league=61", headers=headers)

# Get the response
res = conn.getresponse()
data = res.read()

# Print the response data
print(data.decode("utf-8"))

