import http.client
import os
import json
from dotenv import load_dotenv
import getpass
import openai
import re

# Load environment variables from .env file
load_dotenv()

# Prompt for API key if not found in environment variables
if not os.environ.get("API_KEY-API_FOOTBALL"):
    os.environ["API_KEY-API_FOOTBALL"] = getpass.getpass("Enter your API key: ")

if not os.environ.get("OPENAI_API_KEY"):
    os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter your API key: ")

api_key = os.environ["API_KEY-API_FOOTBALL"]
client = openai.OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)


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
def get_statistics(team_id, season, league):
    conn = http.client.HTTPSConnection("v3.football.api-sports.io")
    headers = {
        'x-rapidapi-host': "v3.football.api-sports.io",
        'x-rapidapi-key': api_key
    }
    conn.request("GET", f"/teams/statistics?season={season}&team={team_id}&league={league}", headers=headers)
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
def get_all_statistics(team_id, league):
    seasons = get_seasons(team_id)
    all_statistics = {}
    for season in seasons:
        stats = get_statistics(team_id, season, league)
        if 'response' in stats:
            stats = stats['response']
            important_stats = filter_season_data(stats)
            if important_stats:
                all_statistics[season] = important_stats
    return all_statistics

# Function to call ChatGPT 3.5 Turbo
def call_chatgpt(prompt):
    completion = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": 
            """
            You are an expert sports bet analyst. You are provided with detailed statistics for two football teams across several seasons. Your task is to analyze the provided statistics and determine which team is more likely to win in a match against each other. Consider factors such as overall performance, goals scored, goals conceded, win/loss streaks, clean sheets, and other relevant data points shown.

Use the following example for the analysis:

Compare total wins, draws, and losses.
Analyze goals for and against, both home and away.
Consider clean sheets and failed to score metrics.
Factor in penalty success rates.
At the end of your analysis, choose the winning team with the following structure:

Winner: {team_id}

Example:

Team 33: {2010: {'team': {'id': 33, 'name': 'Manchester United'}, 'fixtures': {'played': 37, 'wins': 22, 'draws': 11, 'loses': 4}, 'goals': {'for': 74, 'against': 35}, 'clean_sheet': 15, 'failed_to_score': 5, 'penalty': {'scored': 3, 'missed': 0}}, ...}

Team 34: {2010: {'team': {'id': 34, 'name': 'Newcastle'}, 'fixtures': {'played': 37, 'wins': 11, 'draws': 12, 'loses': 14}, 'goals': {'for': 53, 'against': 54}, 'clean_sheet': 9, 'failed_to_score': 10, 'penalty': {'scored': 5, 'missed': 0}}, ...}

Analysis:

Manchester United has more wins, fewer losses, and more goals for.
Newcastle has more goals against and fewer clean sheets.
Winner: 33
             """},
            {"role": "user", "content": prompt}
        ],
    )
    return completion.choices[0].message.content

# Function to extract the winner's team ID from the analysis
def extract_winner_id(analysis):
    match = re.search(r"Winner: (\d+)", analysis)
    if match:
        return match.group(1)
    return None

def main(team1_id, team2_id, league):
    team1_stats = get_all_statistics(team1_id, league)
    team2_stats = get_all_statistics(team2_id, league)
    prompt = f"Team {team1_id}:\n {json.dumps(team1_stats, indent=4)}\n\nTeam {team2_id}:\n {json.dumps(team2_stats, indent=4)}"
    analysis = call_chatgpt(prompt)
    winner_id = extract_winner_id(analysis)
    return analysis, winner_id