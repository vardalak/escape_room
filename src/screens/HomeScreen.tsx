import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { playerProgressManager } from '../services/PlayerProgressManager';

interface Experience {
  id: string;
  name: string;
  theme: string;
  difficulty: 'BEGINNER' | 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  estimatedDuration: number;
  shortDescription: string;
}

interface HomeScreenProps {
  onSelectExperience: (experienceId: string) => void;
}

export default function HomeScreen({ onSelectExperience }: HomeScreenProps) {
  const [loading, setLoading] = useState(true);
  const [completedExperiences, setCompletedExperiences] = useState<Set<string>>(new Set());

  // Available experiences (for now just Training Basement, will expand later)
  const experiences: Experience[] = [
    {
      id: 'training_basement',
      name: 'Training Basement',
      theme: 'Tutorial',
      difficulty: 'BEGINNER',
      estimatedDuration: 15,
      shortDescription: 'Learn the basics of escape room puzzles in this introductory experience. Perfect for beginners!',
    },
    // Add more experiences here as they are created
  ];

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const profile = await playerProgressManager.loadProgress();
      const completed = new Set<string>();

      Object.values(profile.experiences).forEach(exp => {
        if (exp.completed) {
          completed.add(exp.experienceId);
        }
      });

      setCompletedExperiences(completed);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load progress:', error);
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'BEGINNER':
        return '#4CAF50';
      case 'EASY':
        return '#8BC34A';
      case 'MEDIUM':
        return '#FFC107';
      case 'HARD':
        return '#FF9800';
      case 'EXPERT':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const handleSelectExperience = async (experienceId: string) => {
    // Track that the player started this experience
    await playerProgressManager.startExperience(experienceId);
    onSelectExperience(experienceId);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Escape Room Adventures</Text>
        <Text style={styles.subtitle}>Choose Your Experience</Text>
      </View>

      {/* Experience List */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {experiences.map((exp) => {
          const isCompleted = completedExperiences.has(exp.id);
          const difficultyColor = getDifficultyColor(exp.difficulty);

          return (
            <TouchableOpacity
              key={exp.id}
              style={[styles.experienceCard, isCompleted && styles.experienceCardCompleted]}
              onPress={() => handleSelectExperience(exp.id)}
              activeOpacity={0.7}
            >
              {/* Completion Badge */}
              {isCompleted && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedBadgeText}>✓ COMPLETED</Text>
                </View>
              )}

              {/* Experience Info */}
              <View style={styles.experienceHeader}>
                <Text style={styles.experienceName}>{exp.name}</Text>
                <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
                  <Text style={styles.difficultyText}>{exp.difficulty}</Text>
                </View>
              </View>

              <View style={styles.experienceMeta}>
                <Text style={styles.themeText}>{exp.theme}</Text>
                <Text style={styles.durationText}>⏱ {exp.estimatedDuration} min</Text>
              </View>

              <Text style={styles.description}>{exp.shortDescription}</Text>

              {/* Play Button */}
              <View style={styles.playButton}>
                <Text style={styles.playButtonText}>
                  {isCompleted ? 'PLAY AGAIN' : 'START'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Coming Soon Card */}
        <View style={[styles.experienceCard, styles.comingSoonCard]}>
          <Text style={styles.comingSoonTitle}>More Experiences Coming Soon!</Text>
          <Text style={styles.comingSoonText}>
            New escape rooms are being developed. Check back later for more challenges.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
  },
  header: {
    padding: 20,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  experienceCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  experienceCardCompleted: {
    borderColor: '#4CAF50',
  },
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingRight: 100, // Space for completed badge
  },
  experienceName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  difficultyText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  experienceMeta: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  themeText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
  },
  durationText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  description: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  playButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  comingSoonCard: {
    backgroundColor: '#1A1A1A',
    borderColor: '#666666',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888888',
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});
