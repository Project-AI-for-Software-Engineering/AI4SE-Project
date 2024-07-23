import http.client
import os
import json
from dotenv import load_dotenv
import getpass

# Load environment variables from .env file
load_dotenv()

# Prompt for API key if not found in environment variables
if not os.environ.get("API_KEY-API_FOOTBALL"):
    os.environ["API_KEY-API_FOOTBALL"] = getpass.getpass("Enter your API key: ")

api_key = os.environ["API_KEY-API_FOOTBALL"]

# Function to get seasons for a team
def get_seasons(team_id):
    conn = http.client.HTTPSConnection("v3.football.api-sports.io")
    headers = {
        'x-rapidapi-host': "v3.football.api-sports.io",
        'x-rapidapi-key': api_key
    }
    conn.request("GET", f"/teams/seasons?team={team_id}", headers=headers)
    res = conn.getresponse()
    data = res.read()
    seasons = json.loads(data.decode("utf-8"))["response"]
    return seasons

# Function to get statistics for a team in a given season
def get_statistics(team_id, season):
    conn = http.client.HTTPSConnection("v3.football.api-sports.io")
    headers = {
        'x-rapidapi-host': "v3.football.api-sports.io",
        'x-rapidapi-key': api_key
    }
    conn.request("GET", f"/teams/statistics?season={season}&team={team_id}&league=39", headers=headers)
    res = conn.getresponse()
    data = res.read()
    statistics = json.loads(data.decode("utf-8"))
    return statistics

# Function to extract important statistics
def filter_season_data(stats):
    # Specify the keys to retain
    keys_to_keep = ['team', 'fixtures', 'goals', 'clean_sheet', 'failed_to_score', 'penalty']
    filtered_data = {key: stats[key] for key in keys_to_keep if key in stats}
    return filtered_data

# Function to get all statistics for a team across all seasons
def get_all_statistics(team_id):
    seasons = get_seasons(team_id)
    all_statistics = {}
    for season in seasons:
        stats = get_statistics(team_id, season)
        if 'response' in stats:
            stats = stats['response']
            important_stats = filter_season_data(stats)
            if important_stats:
                all_statistics[season] = important_stats
    return all_statistics

# Example usage
team_id = 55
all_stats = get_all_statistics(team_id)
print(json.dumps(all_stats, indent=4))
