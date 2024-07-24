from rest_framework import serializers

# Define un serializador para el análisis de partidos
class MatchAnalysisSerializer(serializers.Serializer):
    # Define un campo de tipo entero para 'team1_id'
    team1_id = serializers.IntegerField()
    
    # Define un campo de tipo entero para 'team2_id'
    team2_id = serializers.IntegerField()
    
    # Define un campo de tipo entero para 'league'
    league = serializers.IntegerField()
