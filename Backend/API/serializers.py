from rest_framework import serializers

class MatchAnalysisSerializer(serializers.Serializer):
    team1_id = serializers.IntegerField()
    team2_id = serializers.IntegerField()
    league = serializers.IntegerField()